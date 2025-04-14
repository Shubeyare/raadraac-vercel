<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useObjectStore } from "../stores/objectStore";
import { useImageCapture } from "../composables/useImageCapture";

const { t } = useI18n();
const router = useRouter();
const objectStore = useObjectStore();

// Use the imageSrc from the useImageCapture composable
const {
  isCapturing,
  error,
  videoRef,
  canvasRef,
  hasImage,
  imageSrc,
  handleFileUpload,
  handleDrop,
  startCamera,
  captureImage,
  stopCamera,
  reset,
} = useImageCapture();

const fileInputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const isAnalyzing = ref(false);

// Event handlers for drag and drop
const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

// Handle the analyze button click
const analyzeImage = async () => {
  if (!imageSrc.value) return;

  isAnalyzing.value = true;

  try {
    // First set a slight delay to ensure the UI updates
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Perform the recognition
    await objectStore.recognizeObject(0.65); // Lower threshold for demo purposes

    // Navigate to result page
    router.push("/result");
  } catch (err) {
    console.error("Error analyzing image:", err);
  } finally {
    isAnalyzing.value = false;
  }
};

// Trigger file input click
const triggerFileInput = () => {
  fileInputRef.value?.click();
};

// Clean up on component unmount
onUnmounted(() => {
  if (isCapturing.value) {
    stopCamera();
  }
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center text-primary-dark mb-8">
      {{ t("home.title") }}
    </h1>

    <!-- Image Container -->
    <div
      class="max-w-2xl mx-auto mb-8 bg-white rounded-lg shadow-lg overflow-hidden"
      :class="{ 'h-96': !hasImage && !isCapturing }"
    >
      <!-- Image Preview -->
      <div v-if="hasImage" class="relative">
        <img
          :src="imageSrc || ''"
          alt="Uploaded image"
          class="w-full object-contain max-h-[70vh]"
        />

        <div class="absolute bottom-4 right-4 flex space-x-2">
          <button
            @click="analyzeImage"
            class="btn btn-accent"
            :disabled="isAnalyzing || objectStore.isLoading"
          >
            <span v-if="isAnalyzing || objectStore.isLoading">
              <i class="fas fa-spinner fa-spin mr-2"></i>
              {{ t("home.analyzing") }}
            </span>
            <span v-else>
              <i class="fas fa-search mr-2"></i> {{ t("result.object") }}
            </span>
          </button>

          <button
            @click="reset"
            class="btn bg-gray-500 text-white hover:bg-gray-600"
            :disabled="isAnalyzing || objectStore.isLoading"
          >
            <i class="fas fa-redo mr-2"></i> Reset
          </button>
        </div>

        <!-- Recognition in progress overlay -->
        <div
          v-if="isAnalyzing || objectStore.isLoading"
          class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div class="text-white text-center">
            <div class="text-4xl mb-4">
              <i class="fas fa-brain fa-spin"></i>
            </div>
            <p class="text-xl">{{ t("home.analyzing") }}</p>
            <p class="text-sm mt-2">Looking for 'Dhiil' in your image...</p>
          </div>
        </div>
      </div>

      <!-- Camera View -->
      <div v-else-if="isCapturing" class="relative">
        <video
          ref="videoRef"
          autoplay
          playsinline
          class="w-full h-[70vh] object-contain bg-black"
        ></video>

        <div class="absolute bottom-4 right-4 flex space-x-2">
          <button @click="captureImage" class="btn btn-accent">
            <i class="fas fa-camera mr-2"></i> Capture
          </button>

          <button
            @click="stopCamera"
            class="btn bg-gray-500 text-white hover:bg-gray-600"
          >
            <i class="fas fa-times mr-2"></i> Cancel
          </button>
        </div>
      </div>

      <!-- Upload Area -->
      <div
        v-else
        class="flex flex-col items-center justify-center h-full p-8 space-y-6"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
        :class="{
          'border-2 border-dashed border-accent bg-accent bg-opacity-5':
            isDragging,
        }"
      >
        <div class="text-center">
          <div class="text-5xl text-primary mb-4">
            <i class="fas fa-cloud-upload-alt"></i>
          </div>

          <p class="text-lg text-gray-600 mb-2">{{ t("home.drop") }}</p>
          <p class="text-gray-500">{{ t("home.or") }}</p>
        </div>

        <div
          class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3"
        >
          <button @click="triggerFileInput" class="btn btn-primary">
            <i class="fas fa-upload mr-2"></i> {{ t("home.upload") }}
          </button>

          <button @click="startCamera" class="btn btn-accent">
            <i class="fas fa-camera mr-2"></i> {{ t("home.camera") }}
          </button>
        </div>

        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileUpload"
        />

        <!-- Help text indicating what the app can recognize -->
        <div class="text-center mt-8 text-gray-500 text-sm">
          <p>
            Currently trained to recognize:
            <span class="font-semibold">Dhiil (Milk Container)</span>
          </p>
          <p class="mt-1">
            Take a photo or upload an image of a traditional Somali milk
            container
          </p>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="error || objectStore.error"
      class="max-w-2xl mx-auto text-center"
    >
      <p class="text-red-500">
        {{ error || objectStore.error }}
      </p>
    </div>

    <!-- Hidden Canvas for Image Processing -->
    <canvas ref="canvasRef" class="hidden"></canvas>
  </div>
</template>
