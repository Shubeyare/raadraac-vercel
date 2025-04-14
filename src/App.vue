<script setup lang="ts">
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();

// Check for saved language preference
onMounted(() => {
  const savedLocale = localStorage.getItem("locale");
  if (savedLocale && (savedLocale === "en" || savedLocale === "so")) {
    locale.value = savedLocale;
  }
});

const toggleLanguage = () => {
  try {
    const newLocale = locale.value === "en" ? "so" : "en";
    locale.value = newLocale;
    localStorage.setItem("locale", newLocale);
    console.log("Language switched to:", newLocale);
  } catch (error) {
    console.error("Error switching language:", error);
  }
};
</script>

<template>
  <div class="app-container">
    <header class="bg-primary text-white shadow-md">
      <div
        class="container mx-auto px-4 py-4 flex items-center justify-between"
      >
        <router-link to="/" class="text-2xl font-bold">{{
          t("app.name")
        }}</router-link>

        <div class="flex items-center space-x-6">
          <nav class="flex space-x-4">
            <router-link to="/" class="hover:text-gray-200">{{
              t("nav.home")
            }}</router-link>
            <router-link to="/about" class="hover:text-gray-200">{{
              t("nav.about")
            }}</router-link>
          </nav>

          <button
            @click="toggleLanguage"
            class="px-3 py-1 rounded bg-accent hover:bg-opacity-90 text-white"
          >
            {{ locale === "en" ? "SO" : "EN" }}
          </button>
        </div>
      </div>
    </header>

    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="bg-gray-100 py-4 text-center text-gray-600 text-sm">
      <p>© {{ new Date().getFullYear() }} {{ t("app.name") }}</p>
    </footer>
  </div>
</template>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
