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

-- Hiring & assessment tables
CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_company_name (name)
);

CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NULL,
    created_by_user_id INT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    skills_json JSON NULL,
    modules_json JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_job_company (company_id),
    INDEX idx_job_created_by (created_by_user_id),
    INDEX idx_job_created_at (created_at),
    CONSTRAINT fk_jobs_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL,
    CONSTRAINT fk_jobs_created_by FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS assessments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NULL,
    candidate_user_id INT NULL,
    invited_email VARCHAR(255) NULL,
    status VARCHAR(64) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    INDEX idx_assessment_job (job_id),
    INDEX idx_assessment_candidate (candidate_user_id),
    INDEX idx_assessment_invited_email (invited_email),
    INDEX idx_assessment_status (status),
    CONSTRAINT fk_assessments_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL,
    CONSTRAINT fk_assessments_candidate FOREIGN KEY (candidate_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS proctor_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    assessment_id INT NULL,
    type VARCHAR(64) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payload_json JSON NULL,
    INDEX idx_proctor_user (user_id),
    INDEX idx_proctor_assessment (assessment_id),
    INDEX idx_proctor_type (type),
    INDEX idx_proctor_timestamp (timestamp),
    CONSTRAINT fk_proctor_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_proctor_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS candidate_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_user_id INT NULL,
    assessment_id INT NULL,
    report_json JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_report_candidate (candidate_user_id),
    INDEX idx_report_assessment (assessment_id),
    CONSTRAINT fk_reports_candidate FOREIGN KEY (candidate_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_reports_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_user_id INT NOT NULL,
    job_id INT NOT NULL,
    status VARCHAR(64) NOT NULL DEFAULT 'Applied',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_app_candidate_job (candidate_user_id, job_id),
    INDEX idx_app_candidate (candidate_user_id),
    INDEX idx_app_job (job_id),
    INDEX idx_app_status (status),
    INDEX idx_app_created_at (created_at),
    CONSTRAINT fk_app_candidate FOREIGN KEY (candidate_user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_app_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- Display table structure
DESCRIBE users;
DESCRIBE otp_codes;
DESCRIBE companies;
DESCRIBE jobs;
DESCRIBE assessments;
DESCRIBE proctor_logs;
DESCRIBE candidate_reports;
DESCRIBE applications;

-- Display message
SELECT 'Database and tables created successfully!' AS Status;
