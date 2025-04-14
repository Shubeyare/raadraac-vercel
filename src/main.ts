import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import router from "./router";
import "./style.css";

// Import Font Awesome
import "@fortawesome/fontawesome-free/css/all.min.css";

// Initialize TensorFlow in the background
import("@tensorflow/tfjs")
  .then(() => {
    console.log("TensorFlow.js loaded successfully");
  })
  .catch((error) => {
    console.error("Error loading TensorFlow.js:", error);
  });

// Import translations
import en from "./locales/en.json";
import so from "./locales/so.json";

console.log("Translations loaded:", {
  en: typeof en === "object" ? Object.keys(en).length + " keys" : "invalid",
  so: typeof so === "object" ? Object.keys(so).length + " keys" : "invalid",
});

// Create i18n instance
const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: { en, so },
  warnHtmlInMessage: "off",
  missingWarn: false,
  fallbackWarn: false,
});

// Comment out PWA registration to fix build
// import { registerSW } from "virtual:pwa-register";
// const updateSW = registerSW({
//   onNeedRefresh() {},
//   onOfflineReady() {},
// });

// Create and configure the app
const app = createApp(App);

// Add global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error("Global error:", err);
  console.log("Error info:", info);
  console.log("Component instance:", instance);
};

// Register plugins
app.use(createPinia());
app.use(router);
app.use(i18n);

console.log("App initialized, mounting to #app");
// Mount the app
app.mount("#app");
