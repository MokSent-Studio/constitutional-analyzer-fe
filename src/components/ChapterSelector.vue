<template>
  <div>
    <!-- Section 1: Button Grid -->
    <div class="chapter-grid-container" :class="{ 'is-scrolled-to-bottom': isScrolledToBottom }">
      <div class="chapter-grid" ref="gridElement" @scroll="handleScroll">
        <button
          v-for="chapter in chapters"
          :key="chapter.id"
          :class="{ selected: selectedUrl === chapter.url }"
          @click="handleButtonClick(chapter)"
        >
          {{ chapter.name }}
        </button>
      </div>
    </div>

    <!-- Section 2: Collapsible Advanced Input -->
    <details class="advanced-section">
      <summary>Or, analyze a specific URL instead</summary>
      <input
        type="url"
        placeholder="Paste URL from an official source..."
        @input="handleTextInputChange"
      />
    </details>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { fetchChapters } from '@/api' // We'll create this API function

// Define the structure of a chapter object
interface Chapter {
  id: number
  name: string
  url: string
}

const isScrolledToBottom = ref(false)
const gridElement = ref<HTMLElement | null>(null)

function handleScroll() {
  const el = gridElement.value
  if (!el) return

  // The logic: if the element's height + its scroll position is >= its total scrollable height,
  // then we are at the bottom. We add a 1px buffer for precision issues.
  const atBottom = el.offsetHeight + el.scrollTop >= el.scrollHeight - 1
  isScrolledToBottom.value = atBottom
}

// 4. Check the initial state when the component mounts
// (in case the content isn't long enough to scroll)
onMounted(async () => {
  // Use a timeout to ensure the DOM is fully rendered before checking
  chapters.value = await fetchChapters()
  await nextTick()
  handleScroll()
})

// --- STATE ---
const chapters = ref<Chapter[]>([])
const selectedUrl = ref<string>('')

// --- EMITS ---
// This defines the custom event the component will send to its parent
const emit = defineEmits(['chapter-select'])

// --- LOGIC ---
// Function to handle clicking a button
function handleButtonClick(chapter: Chapter) {
  selectedUrl.value = chapter.url
  // Emit the selected URL to the parent component
  emit('chapter-select', chapter)
}

// Function to handle typing in the manual input
function handleTextInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  const url = target.value
  selectedUrl.value = url
  emit('chapter-select', { url: url, name: 'Custom URL' })
}

// --- LIFECYCLE HOOK ---
// This runs when the component is first created
onMounted(async () => {
  // Fetch the chapter list from our Python API
  chapters.value = await fetchChapters()
})
</script>

<style scoped>
/* --- THE KEY CHANGES ARE HERE --- */

/* 1. Style the new container */
.chapter-grid-container {
  position: relative; /* This is crucial for positioning the fade overlay */
}

/* 2. Style the scrollable grid itself */
.chapter-grid {
  max-height: 12rem;
  overflow-y: auto;
  padding-right: 0.5rem;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

/* 3. Create the fade-out effect using a pseudo-element */
.chapter-grid-container::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3rem; /* The height of the fade */

  /* The gradient transitions from fully transparent to our solid surface color */
  background: linear-gradient(to bottom, transparent, var(--color-surface));

  /* CRITICAL: This allows the user to click on buttons "through" the fade */
  pointer-events: none;
}

.chapter-grid-container.is-scrolled-to-bottom::after {
  opacity: 0;
}
/* --- END OF KEY CHANGES --- */

button {
  text-align: left;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
}
button:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
button.selected {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  font-weight: 600;
}

.advanced-section summary {
  cursor: pointer;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
}
</style>
