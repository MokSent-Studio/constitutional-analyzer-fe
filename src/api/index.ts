import axios from 'axios'

// Define the base URL for your Python backend
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Example for a local Django/Flask server
  headers: {
    'Content-Type': 'application/json',
  },
})

// Function to GET the list of chapters
export const fetchChapters = async () => {
  try {
    const response = await apiClient.get('/chapters')
    return response.data
  } catch (error) {
    console.error('Failed to fetch chapters:', error)
    return [] // Return an empty array on error
  }
}

// Function to POST the final analysis request JSON object
export const submitAnalysisRequest = async (requestData: any) => {
  try {
    const response = await apiClient.post('/analyze', requestData)
    return response.data // The AI's analysis
  } catch (error) {
    console.error('Failed to submit analysis request:', error)
    throw error
  }
}

// Function to POST follow up questions
export const submitFollowUpQuestion = async (payload: { question: string; context?: any }) => {
  try {
    const response = await apiClient.post('/follow-up', payload)
    return response.data
  } catch (error) {
    console.error('Failed to submit follow-up question:', error)
    throw error
  }
}
