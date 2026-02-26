import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/utils/supabase/server";

// Init Supabase admin client here since we need to bypass RLS for secure order creation/bonus assigning
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, name, phone, cityName, cityRef, branchName, branchRef, bonusesUsed, paymentMethod, total_price } = body;

    // 1. Validate inputs
    if (!items?.length) return NextResponse.json({ error: "Empty cart" }, { status: 400 });

    // 2. Create Order in DB
    // Try to get authenticated user session securely
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 2.1 Fetch actual product data from DB to prevent price tampering
    const productIds = items.map((i: any) => i.product.id);
    const { data: dbProducts, error: dbError } = await supabaseAdmin
      .from("products")
      .select("id, price, bonus_percent")
      .in("id", productIds);

    if (dbError || !dbProducts) throw new Error("Failed to verify product prices");

    // 2.2 Recalculate total on server
    let serverTotal = 0;
    const validatedItems = items.map((cartItem: any) => {
      const dbProduct = dbProducts.find(p => p.id === cartItem.product.id);
      if (!dbProduct) throw new Error(`Product not found: ${cartItem.product.id}`);
      
      const subtotal = Number(dbProduct.price) * cartItem.quantity;
      serverTotal += subtotal;
      
      return {
        ...cartItem,
        product: {
          ...cartItem.product,
          price: Number(dbProduct.price),
          bonus_percent: Number(dbProduct.bonus_percent)
        }
      };
    });

    // 2.3 Check bonuses if user is logged in
    let finalBonusesUsed = 0;
    if (user && bonusesUsed > 0) {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("bonus_balance")
        .eq("id", user.id)
        .single();
      
      const maxAvailable = Number(profile?.bonus_balance || 0);
      finalBonusesUsed = Math.min(bonusesUsed, maxAvailable, serverTotal); 
    }

    const finalTotalPrice = serverTotal - finalBonusesUsed;

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user?.id || null,
        items_json: validatedItems,
        total_price: finalTotalPrice,
        bonuses_used: finalBonusesUsed,
        payment_status: paymentMethod === "mono" ? "pending" : "awaiting_check",
        payment_method: paymentMethod,
        delivery_data: { 
          name, 
          phone, 
          city: cityName || cityRef, 
          branch: branchName || branchRef 
        }
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2.5 Freeze bonuses from user profile if used
    if (user && finalBonusesUsed > 0) {
      const { error: bonusError } = await supabaseAdmin.rpc('freeze_bonuses', {
        user_id_val: user.id,
        amount_val: finalBonusesUsed
      });
      
      if (bonusError) {
        console.error("Bonus freezing error:", bonusError);
      }
    }

    // 3. Process based on payment method
    if (paymentMethod === "mono") {
      // Flow A: MonoBank Payment
      // Request mono invoice
      const monoReqBody = {
        amount: Math.round(finalTotalPrice * 100), // in kopecks
        ccy: 980,
        merchantPaymInfo: {
          reference: order.id,
          destination: "Оплата замовлення SUSHI ICONS",
          basketOrder: validatedItems.map((i: any) => ({
            name: i.product.name,
            qty: i.quantity,
            sum: Math.round((i.product.price * i.quantity) * 100),
            icon: i.product.image_url,
            unit: "шт.",
          })),
        },
        redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
        webHookUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mono`,
      };

      // Real MonoBank Request
      const monoRes = await fetch("https://api.monobank.ua/api/merchant/invoice/create", {
        method: "POST",
        headers: { 
          "X-Token": process.env.MONOBANK_API_KEY!,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(monoReqBody),
      });

      if (!monoRes.ok) {
        const errText = await monoRes.text();
        console.error("MonoBank API Error:", errText, "Status:", monoRes.status);
        throw new Error(`MonoBank: ${errText || "Не вдалося створити рахунок"}`);
      }

      const monoData = await monoRes.json();
      return NextResponse.json({ url: monoData.pageUrl });
    } else {
      // Flow B: Manual Details Payment (Telegram Admin)
      const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
      const ADMIN_ID = process.env.ADMIN_TELEGRAM_ID;

      if (BOT_TOKEN && ADMIN_ID) {
        const messageText = `🔵 *Нове замовлення (Реквізити)*
ID: \`${order.id}\`
Клієнт: ${name} (${phone})
Доставка: ${cityName}, ${branchName}
Сума до оплати: *${finalTotalPrice} ₴*
Використано бонусів: ${finalBonusesUsed} ₴

*Очікує ручної перевірки оплати!*`;

        const keyboard = {
          inline_keyboard: [
            [
              { text: "✅ ПІДТВЕРДИТИ ОПЛАТУ", callback_data: `confirm_${order.id}` },
              { text: "❌ СКАСУВАТИ", callback_data: `cancel_${order.id}` }
            ]
          ]
        };

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: ADMIN_ID,
            text: messageText,
            parse_mode: "Markdown",
            reply_markup: keyboard
          })
        });
      }

      return NextResponse.json({ success: true, orderId: order.id });
    }

  } catch (err: unknown) {
    console.error("Checkout Error:", err);
    return NextResponse.json({ error: (err as Error).message || "Unknown error" }, { status: 500 });
  }
}
