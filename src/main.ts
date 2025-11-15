import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// MSW Integration - START
async function enableMocking() {
  // Check if we are in a development environment
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    // `worker.start()` returns a Promise that resolves
    // once the Service Worker is up and running.
    return worker.start()
  }
}
// MSW Integration - END

const app = createApp(App)

app.use(createPinia())

// Ensure mocking is enabled before the app mounts
enableMocking().then(() => {
  app.mount('#app')
})
