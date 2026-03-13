export const SITE_CONFIG = {
  currency: "₴",
  name: process.env.NEXT_PUBLIC_SITE_NAME || "FROZEN MARKET",
  shortName: process.env.NEXT_PUBLIC_SITE_SHORT_NAME || "FROZEN",
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || "Market",
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Преміальні заморожені продукти з доставкою до ваших дверей. Смак, якість та зручність у кожному продукті.",
  contacts: {
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+380 95 372 75 99",
    phoneDisplay: process.env.NEXT_PUBLIC_CONTACT_PHONE_DISPLAY || "(095) 372 75 99",
    phoneRaw: process.env.NEXT_PUBLIC_CONTACT_PHONE_RAW || "+380953727599",
    address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || "вул. Грушевського, 97в",
    workingHours: {
      weekdays: process.env.NEXT_PUBLIC_HOURS_WEEKDAYS || "09:00 - 21:00",
      weekends: process.env.NEXT_PUBLIC_HOURS_WEEKENDS || "10:00 - 19:00",
    }
  },
  socials: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com",
    telegram: process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/frozen_market_ua",
    telegramHandle: process.env.NEXT_PUBLIC_TELEGRAM_HANDLE || "@frozen_market_ua",
  },
  admin: {
    title: "Frozen Admin",
    subtitle: "Management Tool",
    defaultName: "Admin"
  },
  paymentRequisites: {
    bankName: process.env.NEXT_PUBLIC_PAYMENT_BANK_NAME || "АТ «Універсальний банк»",
    iban: process.env.NEXT_PUBLIC_PAYMENT_IBAN || "UA123456789012345678901234567",
    recipient: process.env.NEXT_PUBLIC_PAYMENT_RECIPIENT || "ТОВ «FROZEN MARKET»",
    edrpou: process.env.NEXT_PUBLIC_PAYMENT_EDRPOU || "12345678",
    purpose: process.env.NEXT_PUBLIC_PAYMENT_PURPOSE || "Оплата замовлення на FROZEN MARKET",
  }
};
