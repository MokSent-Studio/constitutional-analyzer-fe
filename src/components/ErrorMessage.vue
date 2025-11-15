<template>
  <div class="error-box"><strong>Error:</strong> {{ message }}</div>
</template>

<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<style scoped>
.error-box {
  padding: 1rem;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
</style>
