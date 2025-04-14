<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useObjectStore } from "../stores/objectStore";

const { t } = useI18n({ useScope: "global" });
const router = useRouter();
const objectStore = useObjectStore();

// Redirect to home if no image was uploaded
onMounted(() => {
  if (!objectStore.currentImage) {
    router.push("/");
  }
});

// Get object name (hardcoded to English for now)
const objectName = computed(() => {
  if (!objectStore.recognizedObject) return "";
  return objectStore.recognizedObject.nameEn;
});

// Handle try again button
const tryAgain = () => {
  objectStore.clearRecognition();
  router.push("/");
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- When an object is recognized -->
    <div
      v-if="objectStore.recognizedObject"
      class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden mb-8"
    >
      <div
        v-if="objectStore.currentImage"
        class="w-full h-56 md:h-64 lg:h-80 bg-gray-200"
      >
        <img
          :src="objectStore.currentImage"
          alt="Recognized object"
          class="w-full h-full object-contain"
        />
      </div>

      <div class="p-6">
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
        >
          <div>
            <h1 class="text-3xl font-bold text-primary-dark">
              {{ objectName }}
            </h1>
            <p class="text-gray-600 text-lg">
              {{ objectStore.recognizedObject?.nameSo }}
              <span> (Somali name)</span>
            </p>
          </div>

          <button @click="tryAgain" class="btn btn-accent mt-4 md:mt-0">
            {{ t("result.try_again") }}
          </button>
        </div>

        <!-- Object information sections -->
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Left column -->
          <div class="space-y-6">
            <div class="result-field">
              <div class="result-field-label">{{ t("result.material") }}</div>
              <div class="result-field-value">
                {{ objectStore.recognizedObject.material }}
              </div>
            </div>
            <div class="result-field">
              <div class="result-field-label">
                {{ t("result.use") }}
              </div>
              <div class="result-field-value">
                {{ objectStore.recognizedObject.traditionalUse }}
              </div>
            </div>
          </div>

          <!-- Right column -->
          <div class="space-y-6">
            <div class="result-field">
              <div class="result-field-label">
                {{ t("result.insight") }}
              </div>
              <div class="result-field-value">
                {{ objectStore.recognizedObject.culturalInsight }}
              </div>
            </div>

            <div
              v-if="objectStore.recognizedObject.region"
              class="result-field"
            >
              <div class="result-field-label">{{ t("result.region") }}</div>
              <div class="result-field-value">
                {{ objectStore.recognizedObject.region }}
              </div>
            </div>

            <div
              v-if="objectStore.recognizedObject.proverb"
              class="result-field"
            >
              <div class="result-field-label">{{ t("result.proverb") }}</div>
              <div class="result-field-value">
                {{ objectStore.recognizedObject.proverb }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- When no object is recognized -->
    <div
      v-else-if="objectStore.error"
      class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 text-center"
    >
      <div class="flex flex-col items-center">
        <div
          v-if="objectStore.currentImage"
          class="w-full h-64 mb-6 bg-gray-200 rounded-lg overflow-hidden"
        >
          <img
            :src="objectStore.currentImage"
            alt="Unrecognized image"
            class="w-full h-full object-contain"
          />
        </div>

        <div class="text-5xl text-gray-400 mb-4">
          <i class="fas fa-question-circle"></i>
        </div>

        <h2 class="text-2xl font-semibold text-gray-700 mb-2">
          Object Not Recognized
        </h2>
        <p class="text-gray-600 mb-6">{{ objectStore.error }}</p>

        <button @click="tryAgain" class="btn btn-accent">
          {{ t("result.try_again") }}
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div
      v-else-if="objectStore.isLoading"
      class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 text-center"
    >
      <div class="text-5xl text-accent mb-4">
        <i class="fas fa-spinner fa-spin"></i>
      </div>
      <h2 class="text-2xl font-semibold text-gray-700 mb-2">Analyzing Image</h2>
      <p class="text-gray-600">Please wait while we process your image...</p>
    </div>

    <!-- Unexpected error state - fallback -->
    <div
      v-else
      class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 text-center"
    >
      <div class="text-5xl text-red-500 mb-4">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h2 class="text-2xl font-semibold text-gray-700 mb-2">
        Something Went Wrong
      </h2>
      <p class="text-gray-600 mb-6">
        We couldn't process your image. Please try again.
      </p>
      <button @click="tryAgain" class="btn btn-accent">
        {{ t("result.try_again") }}
      </button>
    </div>
  </div>
</template>
