***

```markdown
# Constitution Analyzer - Frontend

A modern, responsive Single Page Application (SPA) that serves as the user interface for the AI-powered Constitution Analyzer. It guides users through selecting legal texts, defining analysis parameters, and engaging in conversational follow-up Q&A.

## 🚀 Features

*   **Smart Form Interface:** An accordion-style multi-step form to gather context (Role, Audience, Scope) without overwhelming the user.
*   **Conversational UI:** A chat-like interface for follow-up questions, complete with auto-scrolling and distinct message bubbles.
*   **Rich Text Rendering:** Parses AI-generated Markdown into clean, readable HTML.
*   **Responsive Design:** Fully optimized for mobile and desktop experiences.
*   **Real-time Feedback:** Dynamic loading overlays and skeleton screens to manage user patience during AI processing.

## 🛠️ Tech Stack

*   **Framework:** [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Language:** TypeScript
*   **State Management:** Vue Reactivity API (ref/reactive)
*   **HTTP Client:** Axios
*   **Markdown:** `markdown-it`
*   **Styling:** Native CSS with CSS Variables (Design System)

## 📂 Project Structure

This project follows a **"Smart Container / Dumb Component"** architecture:

```

```

## ⚡️ Getting Started

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/constitution-analyzer-ui.git
    cd constitution-analyzer-ui
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Configuration

Create a `.env` file in the root directory for local development.

**For Local Development (with local Python backend):**
```env
VITE_API_BASE_URL="http://127.0.0.1:8000/api"
```

**For Production (Vercel):**
Create a `.env.production` file:
```env
VITE_API_BASE_URL="https://your-cloud-run-service-url.a.run.app/api"
```

### Running Locally

Start the development server:

```bash
npm run dev
```

Open your browser to `http://localhost:5173`.

## 🏗️ Building for Production

To create a production-ready build:

```bash
npm run build
```

This command will:
1.  Run a strict TypeScript type check (the build will fail if there are errors).
2.  Compile and bundle the application using Vite.
3.  Output static files to the `dist/` directory.

## 🚀 Deployment

This project is configured for automated deployment via **Vercel**.

1.  Push changes to the `main` branch on GitHub.
2.  Vercel detects the push, pulls the code, and runs `npm run build`.
3.  If the build succeeds, the new version is deployed live automatically.

*Note: Ensure the `VITE_API_BASE_URL` environment variable is correctly set in the Vercel project settings or the `.env.production` file.*

## 🧪 Error Handling

The application implements a robust error handling strategy:
*   **400 Bad Request:** Issues with the scraper or network (displayed to user).
*   **409 Conflict:** AI safety blocks (displayed to user).
*   **500 Server Error:** Unexpected failures (generic message displayed).

All errors are caught in the `AnalysisForm.vue` container and passed to the `ErrorMessage.vue` component.

## 🤝 Related Repositories
*   **Backend API:** [Link to your backend repo] - The FastAPI service that powers this frontend.
![The Backend](https://github.com/MokSent-Studio/constitutional-analyzer-be)
