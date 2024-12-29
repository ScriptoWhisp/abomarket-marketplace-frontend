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
  <transition name="slide-up">
    <div
        v-if="visible"
        class="fixed bottom-5 left-0 right-0 flex justify-self-center bg-red-50 text-red-800 px-4 py-3 rounded-lg shadow-lg z-50 transition-transform duration-500 ease-out"
        role="alert"
    >
      <span class="font-medium">Error: {{ props.message }}</span>
    </div>
  </transition>
</template>

<style scoped>
.slide-up-enter-active {
  @apply animate-slide-up;
}
.slide-up-leave-active {
  @apply animate-slide-down;
}
</style>

