// src/mocks/handlers.ts - NEW, CORRECT CODE for MSW v2.x

import { http, HttpResponse, delay } from 'msw' // <-- Import 'http', 'HttpResponse', and 'delay'

// The base URL of your API, matching what's in your axios config
const API_BASE_URL = 'http://127.0.0.1:8000/api'

// Mock data for the chapters endpoint
const MOCK_CHAPTERS_DATA = [
  { id: 1, name: 'Chapter 1: Founding Provisions', url: 'https://example.com/chapter-1' },
  { id: 2, name: 'Chapter 2: Bill of Rights', url: 'https://example.com/chapter-2' },
  { id: 3, name: 'Chapter 3: Co-operative Gov.', url: 'https://example.com/cr-3' },
  { id: 1, name: 'Chapter 4: Money', url: 'https://example.coapter-1' },
  { id: 2, name: 'Chapter 5: Parliament', url: 'https://examom/chapter-2' },
  { id: 3, name: 'Chapter 6: Cabinet.', url: 'https://example.com/chapter-3' },
  { id: 1, name: 'Chapter 1: Founding Provisions', url: 'https://exampe.com/chapter-1' },
  { id: 2, name: 'Chapter 2: Bill of Rights', url: 'https://exampqle.com/chapter-2' },
  { id: 3, name: 'Chapter 3: Co-operative Gov.', url: 'https://exampleom/chapter-3' },
  { id: 1, name: 'Chapter 4: Money', url: 'https://example.co qqqm/chapter-1' },
  { id: 2, name: 'Chapter 5: Parliament', url: 'https://example.cttom/chapter-2' },
  { id: 3, name: 'Chapter 6: Cabinet.', url: 'https://example.com/cwqhapter-3' },
  // ... add a few more for testing purposes
]

export const handlers = [
  // 1. Mock the `fetchChapters` endpoint using the new resolver signature
  http.get(`${API_BASE_URL}/chapters`, async () => {
    // <-- Note the 'async' and new signature

    // Simulate a network delay of 150ms
    await delay(150)

    // Directly return an HttpResponse object
    return HttpResponse.json(MOCK_CHAPTERS_DATA, { status: 200 })
  }),

  // 2. Mock the `submitAnalysisRequest` endpoint using the new resolver signature
  http.post(`${API_BASE_URL}/analyze`, async ({ request }) => {
    // <-- Destructure 'request' from the context object

    // Get the request body, which is now on the request object
    const requestData = await request.json()

    // If the audience is 'fail', return a server error
    if ((requestData as any).target_audience === 'fail') {
      await delay(500)
      return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' })
    }

    console.log('MSW intercepted POST request with data:', requestData)

    // Simulate a successful analysis response after a delay
    await delay(500)

    return HttpResponse.json(
      {
        analysis: `This is a mock analysis for the request on ${(requestData as any).chapter_url}. The role was ${(requestData as any).analysis_role}.`,
        answered_questions: {
          'How does this work?':
            'This works by intercepting network requests with a service worker.',
        },
      },
      { status: 200 },
    )
  }),

  // 3. Mock the NEW follow-up endpoint
  http.post(`${API_BASE_URL}/follow-up`, async ({ request }) => {
    const { question } = (await request.json()) as { question: string }

    // If the question is 'fail', return an error
    if (question.toLowerCase() === 'fail') {
      await delay(500)
      return new HttpResponse(null, { status: 500 })
    }

    console.log('MSW intercepted Follow-up Question:', question)

    await delay(400) // Simulate AI thinking

    // Return a dynamic response based on the question
    return HttpResponse.json({
      answer: `This is a mock follow-up answer specifically for your question about: "${question}". The Constitution addresses this in section X.Y.`,
    })
  }),
]
