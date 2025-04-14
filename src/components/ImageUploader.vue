<script setup lang="ts">
import { ref, defineEmits } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const emits = defineEmits(["file-selected"]);

const fileInputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const error = ref<string | null>(null);

// Event handlers for drag and drop
const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = false;

  if (!e.dataTransfer) return;

  if (e.dataTransfer.files.length > 0) {
    handleFile(e.dataTransfer.files[0]);
  }
};

const handleFileInputChange = (e: Event) => {
  const input = e.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) return;

  handleFile(input.files[0]);
};

const handleFile = (file: File) => {
  error.value = null;

  // Check if file is an image
  if (!file.type.match("image.*")) {
    error.value = "Please select an image file";
    return;
  }

  emits("file-selected", file);
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center bg-white rounded-lg border-2 border-dashed p-8 h-64"
    :class="{
      'border-accent bg-accent bg-opacity-5': isDragging,
      'border-gray-300': !isDragging,
    }"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <div class="text-center">
      <div class="text-5xl text-primary mb-4">
        <i class="fas fa-cloud-upload-alt"></i>
      </div>

      <p class="text-lg text-gray-600 mb-2">{{ t("home.drop") }}</p>
      <p class="text-gray-500 mb-4">{{ t("home.or") }}</p>

      <button @click="triggerFileInput" class="btn btn-primary">
        <i class="fas fa-file-image mr-2"></i> {{ t("home.upload") }}
      </button>

      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileInputChange"
      />
    </div>

    <p v-if="error" class="mt-4 text-red-500">{{ error }}</p>
  </div>
</template>
