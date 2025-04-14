import { createI18n } from "vue-i18n";
import en from "../locales/en.json";
import so from "../locales/so.json";

type MessageSchema = typeof en;

const i18n = createI18n<[MessageSchema], "en" | "so">({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en,
    so,
  },
});

export default i18n;
