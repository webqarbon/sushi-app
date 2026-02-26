"use server";

export async function sendConsultationRequest(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string || "Без повідомлення";

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const ADMIN_ID = process.env.ADMIN_TELEGRAM_ID;

  if (!BOT_TOKEN || !ADMIN_ID) {
    console.error("Telegram credentials missing");
    return { error: "Помилка сервера. Спробуйте пізніше." };
  }

  const text = `📬 *Нова заявка на консультацію!*
  
👤 Ім'я: ${name}
📞 Телефон: ${phone}
💬 Повідомлення: ${message}

#заявка #консультація`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: ADMIN_ID,
        text: text,
        parse_mode: "Markdown",
      }),
    });

    if (!res.ok) {
      throw new Error("Telegram API error");
    }

    return { success: "Дякуємо! Ми зателефонуємо вам найближчим часом." };
  } catch (error) {
    console.error("Contact Form Error:", error);
    return { error: "Не вдалося надіслати заявку. Спробуйте ще раз." };
  }
}
