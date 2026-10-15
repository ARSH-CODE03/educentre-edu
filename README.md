# EduCentre — Local Coaching Centre Management Platform

Plain **Vite + React (JSX) + Tailwind CSS v4** single-page app. No backend/server needed.

## Run locally
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview
```

## Entry points
- `index.html` — HTML shell (fonts + `#root`)
- `src/main.jsx` — React bootstrap
- `src/App.jsx` — all routes (public pages + admin/teacher/student dashboards)
- `src/index.css` — Tailwind v4 + design tokens (light theme)

## Structure
```
src/
  App.jsx  main.jsx  index.css
  components/   ui-kit.jsx, Navbar, Footer, Logo, PublicShell, charts
  layouts/      DashboardLayout.jsx (role sidebar + topbar)
  pages/        Landing/ Auth/ Admin/ Teacher/ Student/ Shared/
  hooks/        useAuth.jsx  (demo auth in localStorage)
  data/         mock.js (demo data), navigation.js (role menus)
  services/     api.js  (REST client — point VITE_API_URL at a backend later)
  lib/          utils.js, router-compat.jsx
  utils/        format.js
```

## Demo login
Any email/password works — pick Admin, Teacher or Student on `/login`.
