<template>
  <div class="analysis-container">
    <LoadingOverlay :show="isLoading" :message="currentLoadingMessage || 'Loading...'" />
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
import { ref, watch } from 'vue'
import { submitAnalysisRequest, submitFollowUpQuestion } from '@/api'
import InitialRequestForm from './InitialRequestForm.vue'
import ResultView from './ResultView.vue'
import ErrorMessage from './ErrorMessage.vue'
import LoadingOverlay from './LoadingOverlay.vue'

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

const originalUrlForContext = ref('')
const initialAnalysisForContext = ref('')

// --- Loading Information ---
const loadingMessages = [
  'Fetching the document...',
  'Analyzing the text...',
  'Consulting the AI...',
  'Finalizing the report...',
]
const currentLoadingMessage = ref(loadingMessages[0])
let messageInterval: number | undefined

// Use a 'watch' effect to start/stop the message cycling
watch(isLoading, (newVal) => {
  if (newVal) {
    // When loading starts, begin cycling through messages
    let messageIndex = 0
    currentLoadingMessage.value = loadingMessages[messageIndex]
    messageInterval = window.setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length
      currentLoadingMessage.value = loadingMessages[messageIndex]
    }, 2500) // Change message every 2.5 seconds
  } else {
    // When loading stops, clear the interval
    if (messageInterval) {
      clearInterval(messageInterval)
    }
  }
})

// --- API LOGIC ---
async function handleSubmit(payload: any) {
  errorMessage.value = ''
  isLoading.value = true
  conversationHistory.value = []

  try {
    const result = await submitAnalysisRequest(payload)

    originalUrlForContext.value = payload.chapter_url
    initialAnalysisForContext.value = result.analysis

    conversationHistory.value.push({ answer: result.analysis })
    viewState.value = 'RESULT'
  } catch (error: any) {
    console.error('Analysis submission failed:', error)
    // Here we would set an error state to show in the UI
    if (error.response && error.response.data && error.response.data.detail) {
      errorMessage.value = error.response.data.detail
    } else {
      errorMessage.value = 'An unexpected error occurred during the analysis. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

async function handleFollowUpSubmit(question: string) {
  errorMessage.value = ''
  isFollowUpLoading.value = true
  conversationHistory.value.push({ question, answer: 'Typing...' })

  try {
    const payload = {
      question: question,
      initial_analysis_text: initialAnalysisForContext.value,
      original_url: originalUrlForContext.value,
    }

    const result = await submitFollowUpQuestion(payload)
    // 1. Get a reference to the last item in the array.
    const lastMessage = conversationHistory.value[conversationHistory.value.length - 1]

    // 2. Use a guard clause to ensure it exists before modifying it.
    if (lastMessage) {
      lastMessage.answer = result.answer
    }
  } catch (error: any) {
    console.error('Follow-up submission failed:', error)
    if (error.response && error.response.data && error.response.data.detail) {
      errorMessage.value = error.response.data.detail
    } else {
      errorMessage.value = 'The follow-up question failed. Please try again.'
    }
    conversationHistory.value.pop()
  } finally {
    isFollowUpLoading.value = false
  }
}

function startNewAnalysis() {
  viewState.value = 'FORM'
  conversationHistory.value = []
  errorMessage.value = ''
  originalUrlForContext.value = ''
  initialAnalysisForContext.value = ''
}
</script>

<style scoped>
/* You can keep container-level styles here */
.analysis-container {
  /* Add any overall container styles if needed */
}
</style>
