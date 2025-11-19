<template>
  <!-- Use a <Transition> for a smooth fade-in/fade-out effect -->
  <Transition name="fade">
    <div v-if="show" class="overlay-backdrop">
      <div class="overlay-content">
        <div class="spinner"></div>
        <h2 class="message">{{ message }}</h2>
        <p v-if="subMessage" class="sub-message">{{ subMessage }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  message: string
  subMessage?: string
}>()
</script>

<style scoped>
.overlay-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  color: white;
}

.overlay-content {
  text-align: center;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.message {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.sub-message {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
}

/* Transition styles for the fade effect */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
