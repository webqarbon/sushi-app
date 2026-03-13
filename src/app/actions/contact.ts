"use server";

const MAX_NAME = 100;
const MAX_PHONE = 30;
const MAX_MESSAGE = 2000;

export async function sendConsultationRequest(formData: FormData) {
  const name = String(formData.get("name") || "").trim().slice(0, MAX_NAME);
  const phone = String(formData.get("phone") || "").trim().slice(0, MAX_PHONE);
  const message = (String(formData.get("message") || "Без повідомлення").trim().slice(0, MAX_MESSAGE)) || "Без повідомлення";

  if (!name || name.length < 2) {
    return { error: "Введіть ім'я (мінімум 2 символи)" };
  }
  if (!phone || phone.length < 10) {
    return { error: "Введіть коректний номер телефону" };
  }

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
