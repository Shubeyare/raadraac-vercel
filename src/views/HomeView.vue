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
  processingImage,
} = useImageCapture();

const fileInputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const isAnalyzing = ref(false);
const imageWidth = ref(0);
const imageHeight = ref(0);

// Handle image load event to get dimensions
const handleImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement;
  imageWidth.value = img.naturalWidth;
  imageHeight.value = img.naturalHeight;
  console.log(`Image loaded: ${imageWidth.value}x${imageHeight.value}`);
};

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

    // Ensure image is fully loaded before proceeding
    if (imageWidth.value === 0 || imageHeight.value === 0) {
      console.log(
        "Image dimensions not available yet, waiting for image to load..."
      );
      await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          imageWidth.value = img.naturalWidth;
          imageHeight.value = img.naturalHeight;
          console.log(
            `Image loaded with dimensions: ${imageWidth.value}x${imageHeight.value}`
          );
          resolve(true);
        };
        img.src = imageSrc.value || "";
      });
    }

    // Set the current image in the store
    objectStore.setCurrentImage(imageSrc.value);
    console.log(
      "Image set in store, dimensions:",
      imageWidth.value,
      "x",
      imageHeight.value
    );

    // Perform the recognition with a lower threshold for easier recognition
    await objectStore.recognizeObject(0.3);

    // Navigate to result page
    router.push("/result");
  } catch (err) {
    console.error("Error analyzing image:", err);
    if (err instanceof Error) {
      console.error("Error details:", err.message);
      alert(`Error analyzing image: ${err.message}`);
    } else {
      alert("An unknown error occurred while analyzing the image");
    }
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
  <div class="animate-fade-in">
    <!-- Hero Section -->
    <section
      class="bg-gradient-to-b from-primary-light/30 to-background pt-8 pb-12"
    >
      <div class="container-responsive text-center">
        <h1 class="text-3xl md:text-5xl font-bold mb-4 text-primary-dark">
          {{ t("home.title") }}
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Snap or upload Somali cultural items to discover their story.
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <div class="container-responsive py-8">
      <div class="max-w-3xl mx-auto">
        <!-- Image Interaction Area -->
        <div class="card overflow-hidden mb-8 shadow-md">
          <!-- Image Preview -->
          <div
            v-if="hasImage"
            class="relative aspect-video md:aspect-auto md:max-h-[500px] bg-gray-100 flex items-center justify-center overflow-hidden"
          >
            <img
              :src="imageSrc || ''"
              alt="Preview"
              class="image-preview object-contain w-full h-full max-h-[500px]"
              @load="handleImageLoad"
            />

            <!-- Actions Overlay -->
            <div
              class="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/60 to-transparent flex justify-center md:justify-end space-x-3"
            >
              <button
                @click="analyzeImage"
                class="btn btn-accent"
                :disabled="
                  isAnalyzing || objectStore.isLoading || processingImage
                "
              >
                <span
                  v-if="isAnalyzing || objectStore.isLoading"
                  class="flex items-center"
                >
                  <svg
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {{ t("home.analyzing") }}
                </span>
                <span v-else class="flex items-center">
                  <i class="fas fa-search mr-2"></i> {{ t("result.object") }}
                </span>
              </button>

              <button
                @click="reset"
                class="btn btn-outline text-white border-white hover:bg-white/20 hover:border-white"
                :disabled="
                  isAnalyzing || objectStore.isLoading || processingImage
                "
              >
                <i class="fas fa-redo mr-2"></i> Reset
              </button>
            </div>

            <!-- Processing Overlay -->
            <div
              v-if="isAnalyzing || objectStore.isLoading || processingImage"
              class="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center"
            >
              <div
                class="text-white text-center px-4 py-6 rounded-xl bg-black/30 backdrop-blur-md max-w-xs"
              >
                <div class="text-4xl mb-4">
                  <i
                    class="fas fa-brain animate-pulse"
                    v-if="isAnalyzing || objectStore.isLoading"
                  ></i>
                  <i
                    class="fas fa-image animate-pulse"
                    v-else-if="processingImage"
                  ></i>
                </div>
                <p class="text-xl font-semibold mb-2">
                  <template v-if="isAnalyzing || objectStore.isLoading">
                    {{ t("home.analyzing") }}
                  </template>
                  <template v-else-if="processingImage">
                    Optimizing Image...
                  </template>
                </p>
                <p class="text-sm" v-if="isAnalyzing || objectStore.isLoading">
                  Looking for 'Dhiil' in your image...
                </p>
                <p class="text-sm" v-else-if="processingImage">
                  Resizing and enhancing your image...
                </p>
              </div>
            </div>
          </div>

          <!-- Camera View -->
          <div
            v-else-if="isCapturing"
            class="relative aspect-video md:aspect-auto md:h-[500px] bg-black flex items-center justify-center"
          >
            <video
              ref="videoRef"
              autoplay
              playsinline
              class="absolute inset-0 w-full h-full object-contain"
            ></video>

            <canvas ref="canvasRef" class="hidden"></canvas>

            <!-- Camera Controls -->
            <div
              class="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/60 to-transparent flex justify-center space-x-3"
            >
              <button @click="captureImage" class="btn btn-accent">
                <i class="fas fa-camera mr-2"></i> Capture
              </button>

              <button
                @click="stopCamera"
                class="btn btn-outline text-white border-white hover:bg-white/20 hover:border-white"
              >
                <i class="fas fa-times mr-2"></i> Cancel
              </button>
            </div>
          </div>

          <!-- Upload Area -->
          <div
            v-else
            class="image-drop-area h-80 md:h-[500px]"
            :class="{ dragging: isDragging }"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            @drop="handleDrop"
          >
            <div class="text-center px-4">
              <div class="mb-5">
                <img
                  src="/placeholder-image.svg"
                  alt="Upload placeholder"
                  class="w-40 h-40 mx-auto opacity-60"
                  onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNkQyQjUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PHBhdGggZD0iTTc0IDg4QzcxLjc5MDkgODggNzAgODkuNzkwOSA3MCA5MlYxMzJDNzAgMTM0LjIwOSA3MS43OTA5IDEzNiA3NCAxMzZIMTI2QzEyOC4yMDkgMTM2IDEzMCAxMzQuMjA5IDEzMCAxMzJWOTJDMTMwIDg5Ljc5MDkgMTI4LjIwOSA4OCAxMjYgODhINzRaIiBzdHJva2U9IiNCODlCNzQiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTc2IDEzMkw5MCAxMThNMTAyIDEzMkwxMjQgMTEwIiBzdHJva2U9IiNCODlCNzQiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PGNpcmNsZSBjeD0iMTE0IiBjeT0iMTAwIiByPSI0IiBmaWxsPSIjQjg5Qjc0Ii8+PC9zdmc+Cg=='"
                />
              </div>

              <h3 class="text-xl font-semibold mb-2 text-gray-800">
                {{ t("home.drop") }}
              </h3>
              <p class="text-gray-600 mb-6">{{ t("home.or") }}</p>

              <div
                class="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3"
              >
                <button @click="triggerFileInput" class="btn btn-primary">
                  <i class="fas fa-upload mr-2"></i> {{ t("home.upload") }}
                </button>

                <button @click="startCamera" class="btn btn-accent">
                  <i class="fas fa-camera mr-2"></i> {{ t("home.camera") }}
                </button>
              </div>
            </div>

            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileUpload"
            />
          </div>
        </div>

        <!-- Additional Information -->
        <div class="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h2 class="text-xl font-semibold mb-4 flex items-center">
            <i class="fas fa-info-circle text-accent mr-2"></i>
            About Object Recognition
          </h2>

          <p class="text-gray-600 mb-4">
            Currently trained to recognize:
            <span class="font-semibold text-primary-dark"
              >Dhiil (Milk Container)</span
            >
          </p>

          <div class="flex items-start space-x-4 mb-6">
            <div
              class="w-10 h-10 rounded-full bg-primary-light/50 flex items-center justify-center text-primary-dark mt-1"
            >
              <i class="fas fa-camera"></i>
            </div>
            <p class="text-gray-600 flex-1">
              capture several angles for accurate results.
            </p>
          </div>

          <div class="flex items-start space-x-4">
            <div
              class="w-10 h-10 rounded-full bg-primary-light/50 flex items-center justify-center text-primary-dark mt-1"
            >
              <i class="fas fa-lightbulb"></i>
            </div>
            <p class="text-gray-600 flex-1">
              Use good lighting and a plain background for best accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add custom animation for placeholder */
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.floating-placeholder {
  animation: float 3s ease-in-out infinite;
}
</style>
