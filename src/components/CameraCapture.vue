<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineEmits } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const emits = defineEmits(["image-captured", "cancel"]);

const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);
const stream = ref<MediaStream | null>(null);

// Start camera when component is mounted
onMounted(async () => {
  await startCamera();
});

// Stop camera when component is unmounted
onUnmounted(() => {
  stopCamera();
});

// Start the camera stream
const startCamera = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    });

    if (videoRef.value) {
      videoRef.value.srcObject = stream.value;
      await videoRef.value.play();
    }
  } catch (err) {
    error.value = t("home.error");
    console.error("Camera error:", err);
  } finally {
    isLoading.value = false;
  }
};

// Capture an image from the video stream
const captureImage = () => {
  if (!videoRef.value || !canvasRef.value) return;

  const video = videoRef.value;
  const canvas = canvasRef.value;
  const context = canvas.getContext("2d");

  if (!context) return;

  // Set canvas dimensions to match video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw the current video frame to the canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert canvas to data URL
  const imageData = canvas.toDataURL("image/jpeg");

  // Stop the camera
  stopCamera();

  // Emit the captured image
  emits("image-captured", imageData);
};

// Stop the camera stream
const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach((track) => track.stop());
    stream.value = null;
  }

  if (videoRef.value) {
    videoRef.value.srcObject = null;
  }

  emits("cancel");
};
</script>

<template>
  <div class="relative bg-black rounded-lg overflow-hidden">
    <!-- Loading indicator -->
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white"
    >
      <div class="text-center">
        <div class="text-2xl mb-2">
          <i class="fas fa-circle-notch fa-spin"></i>
        </div>
        <p>{{ t("home.analyzing") }}</p>
      </div>
    </div>

    <!-- Error message -->
    <div
      v-if="error"
      class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white"
    >
      <div class="text-center p-4">
        <div class="text-3xl mb-2 text-red-500">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <p>{{ error }}</p>
        <button @click="startCamera" class="btn btn-accent mt-4">
          {{ t("home.try_again") }}
        </button>
      </div>
    </div>

    <!-- Video feed -->
    <video
      ref="videoRef"
      autoplay
      playsinline
      class="w-full h-[70vh] object-contain"
    ></video>

    <!-- Control buttons -->
    <div class="absolute bottom-4 right-4 flex space-x-2">
      <button
        @click="captureImage"
        class="btn btn-accent"
        :disabled="isLoading || !!error"
      >
        <i class="fas fa-camera mr-2"></i> Capture
      </button>

      <button
        @click="stopCamera"
        class="btn bg-gray-500 text-white hover:bg-gray-600"
      >
        <i class="fas fa-times mr-2"></i> Cancel
      </button>
    </div>

    <!-- Hidden canvas for image processing -->
    <canvas ref="canvasRef" class="hidden"></canvas>
  </div>
</template>
