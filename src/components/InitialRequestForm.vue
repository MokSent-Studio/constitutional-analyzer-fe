<template>
  <div class="analysis-form">
    <details class="accordion-item" open>
      <summary class="accordion-header">
        <div class="header-content">
          <h2>1. Select a Chapter</h2>
          <!-- Display the selected chapter name if it exists -->
          <span v-if="selectedChapterName" class="selection-summary">{{
            selectedChapterName
          }}</span>
        </div>
      </summary>
      <div class="accordion-content">
        <ChapterSelector @chapter-select="updateSelectedChapter" />
      </div>
    </details>

    <details class="accordion-item">
      <summary class="accordion-header">
        <div class="header-content">
          <h2>2. Choose Scope of Explanation</h2>
          <!-- Display the mapped scope text if it exists -->
          <span v-if="selectedScopeText" class="selection-summary">{{ selectedScopeText }}</span>
        </div>
      </summary>
      <div class="accordion-content">
        <div class="radio-group">
          <label
            ><input type="radio" v-model="formState.explanationScope" value="A" /> Summary</label
          >
          <label
            ><input type="radio" v-model="formState.explanationScope" value="B" /> Key Points</label
          >
          <label
            ><input type="radio" v-model="formState.explanationScope" value="C" /> Comprehensive
            Outline</label
          >
        </div>
      </div>
    </details>

    <details class="accordion-item">
      <summary class="accordion-header">
        <h2>3. Refine Analysis (Optional)</h2>
      </summary>
      <div class="accordion-content">
        <div class="input-group">
          <div>
            <label for="role">Desired Analysis Role</label>
            <input
              id="role"
              type="text"
              v-model="formState.analysisRole"
              placeholder="Default: Constitutional Law Professor"
            />
          </div>
          <div>
            <label for="audience">Target Audience</label>
            <input
              id="audience"
              type="text"
              v-model="formState.targetAudience"
              placeholder="e.g., High School Students"
            />
          </div>
        </div>
      </div>
    </details>

    <details class="accordion-item">
      <summary class="accordion-header">
        <h2>4. Ask Specific Follow-up Questions (Optional)</h2>
      </summary>
      <div class="accordion-content">
        <div
          v-for="(question, index) in formState.followUpQuestions"
          :key="index"
          class="question-row"
        >
          <input
            type="text"
            v-model="formState.followUpQuestions[index]"
            placeholder="e.g., How are disputes resolved?"
          />
          <button @click="removeQuestion(index)" class="remove-btn" title="Remove question">
            &times;
          </button>
        </div>
        <button @click="addQuestion" class="add-btn">+ Add Question</button>
      </div>
    </details>

    <button @click="submit" :disabled="!isFormValid || isLoading" class="submit-btn">
      {{ isLoading ? 'Analyzing...' : 'Analyze Now' }}
    </button>
  </div>
</template>

<script setup lang="ts">
// The script section requires NO CHANGES.
// This is the power of separating structure from logic.
import { reactive, computed, ref } from 'vue'
import ChapterSelector from './ChapterSelector.vue'

defineProps<{ isLoading: boolean }>()
const emit = defineEmits(['submit-request'])
const formState = reactive({
  chapterUrl: '',
  explanationScope: '',
  analysisRole: '',
  targetAudience: '',
  followUpQuestions: [''],
})
const selectedChapterName = ref('')

const selectedScopeText = computed(() => {
  switch (formState.explanationScope) {
    case 'A':
      return 'Summary'
    case 'B':
      return 'Key Points'
    case 'C':
      return 'Comprehensive Outline'
    default:
      return '' // Return empty if nothing is selected
  }
})

function updateSelectedChapter(chapter: { url: string; name: string }) {
  formState.chapterUrl = chapter.url
  selectedChapterName.value = chapter.name
}

const isFormValid = computed(() => formState.chapterUrl !== '' && formState.explanationScope !== '')
function addQuestion() {
  formState.followUpQuestions.push('')
}
function removeQuestion(index: number) {
  if (formState.followUpQuestions.length > 1) {
    formState.followUpQuestions.splice(index, 1)
  } else {
    formState.followUpQuestions[0] = ''
  }
}
function submit() {
  if (!isFormValid.value) return
  const payload = {
    chapter_url: formState.chapterUrl,
    explanation_scope: formState.explanationScope,
    ...(formState.analysisRole && { analysis_role: formState.analysisRole }),
    ...(formState.targetAudience && { target_audience: formState.targetAudience }),
    follow_up_questions: formState.followUpQuestions.filter((q) => q.trim() !== ''),
  }
  emit('submit-request', payload)
}
</script>

<style scoped>
/* --- NEW STYLES FOR THE ACCORDION --- */
.accordion-item {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
  box-shadow: var(--box-shadow);
  transition: margin-bottom 0.3s ease;
}
.header-content {
  flex-grow: 1; /* Allows the content to take up available space */
}

.selection-summary {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-primary);
  margin-top: 0.25rem;
}

.accordion-item[open] {
  margin-bottom: 2rem;
}

.accordion-header {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1.5rem;
  cursor: pointer;
  list-style: none;
}

/* Custom animated chevron */
.accordion-header::after {
  content: '›';
  font-size: 2rem;
  font-weight: bold;
  margin-left: 1rem; /* Add space between content and chevron */
  transform: rotate(90deg);
  transition: transform 0.2s ease;
  color: var(--color-text-secondary);
}
.accordion-item[open] > .accordion-header::after {
  transform: rotate(-90deg);
}

.accordion-content {
  padding: 0 1.5rem 1.5rem 1.5rem;
}

h2 {
  font-size: 1.25rem;
  color: var(--color-text-primary);
}
/* --- END OF ACCORDION STYLES --- */

/* --- EXISTING STYLES (slightly modified) --- */
.radio-group label {
  display: block;
  background-color: var(--color-background);
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}
.radio-group label:hover {
  background-color: #e9ecef;
}

.input-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem 1rem;
  align-items: start;
}
.input-group label {
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: var(--color-text-secondary);
}
.input-group input {
  width: 100%;
}

.question-row {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}
.question-row input {
  flex-grow: 1;
  margin-right: 0.5rem;
}
.remove-btn {
  width: 44px;
  height: 44px;
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
  font-weight: bold;
}
.remove-btn:hover {
  background-color: #f1b0b7;
}
.add-btn {
  background: none;
  border: 1px dashed var(--color-border);
  color: var(--color-text-secondary);
  width: 100%;
  font-weight: bold;
}
.add-btn:hover {
  background-color: var(--color-background);
  color: var(--color-text-primary);
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  background-color: var(--color-primary);
  color: white;
  border: none;
}
.submit-btn:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
}
.submit-btn:disabled {
  background-color: #a0c7ff;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .input-group {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
