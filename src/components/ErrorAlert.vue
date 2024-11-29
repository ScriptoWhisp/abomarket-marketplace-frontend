<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 5000, // Default duration: 5 seconds
  },
});

const visible = ref(false);

// Watch the message prop to trigger the visibility logic
watch(
    () => props.message,
    (newMessage) => {
      if (newMessage) {
        visible.value = true;
        setTimeout(() => {
          visible.value = false;
        }, props.duration);
      }
    },
    { immediate: true } // Trigger this watch on component mount
);

</script>

<template>
  <div v-if="visible" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
    <span class="font-medium">Error: {{props.message}}</span>
  </div>
</template>

<style scoped>

</style>