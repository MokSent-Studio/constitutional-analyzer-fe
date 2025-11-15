<template>
  <div class="result-view">
    <header class="result-header">
      <h2>Analysis Session</h2>
      <button @click="$emit('start-new')" class="new-analysis-button">
        &larr; Start New Analysis
      </button>
    </header>

    <div class="conversation-history">
      <div v-for="(item, index) in conversationHistory" :key="index" class="conversation-block">
        <div v-if="item.question" class="user-question">
          <strong>You asked:</strong> {{ item.question }}
        </div>
        <div class="ai-answer">
          <SkeletonLoader v-if="index === conversationHistory.length - 1 && isFollowUpLoading" />
          <pre>{{ item.answer }}</pre>
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
import { ref } from 'vue'
import SkeletonLoader from './SkeletonLoader.vue'

// Define the shape of a conversation item for the prop
interface ConversationItem {
  question?: string
  answer: string
}

// PROPS: Data passed down from the parent
defineProps<{
  conversationHistory: ConversationItem[]
  isFollowUpLoading: boolean
}>()

// EMITS: Events sent up to the parent
const emit = defineEmits(['submit-follow-up', 'start-new'])

const newFollowUpQuestion = ref('')

function submitFollowUp() {
  const question = newFollowUpQuestion.value.trim()
  if (!question) return
  // Emit the question to the parent to handle the API call
  emit('submit-follow-up', question)
  newFollowUpQuestion.value = '' // Clear the input
}
</script>

<style scoped>
.result-view {
  margin-bottom: 2rem;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1.5rem;
}

.new-analysis-button {
  background-color: var(--color-surface);
}
.new-analysis-button:hover {
  background-color: var(--color-background);
}

.conversation-history {
  margin-bottom: 2rem;
}

/* --- FIX #1: ADD SPACING BETWEEN CONVERSATION BLOCKS --- */
.conversation-block {
  margin-bottom: 2rem; /* This creates the needed space */
}

.user-question {
  background-color: #e1eefc;
  color: #004085;
  padding: 1rem 1.25rem;
  border-radius: 12px 12px 0 12px;
  margin-bottom: 0.75rem;
  display: inline-block;
  max-width: 80%;
  /* --- FIX #2B: ADD WRAPPING TO USER QUESTION FOR CONSISTENCY --- */
  white-space: pre-wrap;
  word-wrap: break-word;
}

.ai-answer pre {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
  border-radius: 0 12px 12px 12px;
  font-family: 'Courier New', Courier, monospace;
  /* --- FIX #2A: ADD TEXT WRAPPING TO THE AI'S ANSWER --- */
  white-space: pre-wrap; /* This tells the text to wrap */
  word-wrap: break-word; /* A fallback for better browser compatibility */
}

.follow-up-form {
  display: flex;
  gap: 0.5rem;
  margin-top: 2rem;
}
.follow-up-form input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.follow-up-form button {
  background-color: var(--color-primary);
  color: white;
  border: none;
}
.follow-up-form button:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}
</style>
