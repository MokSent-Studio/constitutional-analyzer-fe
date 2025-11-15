<template>
  <div class="skeleton-loader">
    <div class="skeleton-line"></div>
    <div class="skeleton-line"></div>
    <div class="skeleton-line short"></div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton-loader {
  padding: 1rem;
  background-color: #f0f0f0;
  border-radius: 8px;
}

.skeleton-line {
  height: 1.2em;
  width: 100%;
  margin-bottom: 0.75rem;
  border-radius: 4px;
  background: linear-gradient(to right, #e0e0e0 8%, #f0f0f0 18%, #e0e0e0 33%);
  background-size: 1000px 104px;
  animation: shimmer 2s infinite linear;
}
.skeleton-line:last-child {
  margin-bottom: 0;
}
.skeleton-line.short {
  width: 60%;
}
</style>
