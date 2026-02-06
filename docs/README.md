# 🛡️ Face Auth – Biometric Authentication System

A full-stack facial recognition authentication platform with OTP-based email verification, dual-password confirmation, and duplicate-face prevention. Built with **React**, **Flask**, **FaceNet (PyTorch)**, and **Pinecone** vector database.

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)
![Flask](https://img.shields.io/badge/Flask-3.0-000?logo=flask)
![PyTorch](https://img.shields.io/badge/PyTorch-2.2-EE4C2C?logo=pytorch)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)

---

## ✨ Features

- **🔐 Dual Authentication** – Login via password or real-time face scan
- **📸 Multi-Angle Face Enrollment** – 3 captures (center, left, right) for robust 512-d vector generation
- **📧 OTP Email Verification** – Beautiful HTML email templates, 6-digit code, 10-minute expiry
- **🔁 Forgot Password** – OTP-verified password reset flow
- **🔑 Confirm Password** – Dual password entry during registration
- **🚫 Duplicate Face Prevention** – Same person cannot register twice with a different email
- **🧬 Adaptive Learning** – Face embeddings improve with every login
- **🧠 Liveness Detection** – Eye-aspect-ratio + head-pose analysis

---

## 🏗️ Architecture

```
React + TypeScript (Vite)
        │
        │  REST / JSON + Session Cookies
        ▼
   Flask REST API
   ├── SQLite (users, OTP codes)
   ├── Flask-Mail / SMTP (OTP emails)
   └── Face Recognition Engine
        ├── MTCNN (face detection)
        ├── InceptionResNetV1 (512-d embeddings)
        ├── MediaPipe (liveness + landmarks)
        └── Pinecone (vector similarity search)
```

> Full technical documentation → [ARCHITECTURE.md](ARCHITECTURE.md)

---

## 📋 Prerequisites

- **Python 3.10+** with pip
- **Node.js 18+** with npm
- **Webcam** for face capture
- **Pinecone** account ([free tier](https://www.pinecone.io/))
- **Gmail** account with [App Password](https://myaccount.google.com/apppasswords) for SMTP

---

## 🚀 Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/your-username/face-auth.git
cd face-auth
```

### 2. Backend setup

```bash
# Create & activate virtual environment
python -m venv venv

# Windows
.\venv\Scripts\Activate.ps1

# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure environment

```bash
# Copy template and fill in your values
cp .env.example .env
```

Edit `.env` with your credentials:

| Variable | Where to get it |
|----------|----------------|
| `PINECONE_API_KEY` | [Pinecone Console](https://app.pinecone.io/) |
| `PINECONE_HOST` | Pinecone index dashboard |
| `MAIL_USERNAME` | Your Gmail address |
| `MAIL_PASSWORD` | [Gmail App Password](https://myaccount.google.com/apppasswords) |

### 4. Start the backend

```bash
python app.py
# Server runs on http://localhost:5000
```

### 5. Frontend setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 📖 User Flows

### Registration (7 steps)

```
Info → Enter Email → Verify OTP → Face (center) → Face (left) → Face (right) → Username + Password + Confirm
```

### Login

- **Password** – Username + password
- **Biometric** – Single webcam scan matched against stored embeddings

### Forgot Password (3 steps)

```
Enter Email → Verify OTP → New Password + Confirm
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register with face + email + password |
| `POST` | `/api/auth/login` | Username/password login |
| `POST` | `/api/auth/face-login` | Face-based login |
| `POST` | `/api/auth/send-otp` | Send OTP to email |
| `POST` | `/api/auth/verify-otp` | Verify OTP code |
| `POST` | `/api/auth/forgot-password` | Send password-reset OTP |
| `POST` | `/api/auth/reset-password` | Set new password |
| `POST` | `/api/auth/logout` | Clear session |
| `GET`  | `/api/user/me` | Get current user |
| `POST` | `/api/auth/reset-face` | Re-enroll face data |

---

## 🗂️ Project Structure

```
├── app.py                       # Flask backend (routes, OTP, auth)
├── face_recognition_engine.py   # Face AI pipeline (FaceNet + MTCNN + MediaPipe)
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── ARCHITECTURE.md              # Full technical documentation
│
├── shared/                      # Shared types (frontend ↔ backend)
│   ├── schema.ts                # Zod schemas & DB types
│   └── routes.ts                # API definitions
│
├── client/                      # React frontend
│   └── src/
│       ├── App.tsx              # Router
│       ├── pages/               # 7 pages (Landing, Login, Register, etc.)
│       ├── components/          # CyberButton, CyberCard, ScannerOverlay, 40+ UI
│       ├── hooks/               # useAuth, useToast, useMobile
│       └── lib/                 # API helpers, query client
│
├── package.json                 # Node dependencies
├── vite.config.ts               # Vite config
├── tailwind.config.ts           # Tailwind config
└── tsconfig.json                # TypeScript config
```

---

## 🔧 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS, Framer Motion, Wouter, React Query, Radix UI |
| **Backend** | Python, Flask, Flask-Mail, Werkzeug (PBKDF2 hashing) |
| **AI / ML** | PyTorch, FaceNet (InceptionResNetV1), MTCNN, MediaPipe, OpenCV |
| **Databases** | SQLite (users + OTP), Pinecone (512-d face vectors, cosine similarity) |
| **Email** | Gmail SMTP with HTML templates |

---

## 🔒 Security

- Passwords hashed with **PBKDF2-SHA256**
- OTPs are **single-use**, **6-digit**, and expire in **10 minutes**
- Email **must be verified** before registration completes
- **Duplicate face detection** prevents one person from creating multiple accounts
- Session cookies are `HttpOnly` and `Secure` (production)
- Face embeddings are **irreversible** – cannot reconstruct the original face

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| Camera not working | Grant browser camera permission; use HTTPS in production |
| OTP email not arriving | Verify SMTP credentials in `.env`; check spam folder; ensure Gmail App Password (not regular password) |
| `dlib` / `mediapipe` install error | Install Visual C++ Build Tools (Windows) or `build-essential` (Linux) |
| Face not detected | Ensure good lighting; face centered and clearly visible |
| Pinecone connection error | Check `PINECONE_API_KEY` and `PINECONE_HOST` in `.env` |

---

## 📄 License

This project is provided as-is for educational and demonstration purposes.

---

**Built with ❤️ using React · Flask · PyTorch · FaceNet · Pinecone**
