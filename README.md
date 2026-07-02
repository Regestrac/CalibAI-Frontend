<div align="center">

# CalibAI — Frontend

### An AI chat console with multi-agent routing, live code artifacts, voice input, and credit-based billing.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.12-764ABC?style=flat-square&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Checkout-0C2451?style=flat-square&logo=razorpay&logoColor=white)](https://razorpay.com/)

[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](#license)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](#contributing)

</div>

---

## 📹 Demo

<!-- 
===========================================================================
PLACEHOLDER — APP WALKTHROUGH VIDEO
===========================================================================
Replace the comment block below with one of the following once the 
screen recording is ready:

Option A — GitHub-hosted video (drag & drop into the repo, e.g. /docs/demo.mp4):
  <video src="docs/demo.mp4" controls width="100%" muted autoplay loop></video>

Option B — YouTube / Loom embed:
  [![CalibAI Walkthrough](https://img.shields.io/badge/🎬%20Watch-Workflow%20Walkthrough-red?style=for-the-badge)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

Option C — GIF:
  ![CalibAI Walkthrough](docs/demo.gif)

Suggested recording script (≈60–90s):
  1. Google sign-in → chat workspace loads with conversation history
  2. Send a plain prompt (Chat agent) → streaming-style response
  3. Switch to the Coding agent → artifact panel opens with Monaco + live preview
  4. Attach a PDF → RAG-grounded answer
  5. Open Plans drawer → Razorpay checkout → credits update
===========================================================================
-->

<div align="center">
  <!-- 🎬 <b>Demo video coming soon.</b> -->
  <i>Demo walkthrough coming soon.</i>
</div>

---

## 🧭 Overview

CalibAI Frontend is the client application for **CalibAI**, an AI assistant that routes every prompt to one of **seven specialized agents** — general chat, coding, web search, image generation, PDF generation, slide decks, and PDF question-answering.

It is a single-page React application built for a chat-first workspace: a collapsible conversation sidebar, a markdown/code message stream, and a right-hand **artifact panel** where generated code projects open in a Monaco editor with a **sandboxed live HTML preview**.

> **Companion repo:** [`CalibAI-Backend`](https://github.com/Regestrac/CalibAI-Backend) — Express 5 microservices behind an API gateway, LangGraph multi-agent orchestrator, Redis sessions, and Razorpay billing.

---

## ✨ Features

### 💬 Chat Workspace
- **7-agent routing** — `Auto · Chat · Coding · Search · Image · PDF · PPT` selectable per message from a chip selector; the backend router decides the final agent when set to `Auto`.
- **Streaming-style UX** — optimistic message append, an `isAnswering` lock that disables inputs, and a cycling status shimmer (*Thinking → Analyzing → Searching → Processing → Generating*).
- **Rich markdown** — `react-markdown` + `remark-gfm` with a full custom component map: headings, lists, GFM tables, annotated external links, and clickable images.
- **Syntax-highlighted code blocks** — Prism `oneDark` theme, language label, one-click copy, inline vs. block detection.
- **Generated image gallery** — 3-column grid opening a keyboard-navigable lightbox (`Esc` / `←` / `→`, counter, backdrop blur).

### 🧩 Artifacts (Code Generation Output)
- Right-hand panel with **file tabs** and a **Monaco editor** (`vs-dark`, minimap when expanded).
- **Live preview:** sibling `.css` and `.js` files are inlined into the HTML and rendered inside a `sandbox="allow-scripts allow-modals"` iframe — no build step, no network calls.
- Copy-to-clipboard, language detection by file extension, Framer Motion width interpolation between 100% / 60% / 40%, and a spring slide-over drawer on mobile.

### 🗂 Conversation Management
- History list with active-state highlighting, **inline rename** (Enter / Escape / blur, 100-char cap, optimistic update), and delete with a reusable confirm dialog.
- Auto-titles a "New Chat" to the first prompt.
- URL-as-state routing: the active conversation id lives in the pathname (`/chat/:id`), synced with `navigate()` and `<Link>`.

### 🎙 Voice & Attachments
- **Voice input** via the Web Speech API — continuous interim results transcribed live into the composer, with permission/network error handling.
- **File uploads** — PDF and images up to 10 MB, thumbnail preview with a remove chip, sent as `multipart/form-data`.

### 🔐 Auth
- **Firebase Google sign-in** (`signInWithPopup`) → ID token exchanged once at the API → session held in an **httpOnly cookie**. No tokens are persisted in `localStorage`.
- Granular popup error mapping (`auth/popup-closed-by-user`, `auth/popup-blocked`, 401, 5xx, network) with inline error UI.

### 💳 Billing & Credits
- **Plans drawer** with a live credits progress bar — Free, **Starter ₹199/mo → 500 credits**, **Pro ₹399/mo → 1000 credits**.
- **Razorpay Checkout**: order created server-side → `window.Razorpay(...).open()` → signature verified server-side → credits refresh in the UI.
- Credits decrement in near-real-time after each AI response.

### 🎨 Design
- **Tailwind CSS v4 CSS-first `@theme`** design tokens (dark indigo/violet palette) consumed as utilities — no runtime JS config.
- Hand-built components with `lucide-react` icons, `react-hot-toast` themed to match, thin custom scrollbars, and Framer Motion panel choreography.

---

## 🛠 Tech Stack

| Layer | Choice |
| --- | --- |
| Build | Vite 8, `@vitejs/plugin-react` |
| UI | React 19, TypeScript ~6.0 (strict) |
| State | Redux Toolkit 2 — `user`, `conversation`, `message` slices |
| Routing | React Router v7 (`BrowserRouter`, URL-as-state) |
| Styling | Tailwind CSS 4 (`@theme` tokens), Framer Motion 13 |
| Auth | Firebase Authentication (Google) → httpOnly session cookie |
| HTTP | Axios (single instance, `withCredentials`) + service-per-endpoint modules |
| Editor | `@monaco-editor/react` |
| Markdown | `react-markdown`, `remark-gfm`, `react-syntax-highlighter` |
| Speech | Web Speech API (`SpeechRecognition`) |
| Payments | Razorpay Checkout |
| Feedback | `react-hot-toast` |
| QA | ESLint 10 flat config, `tsc -b` type-check on build |
| Deploy | Vercel (SPA rewrite) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 20+** and npm
- A running [`CalibAI-Backend`](https://github.com/Regestrac/CalibAI-Backend) (or set `VITE_SERVER_URL` to the deployed gateway)
- A **Firebase** project with Google provider enabled
- A **Razorpay** account (test keys are fine) — optional for local UI work

### 1. Install

```bash
git clone https://github.com/Regestrac/CalibAI-Frontend.git
cd CalibAI-Frontend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | Firebase web app config |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase web app config |
| `VITE_FIREBASE_PROJECT_ID` | Firebase web app config |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase web app config |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase web app config |
| `VITE_FIREBASE_APP_ID` | Firebase web app config |
| `VITE_SERVER_URL` | Base URL of the backend API gateway (e.g. `http://localhost:8000`) |
| `VITE_RAZORPAY_KEY_ID` | Razorpay checkout key |

### 3. Run

```bash
npm run dev        # http://localhost:5173
```

### 4. Build & lint

```bash
npm run build      # tsc -b && vite build
npm run lint       # ESLint 10 flat config
npm run preview    # serve the production build
```

---

## 📁 Project Structure

```
src/
├── App.tsx                  # bootstraps current-user fetch, auth gate
├── main.tsx                 # Redux Provider + BrowserRouter + Toaster
├── index.css                # Tailwind v4 @theme design tokens
│
├── components/
│   ├── ChatArea.tsx         # message stream shell
│   ├── ChatInput.tsx        # composer: agent chips, voice, uploads
│   ├── MessageList.tsx      # markdown + code + image rendering
│   ├── Artifact.tsx         # Monaco editor + live preview panel
│   ├── CodeBlock.tsx        # syntax highlighting + copy
│   ├── Lightbox.tsx         # keyboard-navigable image viewer
│   ├── FileUpload.tsx       # PDF/image attachment chip
│   ├── VoiceInput.tsx       # Web Speech API dictation
│   ├── Sidebar.tsx / Nav.tsx / ConfirmDialog.tsx
│   └── sidebar/             # ConversationList, PlansDrawer, AccountDetails
│
├── pages/                   # Home (workspace), SignupPage (auth gate)
├── redux/                   # store, userSlice, conversationSlice, messageSlice
├── services/                # 10 API modules (one function per endpoint)
├── hooks/                   # typed Redux hooks, useMediaQuery
├── helpers/                 # agents constants, shared types
└── utils/                   # axios instance, firebase, buildPreview, toasts
```

---

## 🔌 How It Talks to the Backend

Every request goes through **one Axios instance** bound to `VITE_SERVER_URL` with `withCredentials: true`, then through a small service module that catches errors, fires a toast, and returns a safe default:

| Service | Endpoint |
| --- | --- |
| `getCurrentUser` | `GET /api/me` |
| `logout` | `POST /api/auth/logout` |
| `createConversation` | `GET /api/chat/create-conversation` |
| `getConversations` | `GET /api/chat/get-conversations` |
| `getMessages` | `GET /api/chat/get-messages/:chatId` |
| `updateConversation` | `POST /api/chat/update-conversation` |
| `deleteConversation` | `DELETE /api/chat/delete-conversation/:id` |
| `sendMessage` | `POST /api/agent/chat` *(multipart)* |
| `createOrder` | `POST /api/billing/create` |
| `verifyPayment` | `POST /api/billing/verify` |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/amazing-thing`
3. Commit your changes — `git commit -m "Add amazing thing"`
4. Run `npm run lint` and `npm run build` before pushing
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with React, TypeScript, and Tailwind CSS · Part of the <b>CalibAI</b> project</sub>
</div>
