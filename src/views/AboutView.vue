<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="animate-fade-in">
    <!-- Hero Section -->
    <section
      class="bg-gradient-to-b from-primary-light/30 to-background pt-12 pb-16 mb-8"
    >
      <div class="container-responsive text-center">
        <h1 class="text-3xl md:text-5xl font-bold mb-6 text-primary-dark">
          {{ t("about.title") }}
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          {{ t("about.description") }}
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <div class="container-responsive py-8">
      <div class="max-w-4xl mx-auto">
        <!-- How It Works Section -->
        <div class="card p-8 mb-12">
          <h2 class="text-2xl font-bold mb-8 text-center text-primary-dark">
            {{ t("about.how") }}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Step 1 -->
            <div
              class="flex flex-col items-center text-center transition-all duration-300 hover:transform hover:scale-105"
            >
              <div
                class="w-16 h-16 rounded-full bg-primary-light mb-4 flex items-center justify-center text-primary-dark"
              >
                <span class="text-xl font-bold">1</span>
              </div>
              <h3 class="text-lg font-semibold mb-2">{{ t("about.step1") }}</h3>
              <p class="text-gray-600">
                Use your camera or select an image from your device
              </p>
            </div>

            <!-- Step 2 -->
            <div
              class="flex flex-col items-center text-center transition-all duration-300 hover:transform hover:scale-105"
            >
              <div
                class="w-16 h-16 rounded-full bg-primary-light mb-4 flex items-center justify-center text-primary-dark"
              >
                <span class="text-xl font-bold">2</span>
              </div>
              <h3 class="text-lg font-semibold mb-2">{{ t("about.step2") }}</h3>
              <p class="text-gray-600">
                Advanced AI technology identifies the Somali cultural object
              </p>
            </div>

            <!-- Step 3 -->
            <div
              class="flex flex-col items-center text-center transition-all duration-300 hover:transform hover:scale-105"
            >
              <div
                class="w-16 h-16 rounded-full bg-primary-light mb-4 flex items-center justify-center text-primary-dark"
              >
                <span class="text-xl font-bold">3</span>
              </div>
              <h3 class="text-lg font-semibold mb-2">{{ t("about.step3") }}</h3>
              <p class="text-gray-600">
                Discover rich cultural information and historical context
              </p>
            </div>
          </div>
        </div>

        <!-- Cultural Significance -->
        <div class="mb-12">
          <h2 class="text-2xl font-bold mb-6 text-primary-dark">
            Preserving Cultural Heritage
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="card p-6 h-full flex flex-col">
              <h3 class="text-lg font-semibold mb-3 flex items-center">
                <i class="fas fa-history text-accent mr-2"></i>
                Cultural Preservation
              </h3>
              <p class="text-gray-600 flex-grow">
                Raadraac helps document and preserve knowledge about traditional
                Somali objects that are becoming less common in modern life,
                ensuring cultural heritage is passed to future generations.
              </p>
            </div>

            <div class="card p-6 h-full flex flex-col">
              <h3 class="text-lg font-semibold mb-3 flex items-center">
                <i class="fas fa-graduation-cap text-accent mr-2"></i>
                Educational Tool
              </h3>
              <p class="text-gray-600 flex-grow">
                Perfect for students, researchers, and anyone interested in
                learning about Somali material culture and craftsmanship
                traditions.
              </p>
            </div>
          </div>
        </div>

        <!-- Technology Used -->
        <div class="card p-6 mb-12">
          <h2 class="text-2xl font-bold mb-6 text-primary-dark">Technology</h2>

          <div class="flex flex-col md:flex-row items-start gap-4 md:gap-8">
            <div
              class="w-full md:w-1/3 flex flex-col items-center text-center md:border-r border-gray-100 pr-0 md:pr-8"
            >
              <div
                class="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-3"
              >
                <i class="fas fa-brain"></i>
              </div>
              <h3 class="text-lg font-semibold mb-1">Machine Learning</h3>
              <p class="text-gray-600 text-sm">
                Powered by TensorFlow.js using custom trained models
              </p>
            </div>

            <div
              class="w-full md:w-1/3 flex flex-col items-center text-center md:border-r border-gray-100 pr-0 md:pr-8"
            >
              <div
                class="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-3"
              >
                <i class="fas fa-mobile-alt"></i>
              </div>
              <h3 class="text-lg font-semibold mb-1">Mobile-First</h3>
              <p class="text-gray-600 text-sm">
                Responsive design that works on all devices and screen sizes
              </p>
            </div>

            <div class="w-full md:w-1/3 flex flex-col items-center text-center">
              <div
                class="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-3"
              >
                <i class="fas fa-language"></i>
              </div>
              <h3 class="text-lg font-semibold mb-1">Multilingual</h3>
              <p class="text-gray-600 text-sm">
                Supports both English and Somali languages
              </p>
            </div>
          </div>
        </div>

        <!-- Offline Capability -->
        <div
          class="bg-primary-light/30 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6"
        >
          <div
            class="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0"
          >
            <i class="fas fa-wifi-slash text-xl"></i>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-2 text-primary-dark">
              {{ t("about.offline") }}
            </h3>
            <p class="text-gray-700">
              Raadraac works without an internet connection once downloaded.
              Perfect for field research or areas with limited connectivity.
            </p>
          </div>

          <div class="mt-4 md:mt-0 ml-0 md:ml-auto">
            <a href="#" class="btn btn-primary">
              <i class="fas fa-download mr-2"></i> Download App
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.07);
}
</style>
