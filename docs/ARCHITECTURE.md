# 🏗️ Face Auth – System Architecture & Technical Report

> **Version:** 2.0 &nbsp;|&nbsp; **Last Updated:** February 2026 &nbsp;|&nbsp; **Status:** Production-Ready

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Backend Architecture](#5-backend-architecture)
6. [Face Recognition Engine](#6-face-recognition-engine)
7. [Database Design](#7-database-design)
8. [Authentication & Security](#8-authentication--security)
9. [Email & OTP System](#9-email--otp-system)
10. [API Reference](#10-api-reference)
11. [Project Structure](#11-project-structure)
12. [Environment Configuration](#12-environment-configuration)
13. [Deployment](#13-deployment)

---

## 1. Project Overview

**Face Auth** is a full-stack biometric authentication system that combines traditional password-based login with real-time facial recognition. It provides enterprise-grade security through multi-factor enrollment, OTP-based email verification, and duplicate-face detection to prevent a single person from registering multiple accounts.

### Key Features

| Feature | Description |
|---------|-------------|
| 🔐 Dual Authentication | Password + Face-based login |
| 📸 Multi-Angle Enrollment | 3 facial captures (center, left, right) for 512-d vector generation |
| 📧 OTP Email Verification | 6-digit code with HTML email templates and 10-minute expiry |
| 🔁 Forgot Password | OTP-verified password reset flow |
| 🔑 Dual Password Validation | Confirm-password recheck during registration |
| 🚫 Duplicate Face Prevention | Blocks registration if face already exists in database |
| 🧬 Adaptive Learning | Face embeddings improve with each login |
| 🧠 Liveness Detection | Eye-aspect-ratio + head-pose checks |

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                        │
│  React 18 + TypeScript + TailwindCSS + Framer Motion + Wouter  │
│  Webcam capture · Form validation · Toast notifications        │
└──────────────────────────┬──────────────────────────────────────┘
                           │  REST / JSON (CORS + Session Cookies)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                 BACKEND (Flask REST API)                        │
│  app.py – Routes, session auth, OTP logic, password hashing    │
├───────────────┬──────────────────┬──────────────────────────────┤
│  SQLite DB    │  Flask-Mail/SMTP │  Face Recognition Engine     │
│  users        │  OTP emails      │  face_recognition_engine.py  │
│  otp_codes    │  HTML templates  │  FaceNet + MTCNN + MediaPipe │
└───────────────┘──────────────────┴──────────────┬───────────────┘
                                                  │  gRPC / REST
                                                  ▼
                                    ┌──────────────────────┐
                                    │   Pinecone Vector DB │
                                    │   512-d embeddings   │
                                    │   Cosine similarity  │
                                    └──────────────────────┘
```

---

## 3. Technology Stack

### 3.1 Frontend

| Library | Version | Purpose |
|---------|---------|---------|
| **React** | 18.3.1 | UI framework |
| **TypeScript** | 5.6.3 | Type safety |
| **Vite** | 7.3.0 | Dev server & bundler |
| **TailwindCSS** | 3.4.17 | Utility-first CSS |
| **Framer Motion** | 11.18.2 | Animations & page transitions |
| **Wouter** | 3.3.5 | Lightweight client-side routing |
| **React Hook Form** | 7.55.0 | Form state management |
| **Zod** | 3.24.2 | Schema validation (shared with backend types) |
| **@tanstack/react-query** | 5.60.5 | Server state & caching |
| **react-webcam** | 7.2.0 | Camera access for face capture |
| **Radix UI** | Various | Accessible headless components |
| **Lucide React** | 0.453.0 | Icon set |
| **Drizzle ORM / Zod** | 0.39.3 / 0.7.0 | Shared type generation |

### 3.2 Backend

| Library | Version | Purpose |
|---------|---------|---------|
| **Flask** | 3.0.0 | REST API framework |
| **flask-cors** | 4.0.0 | Cross-origin resource sharing |
| **Flask-Mail** | 0.10.0 | SMTP email sending (OTP) |
| **Werkzeug** | (bundled) | Password hashing (PBKDF2-SHA256) |
| **python-dotenv** | 1.0.1 | Environment variable loading |
| **gunicorn** | 21.2.0 | Production WSGI server |

### 3.3 Face Recognition / AI

| Library | Version | Purpose |
|---------|---------|---------|
| **facenet-pytorch** | 2.6.0 | InceptionResNetV1 (VGGFace2) for 512-d embeddings |
| **PyTorch** | 2.2.2 | Deep learning framework |
| **TorchVision** | 0.17.2 | Image transforms |
| **MTCNN** | (facenet-pytorch) | Face detection & alignment |
| **MediaPipe** | 0.10.14 | 468-point face mesh, liveness, nodal ratios |
| **OpenCV** | 4.10.0.84 | Image processing, PnP head-pose estimation |
| **NumPy** | 1.24.3 | Numerical operations |
| **Pillow** | 10.2.0 | Image decoding |

### 3.4 Databases

| Database | Type | Purpose |
|----------|------|---------|
| **SQLite** | Relational (file-based) | Users table, OTP codes, passwords |
| **Pinecone** | Vector (cloud-managed) | 512-d face embeddings, cosine similarity search |

---

## 4. Frontend Architecture

### 4.1 Page Structure

```
App.tsx (Router)
├── Landing.tsx          →  /                 – Marketing / hero page
├── Login.tsx            →  /login            – Password + Biometric login
├── Register.tsx         →  /register         – Multi-step enrollment
├── FaceLogin.tsx        →  /face-login       – Standalone face login
├── ForgotPassword.tsx   →  /forgot-password  – OTP-based password reset
├── Dashboard.tsx        →  /dashboard        – Authenticated user home
└── not-found.tsx        →  *                 – 404 page
```

### 4.2 Registration Flow (7 Steps)

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Step 0  │───▷│  Step 1  │───▷│  Step 2  │───▷│  Step 3  │
│  INFO    │    │  EMAIL   │    │  OTP     │    │  CENTER  │
│  Welcome │    │  Enter   │    │  Verify  │    │  Face    │
│  screen  │    │  email   │    │  6-digit │    │  capture │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                      │
┌──────────┐    ┌──────────┐    ┌──────────┐          │
│  Step 6  │◁───│  Step 5  │◁───│  Step 4  │◁─────────┘
│  FORM    │    │  RIGHT   │    │  LEFT    │
│  User +  │    │  Face    │    │  Face    │
│  2× Pass │    │  capture │    │  capture │
└──────────┘    └──────────┘    └──────────┘
```

### 4.3 Forgot Password Flow (3 Steps)

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Step 0     │───▷│   Step 1     │───▷│   Step 2     │
│   EMAIL      │    │   OTP        │    │   NEW PASS   │
│   Enter      │    │   Verify     │    │   Password + │
│   email addr │    │   6-digit    │    │   Confirm    │
└──────────────┘    └──────────────┘    └──────────────┘
```

### 4.4 Custom Components

| Component | Description |
|-----------|-------------|
| `CyberButton` | Styled button with loading state |
| `CyberCard` | Container card with shadow styling |
| `CyberInput` | Form input with label and error display |
| `ScannerOverlay` | Animated overlay for camera feed |

### 4.5 React Query Hooks (`use-auth.ts`)

| Hook | Purpose |
|------|---------|
| `useUser()` | Fetch current authenticated user |
| `useLogin()` | Username/password login |
| `useFaceLogin()` | Face-based authentication |
| `useRegister()` | Full registration with face + email |
| `useSendOtp()` | Send OTP to email |
| `useVerifyOtp()` | Verify OTP code |
| `useForgotPassword()` | Send password-reset OTP |
| `useResetPassword()` | Set new password after OTP |
| `useLogout()` | Clear session and redirect |

---

## 5. Backend Architecture

### 5.1 Application Configuration

| Setting | Value |
|---------|-------|
| Framework | Flask 3.0 |
| Session | Server-side (cookie-based with `SESSION_COOKIE_HTTPONLY`) |
| CORS | Credentials supported, configurable origins |
| Password Hashing | Werkzeug `generate_password_hash` / `check_password_hash` (PBKDF2) |
| Mail | Flask-Mail with TLS via SMTP |

### 5.2 Middleware & Security

- **CORS** – Configured per environment (dev: `localhost:5173`, prod: custom origin)
- **Session Cookies** – `HttpOnly`, `Secure` (prod), `SameSite=Lax` (dev) / `None` (prod)
- **Password Hashing** – PBKDF2-SHA256 via Werkzeug
- **OTP Expiry** – 10-minute window, single-use tokens
- **Duplicate Face Detection** – Cosine similarity check against Pinecone before registration

---

## 6. Face Recognition Engine

### 6.1 Pipeline Overview

```
 Base64 Image
      │
      ▼
 ┌─────────────────┐
 │  Decode (Pillow) │
 └────────┬────────┘
          │
    ┌─────┴──────┐
    ▼            ▼
┌────────┐  ┌──────────────┐
│ MTCNN  │  │  MediaPipe    │
│ Detect │  │  Face Mesh    │
│ + Align│  │  (468 points) │
└───┬────┘  └──────┬───────┘
    │              │
    ▼              ▼
┌────────────┐  ┌───────────────────────┐
│ FaceNet    │  │ Liveness Check        │
│ Inception  │  │  • Eye Aspect Ratio   │
│ ResNetV1   │  │  • Head Pose (PnP)    │
│ → 512-d    │  │ Nodal Ratio           │
│   vector   │  │  • Eye dist / Nose w  │
└─────┬──────┘  └───────────────────────┘
      │
      ▼
┌──────────────────┐
│   Pinecone       │
│   Upsert / Query │
│   Cosine Sim     │
└──────────────────┘
```

### 6.2 Key Methods

| Method | Description |
|--------|-------------|
| `decode_base64_image()` | Converts base64 string → NumPy RGB array |
| `detect_face()` | Quick face-presence check via MediaPipe |
| `get_embedding()` | MTCNN alignment → InceptionResNetV1 → L2-normalized 512-d vector |
| `liveness_check()` | Eye aspect ratio (>0.18) + head pose within ±15° yaw/pitch |
| `nodal_ratio()` | Inter-eye distance / nose width for structural consistency |
| `register_user()` | Multi-image enrollment → averaged master embedding → Pinecone upsert |
| `check_face_exists()` | Duplicate face detection – queries Pinecone before registration |
| `verify_user()` | Single-image verification → Pinecone top-5 query → score threshold |
| `adaptive_update()` | Blends new embedding into stored vector (learning rate: 0.05) |

### 6.3 Thresholds & Tuning

| Parameter | Default | Description |
|-----------|---------|-------------|
| `min_score` | 0.35 | Minimum cosine similarity for match |
| `ratio_threshold` | 0.18 | Max deviation in nodal ratio |
| `adaptive_lr` | 0.05 | Learning rate for embedding updates |
| `yaw_threshold` | 15.0° | Max head yaw for liveness |
| `pitch_threshold` | 15.0° | Max head pitch for liveness |

---

## 7. Database Design

### 7.1 SQLite – `users.db`

#### `users` Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique user ID |
| `username` | TEXT | UNIQUE, NOT NULL | Login username |
| `email` | TEXT | UNIQUE, NOT NULL | Verified email address |
| `password` | TEXT | NOT NULL | PBKDF2-hashed password |
| `face_embedding` | TEXT | NULLABLE | JSON-serialized 512-d vector |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Registration timestamp |

#### `otp_codes` Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | OTP record ID |
| `email` | TEXT | NOT NULL | Target email address |
| `otp` | TEXT | NOT NULL | 6-digit numeric code |
| `purpose` | TEXT | NOT NULL, DEFAULT 'register' | `register` or `forgot_password` |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When OTP was generated |
| `expires_at` | TIMESTAMP | NOT NULL | Expiry time (created_at + 10 min) |
| `used` | INTEGER | DEFAULT 0 | 0 = unused, 1 = consumed |

### 7.2 Pinecone – Vector Database

| Property | Value |
|----------|-------|
| Index Name | `face-recognisation` |
| Dimension | 512 |
| Metric | Cosine Similarity |
| Pod Type | p1.x1 (GCP us-west1) |

#### Vector Metadata Schema

```json
{
  "user_id": "string",
  "nodal_ratio": "float",
  "samples": "int",
  "created_at": "ISO timestamp",
  "updated_at": "ISO timestamp"
}
```

---

## 8. Authentication & Security

### 8.1 Authentication Methods

| Method | Flow |
|--------|------|
| **Password Login** | Username + Password → hash compare → session cookie |
| **Face Login** | Webcam capture → 512-d embedding → Pinecone cosine query → threshold check |
| **Registration** | Email OTP → Face enrollment (3 angles) → Username + Password (with confirm) |

### 8.2 Security Measures

| Measure | Implementation |
|---------|----------------|
| Password Storage | PBKDF2-SHA256 (Werkzeug) |
| Session Management | Server-side Flask sessions with HttpOnly cookies |
| OTP Security | 6-digit random, 10-min expiry, single-use, stored server-side |
| Email Verification | Required before registration completes |
| Duplicate Prevention | Face similarity check blocks same person re-registering |
| CORS | Whitelist-based origin control |
| Cookie Security | `Secure` flag in production, `SameSite` policy |

### 8.3 Registration Security Flow

```
1. User enters email
2. Server verifies email not already registered
3. OTP (6-digit) generated → stored in DB with 10-min expiry → sent via SMTP
4. User submits OTP → server validates against DB
5. User captures 3 face images (center, left, right)
6. Server checks if face already exists in Pinecone (duplicate prevention)
7. If unique → user enters username + password + confirmPassword
8. Passwords validated (match + min 6 chars)
9. Face embeddings generated, averaged, and upserted to Pinecone
10. User record created in SQLite with hashed password
11. Auto-login via session cookie
```

---

## 9. Email & OTP System

### 9.1 SMTP Configuration

| Setting | Value |
|---------|-------|
| Server | smtp.gmail.com |
| Port | 587 (TLS) |
| Authentication | Gmail App Password |
| Template | Responsive HTML with inline CSS |

### 9.2 Email Template Features

- **Branded Header** – Gradient blue header with Face Auth branding
- **Clear OTP Display** – Large monospace font, letter-spaced digits
- **Timer Warning** – 10-minute expiry indicator
- **Security Notice** – Warning against sharing verification codes
- **Responsive Design** – Works across email clients
- **Purpose-Aware** – Different titles/messages for registration vs password reset

### 9.3 OTP Lifecycle

```
Generate (6 random digits)
    │
    ▼
Store in DB (email, otp, purpose, expires_at, used=0)
    │
    ▼
Send via SMTP (HTML email template)
    │
    ▼
User submits OTP
    │
    ▼
Validate (match email + otp + purpose + not expired + not used)
    │
    ▼
Mark as used (used=1) → Return verified: true
```

---

## 10. API Reference

### 10.1 Health & Status

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API status |
| GET | `/health` | Health check |

### 10.2 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register with face + email + password |
| POST | `/api/auth/login` | Username + password login |
| POST | `/api/auth/face-login` | Face-based login |
| POST | `/api/auth/logout` | Clear session |
| POST | `/api/auth/send-otp` | Send OTP to email |
| POST | `/api/auth/verify-otp` | Verify OTP code |
| POST | `/api/auth/forgot-password` | Send password-reset OTP |
| POST | `/api/auth/reset-password` | Set new password |
| POST | `/api/auth/reset-face` | Re-enroll face data |

### 10.3 User

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/me` | Get current authenticated user |

### 10.4 Face Detection

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/detect_face` | Quick face-presence check |

### 10.5 Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Registered user count (from Pinecone) |
| GET | `/admin/users` | List users with face metadata |
| GET | `/admin/users/:id/embeddings` | Raw embedding data |
| DELETE | `/admin/users/:id/face` | Delete user face data |

### 10.6 Key Request/Response Schemas

**Register** – `POST /api/auth/register`
```json
{
  "username": "string",
  "email": "string (verified via OTP)",
  "password": "string (min 6)",
  "confirmPassword": "string (must match)",
  "images": ["base64...", "base64...", "base64..."]
}
```

**Send OTP** – `POST /api/auth/send-otp`
```json
{
  "email": "user@example.com",
  "purpose": "register | forgot_password"
}
```

**Verify OTP** – `POST /api/auth/verify-otp`
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "purpose": "register | forgot_password"
}
```

**Reset Password** – `POST /api/auth/reset-password`
```json
{
  "email": "user@example.com",
  "password": "newPassword",
  "confirmPassword": "newPassword"
}
```

---

## 11. Project Structure

```
Face Auth/
│
├── app.py                          # Flask backend – all routes & OTP logic
├── face_recognition_engine.py      # FaceRecognition class – AI pipeline
├── requirements.txt                # Python dependencies
├── .env                            # Environment variables (secrets)
├── users.db                        # SQLite database (auto-created)
├── Procfile                        # Gunicorn deployment config
├── render.yaml                     # Render.com deployment config
├── runtime.txt                     # Python runtime version
│
├── shared/                         # Shared types (used by both FE & BE)
│   ├── schema.ts                   # Zod schemas & DB types
│   └── routes.ts                   # API endpoint definitions & types
│
├── client/                         # Frontend (React + TypeScript)
│   ├── index.html                  # Entry HTML
│   └── src/
│       ├── App.tsx                 # Router & providers
│       ├── main.tsx                # React DOM entry
│       ├── index.css               # Global styles
│       │
│       ├── pages/
│       │   ├── Landing.tsx         # Hero / marketing page
│       │   ├── Login.tsx           # Password + Face login
│       │   ├── Register.tsx        # 7-step enrollment
│       │   ├── FaceLogin.tsx       # Standalone face login
│       │   ├── ForgotPassword.tsx  # 3-step password reset
│       │   ├── Dashboard.tsx       # Authenticated home
│       │   └── not-found.tsx       # 404 page
│       │
│       ├── components/
│       │   ├── CyberButton.tsx     # Styled button
│       │   ├── CyberCard.tsx       # Container card
│       │   ├── CyberInput.tsx      # Form input
│       │   ├── ScannerOverlay.tsx  # Camera overlay
│       │   └── ui/                 # 40+ Radix/shadcn components
│       │
│       ├── hooks/
│       │   ├── use-auth.ts         # Auth mutations & queries
│       │   ├── use-toast.ts        # Toast notifications
│       │   └── use-mobile.tsx      # Responsive hook
│       │
│       └── lib/
│           ├── api.ts              # API URL helper
│           ├── queryClient.ts      # React Query client
│           └── utils.ts            # Utility functions (cn, etc.)
│
├── package.json                    # Node.js dependencies
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Vite bundler config
├── tailwind.config.ts              # Tailwind CSS config
└── postcss.config.js               # PostCSS config
```

---

## 12. Environment Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `PINECONE_API_KEY` | Pinecone vector DB API key | `pcsk_...` |
| `PINECONE_INDEX` | Index name | `face-recognisation` |
| `PINECONE_HOST` | Direct index host URL | `https://...pinecone.io` |
| `PINECONE_DIMENSION` | Embedding dimension | `512` |
| `PINECONE_METRIC` | Similarity metric | `cosine` |
| `FLASK_ENV` | Flask environment | `development` / `production` |
| `FLASK_PORT` | Server port | `5000` |
| `SECRET_KEY` | Flask session secret | Random string |
| `FACE_MIN_SCORE` | Minimum cosine similarity | `0.35` |
| `FACE_RATIO_THRESHOLD` | Nodal ratio tolerance | `0.18` |
| `FACE_ADAPTIVE_LR` | Adaptive update rate | `0.05` |
| `FACE_DEVICE` | PyTorch device | `cpu` / `cuda` |
| `MAIL_SERVER` | SMTP server | `smtp.gmail.com` |
| `MAIL_PORT` | SMTP port | `587` |
| `MAIL_USE_TLS` | Enable TLS | `true` |
| `MAIL_USERNAME` | SMTP username | `you@gmail.com` |
| `MAIL_PASSWORD` | SMTP app password | App password |
| `MAIL_DEFAULT_SENDER` | From address | `you@gmail.com` |

---

## 13. Deployment

### 13.1 Local Development

```bash
# Backend
python -m venv venv
source venv/bin/activate          # or .\venv\Scripts\Activate.ps1 (Windows)
pip install -r requirements.txt
python app.py                     # Runs on :5000

# Frontend
npm install
npm run dev                       # Runs on :5173
```

### 13.2 Production (Render / Gunicorn)

```bash
# Procfile
web: gunicorn app:app --bind 0.0.0.0:$PORT

# Frontend built via Vite
npm run build                     # Outputs to dist/
```

### 13.3 Infrastructure Summary

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│   Vercel /   │     │   Render /   │     │   Pinecone    │
│   Static CDN │     │   Gunicorn   │     │   Cloud       │
│   (Frontend) │────▷│   (Backend)  │────▷│   (Vectors)   │
└─────────────┘     └──────┬───────┘     └───────────────┘
                           │
                    ┌──────┴───────┐
                    │   Gmail SMTP │
                    │   (OTP Mail) │
                    └──────────────┘
```

---

> **Built with** Python · Flask · React · TypeScript · PyTorch · FaceNet · Pinecone · TailwindCSS
