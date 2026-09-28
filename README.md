# URL Shortener App

A full-stack URL shortener built with React, Express, and MongoDB.

This project allows users to shorten links, optionally set custom aliases and expiration dates, and view basic analytics for their links.

## Features

- Shorten long URLs into cleaner links
- Optional custom aliases
- Optional expiration dates
- User authentication with JWT
- Click tracking and basic analytics
- QR code generation

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB
- Cache: Redis

## Local Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create `.env` files in the backend as needed for:

- `MONGODB_URI`
- `JWT_SECRET`
- `PORT`
- `FRONTEND_URL`
- `BASE_URL`

## Notes

This application is designed to be a standalone project and can be adapted for your own deployment and branding.

## Deployment

The frontend is deployed on Vercel:

- https://linkflow-url-shortener.vercel.app

The backend is deployed on Render:

- https://linkflow-url-shortener.onrender.com
- Health check: https://linkflow-url-shortener.onrender.com/api/health

### Vercel

Deploy the `frontend` directory with:

```bash
npm run build
```

Use `dist` as the output directory.

### Render

Deploy the `backend` directory as a Node.js Web Service with:

```bash
Build Command: npm install
Start Command: npm start
```

Configure these environment variables on Render:

```text
NODE_ENV=production
MONGODB_URI=your MongoDB connection string
JWT_SECRET=your secure secret
FRONTEND_URL=https://linkflow-url-shortener.vercel.app
BASE_URL=https://linkflow-url-shortener.onrender.com
```
