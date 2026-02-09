# Property Rental Marketplace

A full-stack property rental marketplace application built with Next.js (Frontend) and Node.js/Express (Backend).

## 🚀 Project Overview

This platform allows landlords to list properties and tenants to browse/apply for leases. It includes features like property filtering, lease management, and cloud-based image storage.

## 🛠 Tech Stack

- **Frontend:** Next.js, Tailwind CSS, Shadcn UI, React Query
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Storage:** Cloudinary (for property images)
- **Authentication:** JWT (JSON Web Tokens)
- **Email:** SMTP/Gmail for notifications

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (Atlas or local instance)
- Cloudinary Account (for image uploads)
- Gmail account for SMTP (if using email features)

## ⚙️ Project Structure

```text
/
├── backend/        # Node.js/Express API
├── frontend/       # Next.js Application
└── README.md       # Project Documentation
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd fullstack
```

### 2. Backend Setup

```bash
cd backend
npm install
```

- Copy `.env.example` to `.env` and fill in your credentials.
- Start the server:

```bash
npm start # or npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

- Copy `.env.example` to `.env.local` and configure the API URL.
- Start the development server:

```bash
npm run dev
```

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable            | Description                 | Default |
| ------------------- | --------------------------- | ------- |
| `PORT`              | Server port                 | `5000`  |
| `MONGO_URI`         | MongoDB Connection String   | -       |
| `CLOUDINARY_URL`    | Cloudinary Full URL         | -       |
| `JWT_ACCESS_SECRET` | Secret key for Access Token | -       |
| `SMTP_USER`         | Email for SMTP              | -       |

### Frontend (`frontend/.env.local`)

| Variable              | Description          | Default                     |
| --------------------- | -------------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API Endpoint | `http://localhost:5000/api` |

## 📜 Available Scripts

### Backend

- `npm start`: Runs the server.
- `npm run dev`: Runs the server with nodemon.

### Frontend

- `npm run dev`: Runs the Next.js dev server.
- `npm run build`: Creates a production build.
- `npm start`: Starts the production build.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements.
