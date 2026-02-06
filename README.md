# Hiring and Assessment Platform

A comprehensive hiring and assessment portal with biometric face recognition authentication.

## Project Structure

```
├── backend/           # Flask Python backend
│   ├── app.py                    # Main Flask application
│   ├── face_recognition_engine.py # Face recognition logic
│   ├── requirements.txt          # Python dependencies
│   └── ...
├── frontend/          # React TypeScript frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── dashboards/       # Role-based dashboards
│   │   │   │   ├── CandidateDashboard.tsx
│   │   │   │   ├── CompanyHRDashboard.tsx
│   │   │   │   └── CompanyAdminDashboard.tsx
│   │   │   ├── Register.tsx      # User registration with role selection
│   │   │   ├── FaceLogin.tsx     # Face recognition login
│   │   │   └── ...
│   │   └── ...
│   ├── shared/                   # Shared types and routes
│   └── package.json
├── database/          # Database schemas and migrations
│   └── schema.sql
├── docs/              # Documentation
│   ├── README.md
│   ├── ARCHITECTURE.md
│   └── ...
└── ...
```

## User Roles

The platform supports three user roles:

1. **Candidate** - Job seeker looking for opportunities
   - Dashboard: `/dashboard/candidate`
   
2. **Company Admin** - Manages company and HR access
   - Dashboard: `/dashboard/admin`
   
3. **Company HR** - Manages hiring on behalf of company
   - Dashboard: `/dashboard/hr`

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Quick Start (Windows)

```powershell
# Start backend
.\start-backend.ps1

# Start frontend (in another terminal)
.\start-frontend.ps1
```

## Features

- **Biometric Face Recognition** - Secure login using face recognition
- **Role-Based Access** - Different dashboards for Candidates, Company Admins, and Company HR
- **Email Verification** - OTP-based email verification during registration
- **Multi-Angle Face Capture** - Enhanced security with 3-angle face capture during registration

## API Endpoints

- `POST /api/auth/register` - Register new user with role and face data
- `POST /api/auth/login` - Traditional login
- `POST /api/auth/face-login` - Face recognition login
- `GET /api/user/me` - Get current user
- `POST /api/auth/logout` - Logout

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Vite
- **Backend**: Flask, Python
- **Database**: SQLite (development), MySQL/PostgreSQL (production)
- **Face Recognition**: Custom face recognition engine with Pinecone vector storage
