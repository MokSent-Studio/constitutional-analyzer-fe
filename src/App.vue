<script setup lang="ts">
import AnalysisForm from './components/AnalysisForm.vue'
</script>

<template>
  <header>
    <h1>Constitution Analyzer</h1>
  </header>

  <main>
    <AnalysisForm />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  margin-bottom: 2rem;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  color: var(--color-text-primary);
}

main {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem 2rem 1rem;
}
</style>
