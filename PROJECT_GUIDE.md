# TaskFlow — AI Build Instructions

This file is the master instruction doc for building this project. If you are an AI coding
assistant (Claude Code, Cursor, etc.), follow this file top to bottom. Do not skip the git
commit steps — commit after every meaningful chunk of work, not just at the end.

This doc has been updated based on actual Figma screenshots (board view, list view, task
detail, settings). Reference those screenshots while building — this file describes what's
in them so the AI doesn't have to guess.

---

## 0. Project Setup (run this first, exactly as-is)

```bash
echo "# task_flow" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/49Harsh/task_flow.git
git push -u origin main
```

After this, scaffold the actual project **inside the same repo** using the structure below.
Every step after this must end with `git add` + `git commit` + `git push`. See Section 6
(Commit Strategy) for exact commit messages.

---

## 1. Tech Stack

| Layer     | Choice                                   |
|-----------|-------------------------------------------|
| Frontend  | Next.js 14+ (App Router)                  |
| Styling   | Tailwind CSS                              |
| Backend   | NestJS                                    |
| Database  | mongodb (via TypeORM or Prisma)            |
| Language  | TypeScript everywhere                     |
| Auth      | Guest login (no password, JWT token)      |
| Deployment| Frontend → Vercel, Backend → Render/Railway |

---

## 2. What the App Actually Is (from Figma)

This is a **workspace-based task/project management tool** (ClickUp/Linear style), not a
plain to-do list. Key structure seen in Figma:

- Left sidebar: workspace name + avatar at top (e.g. "Dexter"), a "Workspace" collapsible
  section, then nav items **Tasks** and **Projects**.
- Top bar has a sidebar-collapse icon.
- Main "Tasks" page has a **List / Board view toggle**, a **Search** icon, a **Fields**
  dropdown (checkboxes to show/hide columns: Priority, Members, Due Date, Labels, Status,
  Reporter), a **Filter** icon, and an **"+ Add Task"** button.
- Clicking a task opens a **full task detail view** with properties, subtasks, and an
  activity/comments feed.
- There's a separate **Settings** area (Profile / Theme / Color) reached via a "Back to app"
  link at the top — this is its own layout, not a modal.

### Screens to build

1. **Guest login / landing** — simple entry, "Continue as Guest" creates a session.
2. **Dashboard shell** — sidebar (workspace switcher, Tasks, Projects) + topbar, wraps all
   authenticated pages.
