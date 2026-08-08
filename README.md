# TaskFlow — Workspace-Based Task & Project Management

TaskFlow is a modern, high-performance workspace task and project management application built with **Next.js 14+ (App Router)** and **NestJS (TypeScript)**. Inspired by ClickUp and Linear, it gives engineering teams and project managers powerful visual tools to organize tasks across dynamic Kanban Board views, collapsible grouped List views, interactive Task Detail side panels, and customizable workspace theme/color settings.

---

## 🚀 Live Demo & Deployment Setup

- **Frontend Application**: Deployed on Vercel (`https://taskflow-app.vercel.app`)
- **Backend API Server**: Deployed on Render/Railway (`https://taskflow-api.onrender.com`)

---

## 🛠️ Tech Stack & Key Architectural Decisions

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend Framework** | Next.js 14+ (App Router) | Server-side rendering, instant page transitions, and clean file-based routing. |
| **Styling** | Tailwind CSS v4 + Vanilla CSS Variables | Rapid styling with complete dynamic theme/accent color reactivity. |
| **Icons & UI** | Lucide React | Lightweight, consistent icon set matching modern SaaS tools. |
| **Backend Framework** | NestJS (TypeScript) | Modular, enterprise-grade architecture with dependency injection and DTO validation. |
| **Database & ORM** | MongoDB via Prisma Client | Flexible document storage for tasks, subtasks, activity feeds, and workspace settings. |
| **Authentication** | Guest JWT Auth | Instant onboarding without friction — generates guest token and seeds sample workspace data immediately. |

---

## 📁 Repository & Folder Structure

```
task_flow/
├── README.md                           # Master documentation
├── PROJECT_GUIDE.md                    # Figma specs & implementation guide
│
├── frontend/                           # Next.js 14 Web Application
│   ├── app/
│   │   ├── layout.tsx                  # Root layout with ThemeProvider + AuthProvider
│   │   ├── page.tsx                    # Guest login / landing page
│   │   ├── globals.css                 # CSS variables for themes & accent colors
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx              # Sidebar + Topbar shell
│   │   │   ├── tasks/
│   │   │   │   ├── page.tsx            # Tasks view (Board / List toggle)
│   │   │   │   └── [taskId]/page.tsx   # Detailed Task view
│   │   │   └── projects/
│   │   │       └── page.tsx            # Projects list & creation
│   │   └── settings/
│   │       ├── layout.tsx              # Settings shell with "Back to app" nav
│   │       ├── profile/page.tsx        # Profile form & workspace access
│   │       ├── theme/page.tsx          # Light / Dark theme selector
│   │       └── color/page.tsx          # Dynamic Accent Color picker
│   ├── components/                     # UI Primitives, Layouts, Task & Detail views
│   ├── context/                        # ThemeContext & AuthContext
│   └── lib/                            # API client & TypeScript interfaces
│
├── backend/                            # NestJS Backend API
│   ├── src/
│   │   ├── app.module.ts               # Root module importing all feature modules
│   │   ├── auth/                       # Guest login endpoint & JWT strategy
│   │   ├── users/                      # Profile & settings endpoints
│   │   ├── workspaces/                 # Workspace management
│   │   ├── projects/                   # Projects endpoints
│   │   ├── tasks/                      # Tasks & subtasks CRUD + position reordering
│   │   ├── comments/                   # Comments & system activity feed endpoints
│   │   ├── labels/                     # Tag/label endpoints
│   │   └── common/                     # Guest auth guard & global exception filter
│   └── prisma/
│       └── schema.prisma               # Prisma schema for MongoDB
│
└── part-2/
    └── ablespace-walkthrough.md        # AbleSpace Caseload / Data Collection analysis
```

---

## ⚡ Local Development Setup Guide

### Prerequisites
- **Node.js**: v18+ installed
- **npm** or **pnpm**
- **MongoDB**: Local MongoDB instance or MongoDB Atlas URI

### 1. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/taskflow?retryWrites=true&w=majority"
JWT_SECRET="taskflow-super-secret-jwt-key"
PORT=4000
```

Generate Prisma Client and start server:
```bash
npx prisma db push
npm run start:dev
```
Backend API will run on `http://localhost:4000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env.local` file inside `frontend/`:
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

Start Next.js dev server:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🔑 How Guest Login Works

1. On the landing page (`/`), clicking **"Continue as Guest"** calls `POST /auth/guest`.
2. The backend generates a new `User` record with `isGuest: true`, creates a default workspace (`Dexter`), project (`Core Platform`), default labels, and pre-populates sample tasks, subtasks, and system update activity logs.
3. A JWT token is returned and stored in `localStorage` (`taskflow_token`), allowing seamless access across sessions without requiring a password.

---

## 🎨 Theme & Accent Color System

- **Theme**: Supports **Light Mode** and **Dark Mode** toggle. Changes root `.dark` class on `document.documentElement` and updates background/card contrast CSS variables.
- **Accent Color**: Independent color picker supporting preset brand colors (Coral, Indigo, Blue, Emerald, Pink, Purple, Amber) and custom Hex values. Sets `--accent-color` and `--accent-rgb` variables globally for buttons, active tabs, and focus rings.
- **Persistence**: Preferences are immediately saved to `localStorage` and synced with `PATCH /users/me/settings` on the backend.

---

## 📌 Figma Design Deviations & Enhancements

| Area | Figma Design | Implementation Details / Deviation |
|---|---|---|
| **Drag & Drop** | Hardcoded board cards | Fully dynamic HTML5 Drag-and-Drop enabling instant column state updates and backend position reordering. |
| **Settings Layout** | Modal or integrated panel | Built as a dedicated route (`/settings/*`) with "← Back to app" top-left navigation, as specified in design requirements. |
| **Theme & Accent** | Combined toggle | Built as two completely independent settings pages (`/settings/theme` and `/settings/color`) per requirements. |
| **Activity Feed** | Static text comments | Interactive feed displaying both user-submitted comments and automated system update logs (e.g., status/priority changes). |

---

## 🔮 Known Limitations & Future Improvements

1. **Real-time Collaboration**: Currently relies on API polling/re-fetching. Future iterations could integrate WebSockets (Socket.io) for live multi-user card drag synchronization.
2. **File Attachments Storage**: Links currently accept URLs; cloud blob storage (AWS S3 / Uploadthing) can be hooked up for file uploads.
3. **Advanced Analytics**: Adding sprint burndown charts and velocity metrics under Projects.