# Travel Agency Client

This is the client-side React app for the Travel Agency platform.

## Features
- Modern authentication (login, logout) using the backend API
- Built with Vite, React, shadcn/ui, TanStack Query, and Zod
- Clean, accessible UI with shadcn components

## Getting Started

1. `npm install`
2. `npm run dev`

Configure the API base URL in the `.env` file if needed.

---

## Authentication
- Uses the `/api/login` endpoint from the Laravel backend
- Stores the Bearer token securely in localStorage
- All authenticated requests send the token in the Authorization header

---

## Tech Stack
- React 18
- Vite
- shadcn/ui
- TanStack Query
- Axios
- Zod
- React Router DOM

---

## License
MIT
