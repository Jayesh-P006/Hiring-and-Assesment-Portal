-- Hiring and Assessment Platform Database Schema
-- This script creates the database and users table for storing user data and face encodings

-- Create the database
CREATE DATABASE IF NOT EXISTS hiring_platform_db;

-- Use the database
USE hiring_platform_db;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('candidate', 'company_admin', 'company_hr') NOT NULL DEFAULT 'candidate',
    face_embedding TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Create the OTP codes table for email verification
CREATE TABLE IF NOT EXISTS otp_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    purpose ENUM('register', 'forgot_password') NOT NULL DEFAULT 'register',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    INDEX idx_email_otp (email, otp),
    INDEX idx_expires (expires_at)
);

-- Display table structure
DESCRIBE users;
DESCRIBE otp_codes;

-- Display message
SELECT 'Database and tables created successfully!' AS Status;
