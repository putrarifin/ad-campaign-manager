# Ad Campaign Manager 🧠📣

A simple full-stack web application to manage advertising campaigns with AI-generated ad copy.

Dibuat untuk belajar dan sebagai portfolio yang relevan dengan posisi **Web Developer** (Aptana Citra Solusindo) dengan fokus:

- CRUD aplikasi web (frontend + backend)
- REST API
- Database relational (PostgreSQL)
- Integrasi AI API (OpenAI)
- Docker (backend, frontend, database)
- Basic UI/UX & web optimization

---

## ✨ Features

- ✅ CRUD Campaign:
  - Title
  - Client name
  - Budget
  - Channel (Facebook, Instagram, Google Ads, etc.)
  - Start & end date
  - Status (draft, active, paused, ended)
  - Ad copy (manual atau generate dari AI)
- ✅ AI-powered Ad Copy:
  - Input: product name, audience, tone
  - Output: ad copy dalam bahasa Indonesia
- ✅ Full-stack:
  - React + Vite frontend
  - Node.js + Express backend
  - PostgreSQL database
- ✅ Docker Compose:
  - `db` (Postgres)
  - `backend` (API)
  - `frontend` (React dev server)
- ✅ Authentication:
  - Login berbasis JWT, proteksi API & UI dashboard
  - Akun default: `admin@example.com` / `password123`

---

## 🏗 Tech Stack

**Frontend**
- React (Vite)
- React Router
- Axios

**Backend**
- Node.js
- Express
- pg (PostgreSQL client)
- dotenv
- bcryptjs & jsonwebtoken (auth)

**Database**
- PostgreSQL
- SQL init script (`db/init.sql`)

**AI Integration**
- OpenAI Chat Completions API (via backend service)

**DevOps**
- Docker & Docker Compose

---

## 📁 Project Structure

```txt
ad-campaign-manager/
  backend/
    src/
      index.js
      db/
        connection.js
      routes/
        campaigns.js
        auth.js
      controllers/
        campaignController.js
        authController.js
      middleware/
        auth.js
      services/
        aiService.js
    Dockerfile
    .env.example
    package.json

  db/
    init.sql

  frontend/
    src/
      main.jsx
      App.jsx
      api.js
      context/
        AuthContext.jsx
      pages/
        CampaignList.jsx
        CampaignForm.jsx
        LoginPage.jsx
      components/
        (optional)
      index.css
    Dockerfile
    package.json

  docker-compose.yml
  README.md
