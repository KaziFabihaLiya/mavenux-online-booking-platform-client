# MAVENUX Online Ticket Booking Platform

## Overview

MAVENUX is a full-stack Online Ticket Booking Platform built with the MERN (MongoDB, Express.js, React, Node.js) stack. It enables users to discover, search, and book travel tickets for various transport modes including buses, trains, launches, and planes. The platform supports three distinct user roles:

- **User**: Browse and book tickets, view personal bookings, and manage transactions.
- **Vendor**: Add and manage tickets, view booking requests, and track revenue.
- **Admin**: Moderate tickets and users, approve/reject submissions, and handle fraud detection.

The platform emphasizes secure authentication (Firebase), role-based access control, real-time features (e.g., countdown timers for bookings), and seamless payment integration (Stripe). It is designed for scalability, with protected routes, API rate limiting, and environment-secured credentials.

### Key Features

- **User-Facing**:
  - Search and filter tickets by origin, destination, transport type, price, and date.
  - Book tickets with quantity selection and countdown timers.
  - Secure checkout via Stripe (supports BDT currency).
  - Dashboard for viewing booked tickets, transaction history, and profile management.
- **Vendor-Facing**:

  - Add new tickets with image upload, pricing, and availability.
  - Manage added tickets and view incoming booking requests.
  - Revenue overview and analytics.

- **Admin-Facing**:

  - Manage all tickets: Approve/reject vendor submissions.
  - User management: Assign roles (admin/vendor), mark vendors as fraud (hides their tickets).
  - Stats dashboards for tickets and users.

- **General**:
  - Responsive UI with Tailwind CSS and Lucide icons.
  - Real-time auth with Firebase (email/password + social login ready).
  - MongoDB for data persistence (users, tickets, bookings, transactions).
  - Error handling, loading states, and toast notifications.

### Live URL

- **Client**: [https://mavenux-client.vercel.app](https://mavenux-client.vercel.app) (Deployed on Vercel; fallback: http://localhost:5173)
- **Server/API**: [https://mavenux-server.vercel.app](https://mavenux-server.vercel.app) (Deployed on Vercel; fallback: http://localhost:5000)
- **Demo Credentials**:
  - Admin: `admin@ticketbari.com` / `Admin@123`
  - Vendor: `vendor@ticketbari.com` / `Vendor@123`
  - User: Register via app.

## Tech Stack

### Frontend (React Client)

- **Core**: React 18, React Router DOM
- **UI/Styling**: Tailwind CSS, Headless UI, Lucide React (icons)
- **State/Auth**: React Context API, Firebase Auth
- **HTTP**: Axios (with secure token interceptor)
- **Utils**: Moment.js (dates), React Hot Toast (notifications), React Hook Form (forms)
- **Other**: Vite (build tool), React Loading Spinner

### Backend (Node.js Server)

- **Core**: Express.js, Node.js 18
- **Database**: MongoDB (via MongoDB Node Driver), Mongoose (optional for schemas)
- **Auth/Security**: Firebase Admin SDK (token verification), CORS, Helmet (security headers)
- **Payments**: Stripe (checkout sessions, webhooks)
- **Utils**: Dotenv (env vars), Bcrypt (password hashing, though Firebase handles auth)

### Deployment & DevOps

- **Hosting**: Vercel (full-stack), MongoDB Atlas (cloud DB)
- **CI/CD**: GitHub Actions (basic lint/test)
- **Monitoring**: Console logging, optional Sentry integration

## Project Structure

```
MAVENUX-ONLINE-BOOKING-PLATFORM/
├── client/                          # React frontend
│   ├── public/                      # Static assets (logo, vite.svg)
│   ├── src/
│   │   ├── assets/                  # Images/Icons
│   │   ├── components/              # Reusable UI (Navbar, Footer, TicketCard, Modal)
│   │   │   ├── common/              # Shared (Error, LoadingSpinner)
│   │   │   ├── forms/               # Form components
│   │   │   └── ui/                  # Buttons, etc.
│   │   ├── context/                 # AuthContext
│   │   ├── hooks/                   # Custom hooks (useAuth, useAxiosSecure, useCountdown)
│   │   ├── layouts/                 # MainLayout, DashboardLayout
│   │   ├── pages/                   # Public (AllTickets, Login) & Protected (Dashboard/Admin/Vendor/User)
│   │   └── lib/                     # Utils, routes
│   └── package.json
├── server/                          # Node.js backend
│   ├── routes/                      # API routes (tickets, users, bookings, payments)
│   ├── middleware/                  # Auth, validation
│   └── index.js                     # Main server file
├── README.md                        # This file
└── .env.example                     # Env var template
```

## Setup & Installation

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account
- Firebase project (for auth)
- Stripe account (test keys)

### Environment Variables

Copy `.env.example` to `.env` in both client/server roots and fill in:

```
# Server (.env)
PORT=5000
MONGODB_URI=mongodb+srv://...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Client (.env)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Running Locally

1. **Clone & Install**:

   ```
   git clone <repo-url>
   cd MAVENUX-ONLINE-BOOKING-PLATFORM
   ```

2. **Backend**:

   ```
   cd server
   npm install
   npm run dev  # Or nodemon index.js
   ```

3. **Frontend**:

   ```
   cd client
   npm install
   npm run dev  # Vite server on :5173
   ```

4. **Seed DB** (Optional): Run a script to add sample tickets/users.
5. Access: http://localhost:5173

### Deployment

- **Client**: `npm run build` → Deploy to Vercel/Netlify.
- **Server**: Deploy to Vercel (serverless) or Render/Heroku.
- Update CORS origins in server for prod URLs.
- Set env vars in hosting dashboard.

## API Endpoints

| Method | Endpoint                        | Description            | Auth Required | Role   |
| ------ | ------------------------------- | ---------------------- | ------------- | ------ |
| GET    | `/api/tickets`                  | Fetch filtered tickets | No            | -      |
| GET    | `/api/tickets/:id`              | Single ticket details  | No            | -      |
| POST   | `/api/tickets`                  | Add ticket (vendor)    | Yes           | Vendor |
| PUT    | `/api/admin/tickets/:id/status` | Approve/reject ticket  | Yes           | Admin  |
| GET    | `/api/admin/users`              | List users             | Yes           | Admin  |
| PUT    | `/api/admin/users/:id/role`     | Change user role       | Yes           | Admin  |
| POST   | `/payment/create-session`       | Stripe checkout        | Yes           | User   |
| POST   | `/payment/webhook`              | Payment confirmation   | No            | -      |

Full docs: [Postman Collection](https://documenter.getpostman.com/view/...) (TBD)

## Contributing

- Fork & PR with descriptive commits.
- Follow ESLint/Prettier standards.
- Test thoroughly (Jest ready).

## Commits Summary

- **Client**: 25+ meaningful commits (e.g., "feat: add dashboard layout with role-based menus", "fix: secure axios interceptor for Firebase tokens").
- **Server**: 15+ meaningful commits (e.g., "feat: implement ticket approval endpoint", "chore: add Stripe webhook for payments").

## License

MIT License. © 2025 MAVENUX.


