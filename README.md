# 🚀 ToolNest Frontend

ToolNest is a private, PIN-secured personal dashboard built with Next.js and Firebase. Track your expenses, todos, stock earnings, schedules, and more — all in one modular, scalable workspace. 

ToolNest's frontend is built using **Next.js** — a powerful fullstack React framework — to deliver a fast, scalable, and dynamic experience. This app connects with the ToolNest Django backend and handles all UI, user interaction, and client-side logic.

---

## 🧩 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** TypeScript (or JavaScript)
- **Styling:** Tailwind CSS
- **State Management:** React Context (or Redux if needed)
- **Animations:** Framer Motion (optional)
- **API:** Axios (connected to Django DRF backend)

---

## 📦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/toolnest-frontend.git
cd toolnest-frontend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=https://toolnest-backend.onrender.com
```

> Make sure the URL points to your deployed backend.

---

## 🚴‍♂️ Running the App Locally

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📁 Folder Structure

```
/toolnest-frontend
├── public/                        # Static assets (icons, images, etc.)
├── pages/                         # Next.js route pages
│   ├── _app.tsx                   # Root component
│   ├── index.tsx                  # Dashboard or Landing
│   ├── auth/                      # Auth routes
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── otp.tsx
│   └── tasks/                     # Task-related routes
│       ├── index.tsx
│       └── [taskId].tsx
│
├── components/                   # Generic UI components
│   ├── common/                   # Buttons, Modals, Inputs, etc.
│   └── layout/                   # Navbar, Sidebar, Layout wrappers
│
├── features/                     # Domain-level logic (SOLID focused)
│   ├── auth/
│   │   ├── components/           # Feature-specific UI components
│   │   ├── hooks/                # Feature-specific hooks
│   │   ├── services/             # API calls related to auth
│   │   └── types.ts              # Auth-specific types
│   ├── tasks/
│   │   ├── components/           # TaskCard, TaskForm
│   │   ├── hooks/                # useTasks, useDailyTasks
│   │   ├── services/             # API interaction (axios)
│   │   └── types.ts
│   └── ...                       # Future features (analytics, etc.)
│
├── hooks/                        # Global custom hooks
├── services/                     # Axios clients, auth interceptors
├── store/                        # Global state management (Zustand/Context)
├── utils/                        # Helper functions
├── constants/                    # Static constants (enums, configs)
├── types/                        # Global TypeScript types
├── styles/                       # Global styles (Tailwind config, etc.)
├── middleware.ts                 # Route guards (optional)
├── env.d.ts                      # TypeScript typing for env vars
├── tailwind.config.js            # Tailwind setup
├── tsconfig.json                 # TypeScript config
├── next.config.js                # Next.js config
└── .env.local                    # Local environment variables

```

---

## 🔐 Auth Flow

* Email/password login
* OTP-based session verification
* Token stored in `localStorage` or `httpOnly` cookie (you choose)
* Auto-refresh & protected routes

---

## 📡 API Integration

Uses `axios` with a pre-configured base URL (`NEXT_PUBLIC_API_BASE_URL`). Intercepts requests to include auth tokens, handles error responses globally.

---

## 🧪 Testing

```bash
npm run test
# Coming soon: unit & integration tests with React Testing Library
```

---

## 🚀 Deployment

For production builds:

```bash
npm run build
npm start
```

Deploy on:

* **Vercel** (recommended)
* **Netlify**
* **Render (static site)**

---

## 🧠 Contributing

Want to contribute to ToolNest? PRs are welcome — just make sure to:

* Follow the folder structure
* Keep code DRY and reusable
* Use meaningful commits

---

## ✅ Status

Frontend is actively in development. Connected to live backend ✅
Modules:

* [x] Auth
* [x] Tasks
* [ ] Notifications
* [ ] UI polish
* [ ] Analytics

---

## 📬 Contact

Created by [@jatin7425](https://github.com/jatin7425).
If you found a bug or want to suggest improvements, open an issue!

