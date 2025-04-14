<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-center text-primary-dark mb-8">
        {{ t("about.title") }}
      </h1>

      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <p class="text-gray-700 mb-6 leading-relaxed">
          {{ t("about.description") }}
        </p>

        <h2 class="text-2xl font-semibold text-primary-dark mb-4">
          {{ t("about.how") }}
        </h2>

        <div class="space-y-6">
          <div class="flex items-start">
            <div
              class="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1"
            >
              1
            </div>
            <div class="ml-4">
              <p class="text-gray-700">{{ t("about.step1") }}</p>
            </div>
          </div>

          <div class="flex items-start">
            <div
              class="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1"
            >
              2
            </div>
            <div class="ml-4">
              <p class="text-gray-700">{{ t("about.step2") }}</p>
            </div>
          </div>

          <div class="flex items-start">
            <div
              class="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1"
            >
              3
            </div>
            <div class="ml-4">
              <p class="text-gray-700">{{ t("about.step3") }}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-primary-light bg-opacity-30 rounded-lg p-6 flex items-center justify-center space-x-4"
      >
        <div class="text-3xl text-primary-dark">
          <i class="fas fa-wifi-slash"></i>
        </div>
        <p class="text-primary-dark font-medium">
          {{ t("about.offline") }}
        </p>
      </div>
    </div>
  </div>
</template>
