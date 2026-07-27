# 🚀 FreelanceHub — Premium MERN Freelance Marketplace

<div align="center">

![FreelanceHub Banner](https://img.shields.io/badge/MERN-Stack-blueviolet?style=for-the-badge&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active%20Development-orange?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-18%2B-brightgreen?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)

**A next-generation, full-stack freelance marketplace with real-time messaging, triple-theme UI, and intelligent proposal automation — built on the MERN stack.**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Core Features](#-core-features)
- [Project Structure](#-project-structure)
- [Setup & Installation](#-setup--installation)
- [Environment Variables](#-environment-variables)
- [Database Seeding](#-database-seeding)
- [Running the App](#-running-the-app)
- [API Reference](#-api-reference)
- [Future Roadmap](#-future-roadmap)

---

## 🌟 Overview

**FreelanceHub** is a premium freelance marketplace that connects clients with skilled freelancers. Clients can post projects, review proposals, and communicate directly with hired freelancers through a real-time chat system. Freelancers can browse open jobs, submit bids, and track the status of their proposals.

The platform is built with a strong emphasis on **developer experience**, **UI excellence**, and **production-grade business logic** — including automatic proposal denial, self-destructing messages, and a stunning tri-mode theme engine.

---

## 🛠 Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ | Runtime environment |
| **Express.js** | 5.x | REST API framework |
| **MongoDB** | Atlas | Primary database |
| **Mongoose** | 9.x | ODM / schema management |
| **Socket.io** | 4.x | Real-time bidirectional messaging |
| **bcryptjs** | 3.x | Password hashing |
| **jsonwebtoken** | 9.x | JWT authentication |
| **dotenv** | 17.x | Environment variable management |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19 | UI framework |
| **Vite** | 8.x | Build tool & dev server |
| **React Router DOM** | 6.x | Client-side routing |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **Framer Motion** | Latest | Fluid animations & 3D effects |
| **Lucide React** | Latest | Premium icon system |
| **Axios** | Latest | HTTP client |
| **Zustand** | Latest | Lightweight global state management |
| **Socket.io Client** | 4.x | Real-time communication |

---

## ✨ Core Features

### 🔐 Role-Based Authentication
- JWT-secured login & registration system.
- Two distinct user roles: **Client** and **Freelancer**.
- Protected routes that redirect users based on their role.
- Passwords are hashed using `bcryptjs` before storage.
- Role is normalized during registration (handles strings like "Hire Freelancers" → `"Client"`).

### 🎨 Dynamic Triple-Theme System
A fully implemented global theme engine supporting **three visual modes** toggled from the Navbar:

| Mode | Description |
|---|---|
| 🌙 **Dark** | Deep `#030712` blacks, neon purple/blue accents, glowing shadows |
| 🔮 **Glass** | Animated mesh gradient backgrounds, heavy `backdrop-blur`, semi-transparent frosted panels |
| ☀️ **Light** | Clean white surfaces, vibrant purple accents, soft shadows |

All UI components consume CSS variables (`--bg-card`, `--text-primary`, `--accent`, etc.) that update globally on theme change — no page reload needed.

**Premium UI Features:**
- Floating pill-shaped Navbar with `backdrop-filter` glassmorphism.
- `framer-motion` staggered card entrance animations with spring physics.
- 3D hover/tilt effects on project and proposal cards.
- Animated gradient text headers using `background-clip`.
- Glowing pulse animations on primary action buttons.
- Smooth `AnimatePresence` modal transitions.

### 📋 Proposal System with Auto-Deny Logic
- Freelancers can submit a proposal (cover letter + bid amount) for any open project.
- Each freelancer can only submit **one proposal per project**.
- When a client **accepts** a proposal:
  1. The selected proposal's status → `"Accepted"`.
  2. The project's status → `"In Progress"`.
  3. All **other pending proposals** for that project are automatically → `"Denied"` via `Proposal.updateMany()`.
- Status badges in the Freelancer Dashboard update in real time with color-coded indicators:
  - 🟢 **Accepted** — Green
  - 🟡 **Pending** — Amber
  - 🔴 **Denied** — Red (bold)

### 💬 Real-Time Messaging (Dedicated Page)
- A fully dedicated `/messages` route with a two-pane layout.
- **Left Sidebar:** Lists all accepted project conversations with animated hover effects.
- **Right Pane:** Full chat window with:
  - Sent messages: Purple gradient bubbles with glow shadow.
  - Received messages: Frosted glass bubbles adapting to the active theme.
  - `framer-motion` "pop-in" animation for each new message.
  - Floating pill-shaped input bar with an animated Send button.
- **MongoDB Chat Persistence:** Every message is saved to the `Message` collection. Switching rooms or refreshing fetches the full history from `GET /api/messages/:roomId`.
- **Self-Destructing Messages:** Optional TTL — users can configure messages to auto-expire in 1 minute, 1 hour, or 1 day via MongoDB's `expireAfterSeconds` TTL index.
- **Real-Time Updates:** Powered by Socket.io rooms — both parties see messages instantly without refresh.

### 🌱 Database Seeding
- A standalone `server/seed.js` script populates the database with **30 realistic freelance projects** across diverse niches (MERN dev, UI/UX design, Python scripting, game development, SEO, etc.).
- Creates a demo Client account (`democlient@test.com`) automatically.
- Safe to run multiple times (finds or creates the client, does not duplicate).

---

## 📁 Project Structure

```
freelance-marketplace/
├── client/                        # React Frontend (Vite)
│   ├── public/
│   └── src/
│       ├── components/
│       │   └── Navbar.jsx         # Floating glassmorphic navbar w/ theme switcher
│       ├── context/
│       │   └── ThemeContext.jsx   # Global theme state (light/dark/glass)
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Signup.jsx
│       │   ├── ClientDashboard.jsx
│       │   ├── FreelancerDashboard.jsx
│       │   ├── Messages.jsx       # Dedicated real-time chat page
│       │   └── Payment.jsx
│       ├── store/
│       │   └── useAuthStore.js    # Zustand auth store
│       ├── utils/
│       │   └── api.js             # Axios instance with auth interceptor
│       ├── App.jsx
│       └── index.css              # Premium CSS with theme variables
│
└── server/                        # Node.js / Express Backend
    ├── controllers/
    │   └── messageController.js
    ├── middleware/
    │   └── auth.js                # JWT protect middleware
    ├── models/
    │   ├── User.js
    │   ├── Project.js
    │   ├── Proposal.js
    │   ├── Message.js             # TTL index for self-destruct
    │   └── Review.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── projectRoutes.js
    │   ├── proposalRoutes.js      # Auto-deny logic in accept endpoint
    │   ├── messageRoutes.js
    │   └── reviewRoutes.js
    ├── seed.js                    # Database seeder (30 projects)
    ├── server.js                  # Entry point w/ Socket.io
    └── .env                       # Environment variables (not committed)
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher
- A MongoDB Atlas cluster (or local MongoDB instance)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/freelance-marketplace.git
cd freelance-marketplace
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../client
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `server/` directory with the following variables:

```env
# MongoDB Connection String (from MongoDB Atlas)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/freelance-marketplace?retryWrites=true&w=majority

# JWT Secret — use a long, random string
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Server Port (optional, defaults to 5000)
PORT=5000
```

> **⚠️ Important:** Never commit your `.env` file to version control. It is already listed in `.gitignore`.

> **MongoDB Atlas IP Whitelist:** If you encounter connection errors, go to your Atlas cluster → Network Access → Add your current IP address (or `0.0.0.0/0` for development).

---

## 🌱 Database Seeding

To populate the database with 30 realistic demo projects and a dummy Client user:

```bash
# From the server/ directory
cd server
node seed.js
```

**What this creates:**
- **Demo Client Account:**
  - Name: `Global Tech LLC`
  - Email: `democlient@test.com`
  - Password: `password123`
  - Role: `Client`
- **30 open projects** spanning: MERN Dev, UI/UX, Python Scripting, Flutter, Smart Contracts, SEO, Game Dev, DevOps, and more.

> Run this only once. If you run it again, it will find the existing client and insert additional projects.

---

## 🚀 Running the App

### Start the Backend (with auto-restart)
```bash
cd server
npx nodemon server.js
# Server runs on http://localhost:5000
```

### Start the Frontend (dev mode)
```bash
cd client
npm run dev
# App runs on http://localhost:5173
```

Open your browser and navigate to **http://localhost:5173**.

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user |
| `POST` | `/api/auth/login` | Public | Login and receive JWT |

### Projects
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/projects` | Private | Get all open projects |
| `GET` | `/api/projects/me` | Client | Get my posted projects |
| `POST` | `/api/projects` | Client | Create a new project |

### Proposals
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/proposals` | Freelancer | Submit a proposal |
| `GET` | `/api/proposals/me` | Freelancer | Get my proposals |
| `GET` | `/api/proposals/project/:id` | Client | Get proposals for a project |
| `PUT` | `/api/proposals/:id/accept` | Client | Accept proposal (triggers auto-deny) |

### Messages
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/messages/conversations` | Private | Get all active conversations |
| `GET` | `/api/messages/:roomId` | Private | Get message history for a room |

### Socket.io Events
| Event | Direction | Payload | Description |
|---|---|---|---|
| `join_room` | Client → Server | `roomId: string` | Join a chat room |
| `send_message` | Client → Server | `{ sender, receiver, text, roomId, expiresInSeconds }` | Send & persist a message |
| `receive_message` | Server → Client | `Message object` | Receive a new message |
| `chat_history` | Server → Client | `Message[]` | Receive room history on join |

---

## 🔮 Future Roadmap

- [ ] **Stripe Payment Integration** — Fund projects directly from the Client Dashboard.
- [ ] **Freelancer Profile Pages** — Public profiles with skills, portfolio, and rating system.
- [ ] **Review & Rating System** — Clients rate freelancers after project completion.
- [ ] **Notification System** — Real-time bell notifications for new proposals and messages.
- [ ] **Admin Panel** — User management, project moderation, and analytics dashboard.
- [ ] **Search & Filters** — Advanced project search by budget range, category, and deadline.
- [ ] **File Attachments** — Upload files and images within the chat.
- [ ] **Mobile App** — React Native companion app.

---

## 📝 Internal Development Note

> **🔄 Auto-Update Rule:** This README must be updated whenever:
> - A new major feature is implemented (add to Core Features section).
> - A new npm dependency is installed (add to Tech Stack table).
> - A new API endpoint is added (add to API Reference table).
> - The project structure changes significantly (update the tree).
>
> Keep this document as the single source of truth for onboarding new developers and stakeholders.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <strong>Built with ❤️ using the MERN Stack</strong><br/>
  <sub>MongoDB · Express · React · Node.js · Socket.io · Framer Motion</sub>
</div>
