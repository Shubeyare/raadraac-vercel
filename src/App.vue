<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const mobileMenuOpen = ref(false);
const currentLang = ref("en");

// Check for saved language preference
onMounted(() => {
  const savedLocale = localStorage.getItem("locale");
  if (savedLocale && (savedLocale === "en" || savedLocale === "so")) {
    locale.value = savedLocale;
    currentLang.value = savedLocale;
  }
});

// Toggle language
const toggleLanguage = () => {
  try {
    const newLocale = currentLang.value === "en" ? "so" : "en";
    locale.value = newLocale;
    currentLang.value = newLocale;
    localStorage.setItem("locale", newLocale);
    console.log("Language switched to:", newLocale);

    // Close mobile menu when changing language
    if (mobileMenuOpen.value) {
      closeMobileMenu();
    }
  } catch (error) {
    console.error("Error switching language:", error);
  }
};

// Mobile menu functions
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;

  // Prevent body scroll when menu is open
  if (mobileMenuOpen.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
  document.body.style.overflow = "";
};
</script>

<template>
  <div class="app min-h-screen flex flex-col">
    <header class="sticky top-0 bg-white shadow-sm z-40">
      <div class="container-responsive py-4 flex items-center justify-between">
        <!-- Logo -->
        <router-link
          to="/"
          class="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
        >
          <img src="/favicon.svg" alt="Logo" class="w-8 h-8" />
          <span class="text-xl font-bold tracking-tight text-accent"
            >Raadraac</span
          >
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-6">
          <router-link
            to="/"
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === '/' }"
          >
            {{ t("nav.home") }}
          </router-link>
          <router-link
            to="/about"
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === '/about' }"
          >
            {{ t("nav.about") }}
          </router-link>
          <button @click="toggleLanguage" class="btn btn-ghost btn-icon group">
            <span class="sr-only">{{ t("nav.language") }}</span>
            <span
              class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-light text-primary-dark group-hover:bg-primary group-hover:text-white transition-colors"
            >
              {{ currentLang === "en" ? "EN" : "SO" }}
            </span>
          </button>
        </nav>

        <!-- Mobile Menu Toggle -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden btn btn-ghost btn-icon"
        >
          <span class="sr-only">Toggle Menu</span>
          <div
            class="flex flex-col justify-center items-center w-6 h-6 space-y-1.5 relative"
          >
            <span
              class="block w-6 h-0.5 bg-foreground rounded-full transition-transform duration-300"
              :class="{ 'rotate-45 translate-y-2': mobileMenuOpen }"
            >
            </span>
            <span
              class="block w-6 h-0.5 bg-foreground rounded-full transition-opacity duration-300"
              :class="{ 'opacity-0': mobileMenuOpen }"
            >
            </span>
            <span
              class="block w-6 h-0.5 bg-foreground rounded-full transition-transform duration-300"
              :class="{ '-rotate-45 -translate-y-2': mobileMenuOpen }"
            >
            </span>
          </div>
        </button>
      </div>
    </header>

    <!-- Mobile Menu -->
    <div
      class="mobile-menu-overlay"
      :class="{ open: mobileMenuOpen, closed: !mobileMenuOpen }"
      @click="closeMobileMenu"
    ></div>

    <div
      class="mobile-menu"
      :class="{ open: mobileMenuOpen, closed: !mobileMenuOpen }"
    >
      <div class="p-6 flex flex-col h-full">
        <div class="flex justify-between items-center mb-8">
          <span class="text-lg font-semibold">{{ t("app.name") }}</span>
          <button @click="closeMobileMenu" class="btn btn-ghost btn-icon">
            <span class="sr-only">Close Menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <nav class="flex flex-col space-y-4">
          <router-link
            to="/"
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': $route.path === '/' }"
            @click="closeMobileMenu"
          >
            {{ t("nav.home") }}
          </router-link>

          <router-link
            to="/about"
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': $route.path === '/about' }"
            @click="closeMobileMenu"
          >
            {{ t("nav.about") }}
          </router-link>
        </nav>

        <div class="mt-auto pt-6 border-t border-gray-100">
          <button
            @click="toggleLanguage"
            class="flex items-center space-x-2 p-4 w-full rounded-lg text-left hover:bg-gray-50 transition-colors"
          >
            <div
              class="h-8 w-8 rounded-full bg-primary-light text-primary-dark flex items-center justify-center"
            >
              {{ currentLang === "en" ? "EN" : "SO" }}
            </div>
            <span>{{ currentLang === "en" ? "English" : "Soomaali" }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-50 border-t border-gray-100 py-6 mt-auto">
      <div class="container-responsive">
        <div
          class="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div class="flex items-center gap-2">
            <img src="/favicon.svg" alt="Logo" class="w-6 h-6" />
            <span class="text-sm font-medium text-gray-500">{{
              t("app.name")
            }}</span>
          </div>

          <p class="text-sm text-gray-500">
            {{ t("app.subtitle") }}
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Navigation links */
.nav-link {
  @apply relative text-gray-700 font-medium hover:text-accent transition-colors py-1;
}

.nav-link::after {
  content: "";
  @apply absolute left-0 bottom-0 w-0 h-0.5 bg-accent transition-all duration-300;
}

.nav-link:hover::after,
.nav-link-active::after {
  @apply w-full;
}

.nav-link-active {
  @apply text-accent;
}

/* Mobile navigation links */
.mobile-nav-link {
  @apply block py-3 px-4 rounded-lg text-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors;
}

.mobile-nav-link-active {
  @apply bg-primary-light text-primary-dark;
}

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
