<template>
  <div class="result-view">
    <header class="result-header">
      <h2>Analysis Session</h2>
      <button @click="$emit('start-new')" class="new-analysis-button">
        &larr; Start New Analysis
      </button>
    </header>

    <div class="conversation-history" ref="historyContainer">
      <!-- We now loop over the history and create a 'message-row' for each item -->
      <div v-for="(item, index) in conversationHistory" :key="index">
        <!-- User's Question Row -->
        <div v-if="item.question" class="message-row user">
          <div class="message-content user-question">
            {{ item.question }}
          </div>
          <Icon name="user" class="icon-user" />
        </div>

        <!-- AI's Answer Row -->
        <div class="message-row ai">
          <Icon name="ai" class="icon-ai" />
          <div class="message-content ai-answer">
            <SkeletonLoader v-if="index === conversationHistory.length - 1 && isFollowUpLoading" />
            <MarkdownRenderer v-else :content="item.answer" />
          </div>
        </div>
      </div>
    </div>

    <div class="follow-up-form">
      <input
        type="text"
        v-model="newFollowUpQuestion"
        placeholder="Ask a follow-up question..."
        @keyup.enter="submitFollowUp"
        :disabled="isFollowUpLoading"
      />
      <button @click="submitFollowUp" :disabled="!newFollowUpQuestion.trim() || isFollowUpLoading">
        {{ isFollowUpLoading ? '...' : 'Ask' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import SkeletonLoader from './SkeletonLoader.vue'
import MarkdownRenderer from './MarkdownRenderer.vue'
import Icon from './Icon.vue'

interface ConversationItem {
  question?: string
  answer: string
}

const props = defineProps<{
  conversationHistory: ConversationItem[]
  isFollowUpLoading: boolean
}>()

const emit = defineEmits(['submit-follow-up', 'start-new'])

const newFollowUpQuestion = ref('')

// --- NEW LOGIC FOR AUTO-SCROLLING ---
// 1. Create a template ref to get access to the history div
const historyContainer = ref<HTMLElement | null>(null)

// 2. Watch for changes in the conversationHistory prop
watch(
  () => props.conversationHistory,
  async () => {
    // Wait for Vue to update the DOM with the new message
    await nextTick()

    // Now that the new message is rendered, scroll to the bottom
    const el = historyContainer.value
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  },
  { deep: true },
) // 'deep' is important to watch for new items being pushed to the array

function submitFollowUp() {
  const question = newFollowUpQuestion.value.trim()
  if (!question) return
  emit('submit-follow-up', question)
  newFollowUpQuestion.value = ''
}
</script>

<style scoped>
/* --- THIS IS THE KEY LAYOUT CHANGE --- */
.result-view {
  display: flex;
  flex-direction: column;
  height: calc(90vh - 100px);
  max-height: 800px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background-color: var(--color-surface);
  box-shadow: var(--box-shadow);
  overflow: hidden;
}

.result-header {
  flex-shrink: 0;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
}
.conversation-history {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1.5rem;
}
.follow-up-form {
  flex-shrink: 0;
  padding: 1rem;
  border-top: 1px solid var(--color-border);
  background-color: var(--color-background);
}

/* NEW: Styles for the message rows */
.message-row {
  display: flex;
  align-items: flex-start; /* Align icon with the top of the message bubble */
  gap: 0.75rem;
  margin-bottom: 2rem;
  max-width: 90%; /* Prevent messages from taking the full width */
}

.message-row.ai {
  /* Default is left-aligned, so no extra styles needed */
}

.message-row.user {
  /* Push to the right */
  justify-content: flex-end;
  margin-left: auto; /* This pushes the whole row to the right */
}

.message-content {
  padding: 1rem 1.25rem;
  border-radius: 12px;
}

/* Specific styling for bubbles and icons */
.user-question {
  background-color: var(--color-primary);
  color: white;
  border-radius: 12px 12px 0 12px;
}
.ai-answer {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0 12px 12px 12px;
}

.icon-ai {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}
.icon-user {
  background-color: var(--color-primary);
  color: white;
  /* Re-order the elements for right-alignment */
  order: 2;
}

/* Other styles */
.follow-up-form {
  display: flex;
  gap: 0.5rem;
}
.follow-up-form input {
  flex-grow: 1;
}
.new-analysis-button {
  background-color: var(--color-surface);
}
</style>
