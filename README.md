# AI Research Proposal Assistant Web

Frontend MVP for an AI-assisted student research proposal workflow. The app helps students create proposals, reviewers evaluate them, lecturers inspect matching suggestions, and admins demo system monitoring.

## Tech Stack

- Next.js App Router
- JavaScript + JSX
- React
- TailwindCSS
- Frontend-only mock API

No TypeScript is used in this repo.

## Features

- Role-based authentication with local mock sessions.
- Student dashboard, proposal list, proposal creation, and proposal detail.
- Mock AI feedback panel with a runnable feedback action.
- Reviewer dashboard with rubric preview and status update actions.
- Lecturer matching page with mock recommendation actions.
- Admin console with user overview, system status, AI request logs, and audit logs.
- Loading, empty, error, and friendly not-found states across core pages.

## Demo Accounts

All demo accounts use the mock API and the same password:

| Role | Email | Password |
| --- | --- | --- |
| Student | `student@demo.com` | `demo123` |
| Reviewer | `reviewer@demo.com` | `demo123` |
| Admin | `admin@demo.com` | `demo123` |
| Lecturer | `lecturer@demo.com` | `demo123` |

Suggested demo flow:

Login → Dashboard → Create proposal → View proposal detail → Run AI Feedback mock → Review page → Lecturer matching page → Admin page

## Project Structure

```text
src/
  app/
    admin/
    dashboard/
    login/
    matching/
    proposals/
    review/
    layout.js
    page.jsx
  components/
    ai/
    layout/
    matching/
    proposal/
    review/
    ui/
  hooks/
  lib/
    api.js
    auth.js
    constants.js
    mockApi.js
    mockData.js
```

## Local Development

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

Quality checks:

```bash
npm run lint
npm run build
```

## Mock API Strategy

The frontend currently uses a mock API only. `src/lib/api.js` exports the implementation from `src/lib/mockApi.js`, which reads and mutates in-memory mock data during the browser session.

There is no real backend, database, OpenAI call, Claude call, or external AI provider call in the current frontend. AI feedback, rubric data, matching suggestions, and audit logs are demo mocks.

## Environment Variables

Copy `.env.example` to `.env.local` for local overrides when needed.

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_SENTRY_DSN=
```

No secrets should be committed to the repo. Public `NEXT_PUBLIC_*` values are visible to the browser and must not contain private keys.

## Pages

- `/` - Landing page
- `/login` - Mock login
- `/dashboard` - Role-aware dashboard
- `/proposals` - Proposal list with search and status filter
- `/proposals/new` - Create proposal
- `/proposals/[id]` - Proposal detail with mock AI feedback and rubric
- `/review` - Reviewer/admin review dashboard
- `/matching` - Lecturer matching suggestions
- `/admin` - Admin-only demo console

## Future Backend Integration

When the FastAPI backend is ready, replace the adapter in `src/lib/api.js` so it calls backend endpoints instead of exporting `mockApi`.

Recommended migration path:

- Keep page/component contracts stable.
- Move request logic into `src/lib/api.js`.
- Use `NEXT_PUBLIC_API_BASE_URL` as the backend base URL.
- Keep `NEXT_PUBLIC_USE_MOCK_API=true` available for demos and offline development.
- Add real authentication/session handling only when the backend contract is ready.
