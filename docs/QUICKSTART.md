# ⚡ Quick Start Guide

## 30-Second Setup

### 1. Database (Terminal 1)
```powershell
# Start MySQL and create database
mysql -u root -p
# Then paste:
CREATE DATABASE face_auth_db;
USE face_auth_db;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_identifier VARCHAR(255) UNIQUE NOT NULL,
    face_encoding TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
exit;
```

### 2. Backend (Terminal 2)
```powershell
# Install Python packages
pip install -r requirements.txt

# Start Flask server
python app.py
```
✓ Backend running at http://localhost:5000

### 3. Frontend (Terminal 3)
```powershell
# Install Node packages
npm install

# Start React app
npm run dev
```
✓ Frontend running at http://localhost:3000

## 🎮 How to Use

### Register a User
1. Click **REGISTRATION** button
2. Enter User ID: `JOHN_DOE`
3. Click **CAPTURE & SAVE**
4. ✓ Success!

### Verify Face
1. Click **VERIFICATION** button
2. Face the camera
3. Watch the blue scanning laser
4. ✓ Green = Match found!

## 🔧 Common Issues

**"No module named 'dlib'"**
```powershell
# Install Visual C++ Build Tools first
# https://visualstudio.microsoft.com/visual-cpp-build-tools/
pip install cmake
pip install dlib
```

**"Can't connect to MySQL"**
- Check MySQL is running: `mysql -u root -p`
- Update credentials in `app.py` if needed

**"Camera not working"**
- Allow camera permissions in browser
- Close other apps using the camera

## 📊 Database Check

```sql
-- View all registered users
USE face_auth_db;
SELECT id, user_identifier, created_at FROM users;

-- Count users
SELECT COUNT(*) FROM users;
```

## 🚀 Production Deployment

1. Update MySQL credentials in `app.py`
2. Set `app.run(debug=False)`
3. Use environment variables for secrets
4. Deploy backend to a cloud server
5. Build frontend: `npm run build`
6. Serve the `dist/` folder

---

**Need help?** Check the full [README.md](README.md) for detailed documentation.
