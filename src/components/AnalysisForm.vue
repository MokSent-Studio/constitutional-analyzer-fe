<template>
  <div class="analysis-container">
    <ErrorMessage v-if="errorMessage" :message="errorMessage" />

    <InitialRequestForm
      v-if="viewState === 'FORM'"
      :is-loading="isLoading"
      @submit-request="handleSubmit"
    />

    <ResultView
      v-else
      :conversation-history="conversationHistory"
      :is-follow-up-loading="isFollowUpLoading"
      @submit-follow-up="handleFollowUpSubmit"
      @start-new="startNewAnalysis"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { submitAnalysisRequest, submitFollowUpQuestion } from '@/api'
import InitialRequestForm from './InitialRequestForm.vue'
import ResultView from './ResultView.vue'
import ErrorMessage from './ErrorMessage.vue'

// --- STATE MANAGEMENT ---
interface ConversationItem {
  question?: string
  answer: string
}

const viewState = ref<'FORM' | 'RESULT'>('FORM')
const isLoading = ref(false) // For the initial request
const conversationHistory = ref<ConversationItem[]>([])
const isFollowUpLoading = ref(false)
const errorMessage = ref('')

// --- API LOGIC ---
async function handleSubmit(payload: any) {
  errorMessage.value = ''
  isLoading.value = true
  conversationHistory.value = []

  try {
    const result = await submitAnalysisRequest(payload)
    conversationHistory.value.push({ answer: result.analysis })
    viewState.value = 'RESULT'
  } catch (error) {
    console.error('Analysis submission failed:', error)
    // Here we would set an error state to show in the UI
    errorMessage.value =
      'The initial analysis failed to complete. Please check your connection and try again.'
  } finally {
    isLoading.value = false
  }
}

async function handleFollowUpSubmit(question: string) {
  errorMessage.value = ''
  isFollowUpLoading.value = true
  conversationHistory.value.push({ question, answer: 'Typing...' })

  try {
    const result = await submitFollowUpQuestion({ question })
    conversationHistory.value[conversationHistory.value.length - 1].answer = result.answer
  } catch (error) {
    console.error('Follow-up submission failed:', error)
    errorMessage.value = 'The follow-up question failed. Please try asking again.'
    conversationHistory.value.pop()
  } finally {
    isFollowUpLoading.value = false
  }
}

function startNewAnalysis() {
  viewState.value = 'FORM'
  conversationHistory.value = []
  errorMessage.value = ''
}
</script>

<style scoped>
/* You can keep container-level styles here */
.analysis-container {
  /* Add any overall container styles if needed */
}
</style>
