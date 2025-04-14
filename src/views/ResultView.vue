<script setup lang="ts">
import { onMounted, computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useObjectStore } from "../stores/objectStore";

const { t } = useI18n();
const currentLang = ref("en");
const router = useRouter();
const objectStore = useObjectStore();

// Redirect to home if no image was uploaded
onMounted(() => {
  if (!objectStore.currentImage) {
    router.push("/");
  }

  // Get language from localStorage
  const savedLocale = localStorage.getItem("locale");
  if (savedLocale && (savedLocale === "en" || savedLocale === "so")) {
    currentLang.value = savedLocale;
  }
});

// Get object name based on current language
const objectName = computed(() => {
  if (!objectStore.recognizedObject) return "";
  return currentLang.value === "en"
    ? objectStore.recognizedObject.nameEn
    : objectStore.recognizedObject.nameSo;
});

// Handle try again button
const tryAgain = () => {
  objectStore.clearRecognition();
  router.push("/");
};
</script>

<template>
  <div class="animate-fade-in">
    <!-- Success Result -->
    <div
      v-if="objectStore.recognizedObject"
      class="bg-white min-h-[calc(100vh-14rem)]"
    >
      <!-- Hero section with image -->
      <div class="relative">
        <!-- Image Header -->
        <div
          class="aspect-video md:aspect-auto md:h-[50vh] bg-gray-900 relative overflow-hidden flex items-center justify-center"
        >
          <img
            v-if="objectStore.currentImage"
            :src="objectStore.currentImage"
            alt="Recognized object"
            class="w-full h-full object-contain"
          />

          <!-- Gradient overlay -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
          ></div>

          <!-- Back button -->
          <button
            @click="tryAgain"
            class="absolute top-4 left-4 btn btn-icon btn-ghost text-white hover:bg-white/20 z-10"
            aria-label="Go back"
          >
            <i class="fas fa-arrow-left"></i>
          </button>
        </div>

        <!-- Title card (overlapping) -->
        <div class="container-responsive relative -mt-24">
          <div
            class="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100"
          >
            <div
              class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <h1 class="text-3xl font-bold text-primary-dark mb-1">
                  {{ objectName }}
                </h1>
                <p class="text-gray-500">
                  {{
                    currentLang === "en"
                      ? objectStore.recognizedObject.nameSo
                      : objectStore.recognizedObject.nameEn
                  }}
                  <span class="text-sm">
                    ({{
                      currentLang === "en" ? "Somali name" : "English name"
                    }})
                  </span>
                </p>
              </div>

              <div class="flex items-center">
                <div
                  class="flex items-center justify-center h-10 w-10 rounded-full bg-success/10 text-success"
                >
                  <i class="fas fa-check"></i>
                </div>
                <span class="ml-2 text-success font-medium">Recognized</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Object details -->
      <div class="container-responsive py-8">
        <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div class="space-y-6">
            <!-- Material -->
            <div class="card p-6">
              <h2
                class="text-lg font-semibold flex items-center mb-3 text-primary-dark"
              >
                <i class="fas fa-cube mr-3 text-accent"></i>
                {{ t("result.material") }}
              </h2>
              <p class="text-gray-700">
                {{ objectStore.recognizedObject.material }}
              </p>
            </div>

            <!-- Traditional Use -->
            <div class="card p-6">
              <h2
                class="text-lg font-semibold flex items-center mb-3 text-primary-dark"
              >
                <i class="fas fa-hand-holding mr-3 text-accent"></i>
                {{ t("result.use") }}
              </h2>
              <p class="text-gray-700">
                {{ objectStore.recognizedObject.traditionalUse }}
              </p>
            </div>
          </div>

          <div class="space-y-6">
            <!-- Cultural Insight -->
            <div class="card p-6">
              <h2
                class="text-lg font-semibold flex items-center mb-3 text-primary-dark"
              >
                <i class="fas fa-book-open mr-3 text-accent"></i>
                {{ t("result.insight") }}
              </h2>
              <p class="text-gray-700">
                {{ objectStore.recognizedObject.culturalInsight }}
              </p>
            </div>

            <!-- Region removed - we will add it later -->

            <!-- Proverb removed - we will add it later -->
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-center mt-10">
          <button @click="tryAgain" class="btn btn-accent">
            <i class="fas fa-camera mr-2"></i> {{ t("result.try_again") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Not Recognized Result -->
    <div
      v-else-if="objectStore.error"
      class="min-h-[calc(100vh-14rem)] flex items-center bg-white"
    >
      <div class="container-responsive py-8">
        <div
          class="max-w-lg mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <!-- Image preview -->
          <div
            v-if="objectStore.currentImage"
            class="aspect-video bg-gray-100 flex items-center justify-center"
          >
            <img
              :src="objectStore.currentImage"
              alt="Unrecognized image"
              class="w-full h-full object-contain"
            />
          </div>

          <div class="p-6 text-center">
            <div
              class="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto mb-4"
            >
              <i class="fas fa-times text-2xl"></i>
            </div>

            <h2 class="text-2xl font-semibold text-gray-800 mb-3">
              Object Not Recognized
            </h2>

            <p class="text-gray-600 mb-8 max-w-md mx-auto">
              {{ objectStore.error }}
            </p>

            <div class="flex justify-center">
              <button @click="tryAgain" class="btn btn-accent">
                <i class="fas fa-redo mr-2"></i> {{ t("result.try_again") }}
              </button>
            </div>
          </div>
        </div>

        <!-- Debug Info -->
        <div
          v-if="objectStore.debugInfo"
          class="mt-8 max-w-lg mx-auto p-4 bg-gray-50 rounded-lg text-xs text-gray-500 font-mono overflow-x-auto"
        >
          <h3 class="text-sm font-semibold mb-2">Debug Info:</h3>
          <pre>{{ objectStore.debugInfo }}</pre>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-else-if="objectStore.isLoading"
      class="min-h-[calc(100vh-14rem)] flex items-center justify-center bg-white"
    >
      <div class="text-center p-8">
        <div class="spinner mx-auto mb-4"></div>
        <h2 class="text-2xl font-semibold text-gray-800 mb-2">
          Analyzing Image
        </h2>
        <p class="text-gray-600">Please wait while we process your image...</p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else
      class="min-h-[calc(100vh-14rem)] flex items-center justify-center bg-white"
    >
      <div class="text-center p-8 max-w-lg">
        <div
          class="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto mb-4"
        >
          <i class="fas fa-exclamation-triangle text-2xl"></i>
        </div>

        <h2 class="text-2xl font-semibold text-gray-800 mb-3">
          Something Went Wrong
        </h2>

        <p class="text-gray-600 mb-6">
          We couldn't process your image. Please try again.
        </p>

        <button @click="tryAgain" class="btn btn-accent">
          <i class="fas fa-home mr-2"></i> {{ t("result.try_again") }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom animations for components */
.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
}
</style>
