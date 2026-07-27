# Freelance Marketplace

A full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js) that connects Clients and Freelancers. 

Clients can post jobs, review proposals, accept them, and securely fund projects. Freelancers can browse open jobs, submit proposals, and chat in real-time with clients once accepted.

## Features

- **Role-Based Authentication**: Secure JWT-based login/signup for two distinct roles: `Client` and `Freelancer`.
- **Client Dashboard**: View posted jobs, review incoming proposals, accept bids, and simulate project funding via a Mock Stripe checkout.
- **Freelancer Dashboard**: Browse a live feed of open jobs, submit tailored proposals with bid amounts, and track application status.
- **Real-Time Chat**: Live, bi-directional 1-on-1 messaging between Clients and Freelancers using `Socket.io` inside private, project-specific rooms.
- **Modern UI**: A premium, responsive interface featuring dark modes, glassmorphism, dynamic blob animations, and modern gradients powered by Tailwind CSS v4.

## Tech Stack

### Frontend (`client/`)
- **Framework**: React 19 (via Vite)
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **State Management**: Zustand
- **Real-Time**: Socket.io-client
- **HTTP Client**: Axios

### Backend (`server/`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Real-Time**: Socket.io

## Project Structure

```text
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar)
│   │   ├── pages/          # Full page views (Dashboards, Auth, Chat, Payment)
│   │   ├── store/          # Zustand global state (AuthStore)
│   │   ├── utils/          # Axios interceptors and utilities
│   │   ├── App.jsx         # Routing configuration
│   │   └── index.css       # Global styles and Tailwind imports
│   └── vite.config.js      # Vite configuration
│
└── server/                 # Node.js backend application
    ├── middleware/         # Custom Express middleware (Auth protection)
    ├── models/             # Mongoose schemas (User, Project, Proposal, Message, Review)
    ├── routes/             # RESTful API routes
    ├── .env                # Environment variables
    └── server.js           # Server entry point & Socket.io initialization
```

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites
- Node.js installed on your machine
- MongoDB installed locally (or a MongoDB Atlas URI)

### 1. Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure your `.env` file is configured correctly (it is already set up to use local MongoDB):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/freelance-marketplace
   JWT_SECRET=supersecretjwtkeythatshouldbechangedinproduction
   ```
4. Start the server:
   ```bash
   node server.js
   ```
   *The server will start on `http://localhost:5000`.*

### 2. Frontend Setup
1. Open a new terminal window and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and go to `http://localhost:5173`.

## Usage Guide
1. **Register** a new account and select the **Client** role.
2. In an incognito window, **Register** another account and select the **Freelancer** role.
3. As the **Client**, click **+ Post New Job** and fill out the details.
4. As the **Freelancer**, find the job in your dashboard and click **Submit Proposal**. Enter a cover letter and a bid.
5. As the **Client**, view the job's proposals and click **Accept Proposal**.
6. Both users can now jump into the **Chat** to discuss the project in real-time.
7. As the **Client**, click **Fund Project** to test the mock Stripe payment integration.
