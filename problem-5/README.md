# 99Tech Team Challenge - Problem 5

> [!IMPORTANT]
> This project is a **sample proof-of-concept** and may not contain all features required for a comprehensive football club management system.
>
> **Development Credits:**
> - **Backend**: 80% manually built, 20% "vibe coded" (AI-assisted).
> - **Frontend**: 100% "vibe coded" (Entirely AI-generated based on high-level vibes and requirements).

This project consists of a sample of football club management system with a Node.js (Express/Mongoose) backend and a React (Vite) frontend.

## Prerequisites

- Node.js (v24+)
- Yarn
- MongoDB (Local or Atlas)

---

## Backend Setup

Navigate to the `backend` directory:

```bash
cd problem-5/backend
```

### 1. Install Dependencies

```bash
yarn
```

### 2. Environment Variables

Copy the `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Ensure `MONGO_URI` is correctly pointing to your MongoDB instance.

### 3. Initialize Data

> [!NOTE]
> If you are using the provided `MONGO_URI` (from the .env.example), the data is already initialized and you can skip this step.

Run the following scripts to seed the database with initial users, nations, coaches, and clubs if using a fresh database:

```bash
# Create initial admin and user
npx tsx src/scripts/initUser.ts

# Create 20 mock clubs with coaches and players
npx tsx src/scripts/initClub.ts
```

### 4. Run Development Server

```bash
yarn dev
```

The backend will be running at `http://localhost:8888`.

---

## Frontend Setup

Navigate to the `app` directory:

```bash
cd problem-5/app
```

### 1. Install Dependencies

```bash
yarn
```

### 2. Run Development Server

```bash
yarn dev
```

The frontend will be running at `http://localhost:5173`.

---

## Default Credentials

You can use the following account to log in:

- **Username**: `99techteam`
- **Password**: `Asdfgh1@3`

## Features

- **Authentication**: JWT-based login.
- **Dashboard**: View list of football clubs with search and filtering by nationality.
- **CRUD Operations**: Create, Read, Update, and Delete clubs.
- **Relationship Management**: Automatic synchronization between Clubs and Coaches.
- **Premium UI**: Modern design with Glassmorphism, Skeleton loaders, and smooth animations using Framer Motion.
