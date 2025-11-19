<script setup lang="ts">
import AnalysisForm from './components/AnalysisForm.vue'
import Logo from './components/Logo.vue'
</script>

<template>
  <header class="app-header">
    <Logo />
    <h1>Constitution Analyzer</h1>
  </header>

  <main>
    <AnalysisForm />
  </main>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  /*gap: 1rem; /* Adds space between the logo and the title */
  /*padding: 1rem 2rem; /* Add some padding around the header */
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-surface);
}

h1 {
  font-size: 1.5rem; /* A more appropriate size for a header title */
  font-weight: 600;
  color: var(--color-text-primary);
}

main {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem 1rem;
}
</style>
