<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { SomaliObject } from "../stores/objectStore";

const props = defineProps<{
  object: SomaliObject;
}>();

const { t, locale } = useI18n();

// Object name based on current language
const objectName = computed(() => {
  return locale.value === "en" ? props.object.nameEn : props.object.nameSo;
});

// Secondary name based on current language
const secondaryName = computed(() => {
  return locale.value === "en" ? props.object.nameSo : props.object.nameEn;
});
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="p-6">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-primary-dark">
          {{ objectName }}
          <span class="text-lg font-normal text-gray-600 ml-2"
            >({{ secondaryName }})</span
          >
        </h2>
      </div>

      <div class="space-y-4">
        <!-- Material -->
        <div class="flex">
          <div class="w-1/3 font-medium text-gray-700">
            {{ t("result.material") }}:
          </div>
          <div class="w-2/3 text-gray-600">
            {{ object.material }}
          </div>
        </div>

        <!-- Traditional Use -->
        <div class="flex">
          <div class="w-1/3 font-medium text-gray-700">
            {{ t("result.use") }}:
          </div>
          <div class="w-2/3 text-gray-600">
            {{ object.traditionalUse }}
          </div>
        </div>

        <!-- Cultural Insight -->
        <div class="flex">
          <div class="w-1/3 font-medium text-gray-700">
            {{ t("result.insight") }}:
          </div>
          <div class="w-2/3 text-gray-600">
            {{ object.culturalInsight }}
          </div>
        </div>

        <!-- Region (if available) -->
        <div v-if="object.region" class="flex">
          <div class="w-1/3 font-medium text-gray-700">
            {{ t("result.region") }}:
          </div>
          <div class="w-2/3 text-gray-600">
            {{ object.region }}
          </div>
        </div>

        <!-- Proverb (if available) -->
        <div v-if="object.proverb" class="flex">
          <div class="w-1/3 font-medium text-gray-700">
            {{ t("result.proverb") }}:
          </div>
          <div class="w-2/3 text-gray-600 italic">
            {{ object.proverb }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
