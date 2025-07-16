-- This file contains the same content as supabase-tables.sql
-- Run this in your Supabase SQL editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('employee', 'pm', 'hr', 'admin')) DEFAULT 'employee',
    location VARCHAR(100),
    english_level VARCHAR(20),
    status VARCHAR(20) CHECK (status IN ('available', 'assigned')) DEFAULT 'available',
    level VARCHAR(10) CHECK (level IN ('T1', 'T2', 'T3', 'T4')) DEFAULT 'T1',
    position VARCHAR(100),
    company VARCHAR(100),
    about TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Work experience (Current Assignment)
CREATE TABLE work_experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    position VARCHAR(100),
    company VARCHAR(100),
    start_date DATE,
    end_date DATE,
    description TEXT,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects (Work Experience History)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_name VARCHAR(100),
    client_name VARCHAR(100),
    description TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Technologies
CREATE TABLE technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_technologies (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
    level VARCHAR(20) CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    PRIMARY KEY (user_id, technology_id)
);

-- Skills
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_name VARCHAR(100),
    level VARCHAR(20) CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certifications
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150),
    issuer VARCHAR(100),
    issue_date DATE,
    expiration_date DATE,
    credential_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Education
CREATE TABLE education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    degree_title VARCHAR(150),
    institution_name VARCHAR(150),
    graduation_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Languages
CREATE TABLE languages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    language_name VARCHAR(50),
    proficiency_level VARCHAR(20) CHECK (proficiency_level IN ('Basic', 'Intermediate', 'Fluent', 'Native')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profile Reviews
CREATE TABLE profile_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    last_reviewed_date DATE,
    approval_status VARCHAR(20) CHECK (approval_status IN ('approved', 'needs_changes', 'pending_review')) DEFAULT 'pending_review',
    reviewed_by UUID REFERENCES users(id),
    review_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_location ON users(location);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_level ON users(level);
CREATE INDEX idx_work_experience_user_id ON work_experience(user_id);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_user_technologies_user_id ON user_technologies(user_id);
CREATE INDEX idx_skills_user_id ON skills(user_id);
CREATE INDEX idx_certifications_user_id ON certifications(user_id);
CREATE INDEX idx_education_user_id ON education(user_id);
CREATE INDEX idx_languages_user_id ON languages(user_id);
CREATE INDEX idx_profile_reviews_user_id ON profile_reviews(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_reviews ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (allow all for now - you can restrict later)
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on work_experience" ON work_experience FOR ALL USING (true);
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations on technologies" ON technologies FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_technologies" ON user_technologies FOR ALL USING (true);
CREATE POLICY "Allow all operations on skills" ON skills FOR ALL USING (true);
CREATE POLICY "Allow all operations on certifications" ON certifications FOR ALL USING (true);
CREATE POLICY "Allow all operations on education" ON education FOR ALL USING (true);
CREATE POLICY "Allow all operations on languages" ON languages FOR ALL USING (true);
CREATE POLICY "Allow all operations on profile_reviews" ON profile_reviews FOR ALL USING (true);