3. **Tasks — Board view** (kanban)
   - Columns: **To Do**, **Doing**, **Completed**, **On Hold** (status-driven, so make this
     dynamic, not hardcoded — a task's `status` field determines its column).
   - Column header: drag handle icon, column name, `+` (quick add) and `...` (column menu)
     on the right.
   - Task card: title, `...` menu, assignee avatar + name, due date pill (top-right, e.g.
     "29 Jul"), one or more label/tag pills at the bottom (e.g. "Deployment").
   - "+ Add Task" row at the bottom of each column.
   - Top-right toolbar: Search icon, **Fields** dropdown (toggle which fields show on
     cards — Priority, Members, Due Date, Labels, Status, Reporter), Filter icon, **+ Add
     Task** primary button, and a List/Board segmented toggle.
4. **Tasks — List view**
   - Same tasks, grouped into collapsible sections by status (▾ To Do, ▾ Doing, ▾
     Completed, ▾ On Hold).
   - Table columns per section: **Task, Priority, Members, Due Date, Actions**.
   - Priority shown as colored text with a small icon (e.g. red "High", grey "Low", orange
     "Medium").
   - Members shown as avatar circle, or a "+" if unassigned, or initials badge (e.g. "CN")
     if no avatar image.
   - "+ Add Task" row inside each group.
5. **Task Detail** (opens as a side panel or dedicated route, e.g. `/tasks/[id]`)
   - Left/main area:
     - Title (large, editable inline)
     - Description text
     - **Properties** row: Assignee, Labels, Resources (attachments/links)
     - **Subtasks** section: a mini table (Task, Priority, Members, Due Date, Actions) +
       "+ Add Subtasks" row
     - Below that, an **activity feed**: assignee name + avatar, system-generated update
       lines (e.g. "changed priority from ... to ...", "posted an update"), and a comment
       composer ("Leave a reply...") with attach + send icons.
   - Right sidebar **Details** panel:
     - Status (dropdown, e.g. "Backlog")
     - Priority (dropdown, e.g. "High")
     - Members
     - Dates
     - Labels
     - Teams
     - Reporter
     - A small `+` and gear icon at the top to add/configure fields
   - Top bar of the detail view: back/collapse icon, watch/notification icon, comment-count
     icon, share icon, more-options icon.
6. **Settings** (separate layout, "← Back to app" link top-left)
   - Left nav: Search box, **Profile**, **Theme**, **Color**.
   - **Profile page**: Profile picture (avatar + upload), Email (read display + edit
     pencil icon), Full name (editable text field), Title ("Your job title or role" as
     placeholder-style helper text), Username ("One word, like a nickname or first name").
     Below that, a **Workspace access** card with "Remove yourself from the workspace" and
     a red **Leave Workspace** button.
   - **Theme page**: theme options (light/dark or whatever variants Figma shows) —
     persisted to localStorage + synced to user profile in backend.
   - **Color page**: accent color picker (the app's primary/accent color, independent of
     light/dark theme).

**Important:** Theme and Color are two separate settings, not one toggle. Build them as
two independent preferences: `theme` (light/dark) and `accentColor` (a color value), both
persisted (localStorage for instant load + backend field on the user so it syncs across
sessions).

---

## 3. Repository / Folder Structure

```
task_flow/
├── README.md
├── PROJECT_GUIDE.md
├── .gitignore
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx                     # root layout, ThemeProvider + AccentColorProvider
│   │   ├── globals.css                    # tailwind base + CSS variables for theme/accent
│   │   ├── page.tsx                       # guest login / landing
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx                 # sidebar + topbar shell
│   │   │   ├── tasks/
│   │   │   │   ├── page.tsx               # Tasks — board/list toggle lives here
│   │   │   │   └── [taskId]/page.tsx      # Task detail (or intercepted route as a panel)
│   │   │   └── projects/
│   │   │       └── page.tsx
│   │   │
│   │   └── settings/
│   │       ├── layout.tsx                 # settings shell with "Back to app" + left nav
│   │       ├── profile/page.tsx
│   │       ├── theme/page.tsx
│   │       └── color/page.tsx
│   │
│   ├── components/
│   │   ├── ui/                            # Button, Input, Modal, Badge, Avatar, Dropdown,
│   │   │                                    Checkbox, Pill/Tag, ColorSwatch
│   │   ├── tasks/
│   │   │   ├── TaskBoard.tsx              # kanban container
│   │   │   ├── TaskColumn.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskListView.tsx           # grouped table container
│   │   │   ├── TaskListGroup.tsx          # one collapsible status group
│   │   │   ├── TaskListRow.tsx
│   │   │   ├── TaskDetail/
│   │   │   │   ├── TaskDetailHeader.tsx
│   │   │   │   ├── TaskProperties.tsx
│   │   │   │   ├── SubtaskTable.tsx
│   │   │   │   ├── ActivityFeed.tsx
│   │   │   │   ├── CommentComposer.tsx
│   │   │   │   └── DetailsSidebar.tsx     # Status/Priority/Members/Dates/Labels/Teams/Reporter
│   │   │   ├── AddTaskModal.tsx
│   │   │   ├── FieldsDropdown.tsx         # the checkbox field-toggle panel
│   │   │   ├── FilterPanel.tsx
│   │   │   └── ViewToggle.tsx             # List/Board segmented control
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   └── WorkspaceSwitcher.tsx
│   │   └── settings/
│   │       ├── SettingsNav.tsx
│   │       ├── ProfileForm.tsx
│   │       ├── ThemePicker.tsx
│   │       └── ColorPicker.tsx
│   │
│   ├── context/
│   │   ├── ThemeContext.tsx
│   │   └── AuthContext.tsx
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── types.ts                       # Task, Subtask, User, Label, Comment, Priority, Status
│   │
│   ├── hooks/
│   │   ├── useTasks.ts
│   │   ├── useTaskDetail.ts
│   │   └── useTheme.ts
│   │
│   ├── public/
│   ├── tailwind.config.ts
│   ├── next.config.js
│   ├── package.json
│   └── .env.local.example
│
├── backend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.module.ts / .controller.ts / .service.ts
│   │   │   └── dto/guest-login.dto.ts
│   │   │
│   │   ├── users/
│   │   │   ├── users.module.ts / .controller.ts / .service.ts
│   │   │   ├── entities/user.entity.ts
│   │   │   └── dto/update-profile.dto.ts, update-settings.dto.ts
│   │   │
│   │   ├── workspaces/
│   │   │   ├── workspaces.module.ts / .controller.ts / .service.ts
│   │   │   └── entities/workspace.entity.ts
│   │   │
│   │   ├── projects/
│   │   │   ├── projects.module.ts / .controller.ts / .service.ts
│   │   │   └── entities/project.entity.ts
│   │   │
│   │   ├── tasks/
│   │   │   ├── tasks.module.ts / .controller.ts / .service.ts
│   │   │   ├── entities/task.entity.ts
│   │   │   ├── entities/subtask.entity.ts
│   │   │   └── dto/create-task.dto.ts, update-task.dto.ts, create-subtask.dto.ts
│   │   │
│   │   ├── labels/
│   │   │   ├── labels.module.ts / .controller.ts / .service.ts
│   │   │   └── entities/label.entity.ts
│   │   │
│   │   ├── comments/
│   │   │   ├── comments.module.ts / .controller.ts / .service.ts
│   │   │   └── entities/comment.entity.ts
│   │   │
│   │   └── common/
│   │       ├── filters/http-exception.filter.ts
│   │       ├── guards/guest-auth.guard.ts
│   │       └── interceptors/transform.interceptor.ts
│   │
│   ├── test/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── part-2/
    ├── ablespace-walkthrough.md
    └── screenshots/
```

---

## 4. Backend Data Model

```
User
  id, email, fullName, title, username, avatarUrl,
  isGuest, theme ('light' | 'dark'), accentColor (string, hex),
  createdAt

Workspace
  id, name, avatarUrl, ownerId (User)

Project
  id, name, workspaceId

Task
  id, title, description, status ('todo' | 'doing' | 'completed' | 'on_hold' | 'backlog'),
  priority ('low' | 'medium' | 'high' | 'urgent'),
  dueDate, position (int, for ordering within a column),
  projectId, reporterId (User), createdAt, updatedAt

TaskMember (join table)
  taskId, userId

Label
  id, name, color

TaskLabel (join table)
  taskId, labelId

Subtask
  id, taskId, title, priority, dueDate, position

SubtaskMember (join table)
  subtaskId, userId

Comment
  id, taskId, authorId, content,
  type ('comment' | 'system_update'),
  createdAt
```

`status` and `priority` should be enums shared between frontend `types.ts` and backend DTOs
so the board columns and list groups stay in sync with what the API returns.

---

## 5. Backend API Endpoints

```
POST   /auth/guest                      create guest user + return JWT

GET    /users/me                        current user profile
PATCH  /users/me                        update fullName, title, username, avatarUrl
PATCH  /users/me/settings               update theme, accentColor

GET    /workspace                       current user's workspace

GET    /projects
POST   /projects

GET    /tasks?projectId=&status=        list tasks (used by both board + list view)
POST   /tasks                           create task
GET    /tasks/:id                       full task detail incl. subtasks + comments
PATCH  /tasks/:id                       update fields (title, status, priority, dueDate, etc.)
PATCH  /tasks/:id/position              reorder within/between columns (drag-drop)
DELETE /tasks/:id

POST   /tasks/:id/subtasks
PATCH  /subtasks/:id
DELETE /subtasks/:id

GET    /tasks/:id/comments
POST   /tasks/:id/comments

GET    /labels
POST   /labels
```

All mutating endpoints use DTOs with `class-validator`. `ValidationPipe` enabled globally
in `main.ts`. Guest JWT required on every route except `/auth/guest`.

---

## 6. Commit Strategy (do this as you go, not at the end)

```
first commit                                              (Section 0, already done)
chore: scaffold Next.js frontend + Tailwind config
chore: scaffold NestJS backend structure
feat(backend): add User, Workspace, Project entities
feat(backend): add guest auth endpoint + guard
feat(backend): add Task and Subtask entities with DTO validation
feat(backend): add Label and Comment entities
feat(backend): add tasks CRUD + position/reorder endpoint
feat(backend): add comments endpoints
feat(backend): add global exception filter
feat(frontend): add theme + accent color context with persistence
feat(frontend): add reusable UI primitives (Button, Modal, Badge, Avatar, Dropdown)
feat(frontend): add guest login screen
feat(frontend): add dashboard shell (sidebar + topbar)
feat(frontend): add Tasks board view (columns, cards, add task)
feat(frontend): add Fields dropdown and Filter panel
feat(frontend): add Tasks list view (grouped table)
feat(frontend): connect board/list views to backend API
feat(frontend): add task detail view (properties, subtasks, details sidebar)
feat(frontend): add activity feed + comment composer
feat(frontend): add settings shell (Profile, Theme, Color pages)
style(frontend): responsive pass — tablet and mobile breakpoints
fix: [bugs as they come up]
docs: write README with setup instructions and design deviations
chore: add Part 2 AbleSpace walkthrough doc
chore: deployment config for Vercel and Render
```

Push after every commit. Don't commit `node_modules`, `.env`, or `dist/` — confirm
`.gitignore` covers these before the first real code commit. Don't batch multiple features
into a single commit.

---

## 7. README.md (final deliverable, planned from day 1)

Must include:
1. Project overview
2. Tech stack + why
3. Folder structure summary
4. Setup instructions (frontend + backend separately, incl. env vars)
5. How guest login works
6. Live deployed URLs (frontend + backend)
7. Screenshots — board view, list view, task detail, settings (theme + color)
8. **Deviations from Figma design** — explicit, honest, this is evaluated
9. Known limitations / what you'd improve with more time

---

## 8. Part 2 — AbleSpace Product Understanding

1. Sign up for AbleSpace (trial/demo access).
2. Navigate to **Caseload tab → Take Data screen**.
3. Screenshot every step of the workflow as you go.
4. Write `part-2/ablespace-walkthrough.md`:
   - Who this screen is for and what problem it solves
   - Step-by-step description of the flow, in your own words
   - 2–4 specific UX/UI or functionality improvements, each with a concrete reason
5. Or record a short video walkthrough instead, link it in the main README.

---

## 9. Deployment Checklist

- [ ] Frontend deployed on Vercel, env var pointing to live backend URL
- [ ] Backend deployed on Render/Railway, CORS allows the Vercel domain
- [ ] Click through the whole flow on the live URL in an incognito window
- [ ] Confirm theme + accent color persist after a hard refresh
- [ ] Confirm guest login works on a fresh browser session
- [ ] Repo is public
- [ ] README has working live links
- [ ] Everything still up in 45 days (check back on free-tier services)
