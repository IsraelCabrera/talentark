-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (updated with all current fields from My Profile)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) CHECK (role IN ('employee', 'pm', 'hr', 'admin')) DEFAULT 'employee',
    location VARCHAR(100),
    english_level VARCHAR(20),
    status VARCHAR(20) CHECK (status IN ('available', 'assigned', 'busy', 'away')) DEFAULT 'available',
    level VARCHAR(10) CHECK (level IN ('T1', 'T2', 'T3', 'T4', 'Junior', 'Mid', 'Senior', 'Lead')) DEFAULT 'T1',
    position VARCHAR(100),
    company VARCHAR(100),
    about TEXT,
    reports_to UUID REFERENCES users(id),
    employee_score INTEGER CHECK (employee_score >= 0 AND employee_score <= 100),
    company_score INTEGER CHECK (company_score >= 1 AND company_score <= 10),
    current_project_assignment VARCHAR(200),
    current_project_id UUID,
    project_allocation_percentage INTEGER CHECK (project_allocation_percentage >= 0 AND project_allocation_percentage <= 100) DEFAULT 0,
    hire_date DATE,
    department VARCHAR(50),
    avatar TEXT,
    last_review_submission TIMESTAMP,
    last_review_approval TIMESTAMP,
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

-- Arkus Projects (Current and Past Arkus Projects) - Updated with new fields
CREATE TABLE arkus_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_name VARCHAR(150) NOT NULL,
    client_name VARCHAR(100),
    description TEXT,
    start_date DATE,
    end_date DATE,
    allocation_percentage INTEGER CHECK (allocation_percentage >= 0 AND allocation_percentage <= 100) DEFAULT 100,
    is_current BOOLEAN DEFAULT false,
    status VARCHAR(20) CHECK (status IN ('active', 'completed', 'cancelled', 'on-hold', 'planning')) DEFAULT 'active',
    team_size INTEGER DEFAULT 1,
    role VARCHAR(100),
    technologies TEXT[], -- Array of technology names
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

-- Skills (Updated to match My Profile structure)
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_name VARCHAR(100),
    level VARCHAR(20) CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certifications (Updated with all fields from My Profile)
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    issuer VARCHAR(100) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    credential_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Education (Updated to match My Profile structure)
CREATE TABLE education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    degree VARCHAR(150) NOT NULL,
    institution VARCHAR(150) NOT NULL,
    graduation_date DATE NOT NULL,
    gpa VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Languages (Updated to match My Profile structure)
CREATE TABLE languages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    language_name VARCHAR(50) NOT NULL,
    proficiency_level VARCHAR(20) CHECK (proficiency_level IN ('Beginner', 'Intermediate', 'Advanced', 'Fluent', 'Native')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Previous Projects (New table for My Profile previous projects section)
CREATE TABLE previous_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_name VARCHAR(150) NOT NULL,
    client_name VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    role VARCHAR(100) NOT NULL,
    technologies TEXT[], -- Array of technology names
    team_size INTEGER DEFAULT 1,
    status VARCHAR(20) CHECK (status IN ('completed', 'cancelled', 'on-hold')) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profile Reviews (Updated with company_score)
CREATE TABLE profile_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    last_reviewed_date DATE,
    approval_status VARCHAR(20) CHECK (approval_status IN ('approved', 'needs_changes', 'pending_review')) DEFAULT 'pending_review',
    reviewed_by UUID REFERENCES users(id),
    review_notes TEXT,
    company_score INTEGER CHECK (company_score >= 0 AND company_score <= 10),
    submission_message TEXT,
    submitted_at TIMESTAMP,
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_location ON users(location);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_level ON users(level);
CREATE INDEX idx_users_reports_to ON users(reports_to);
CREATE INDEX idx_users_employee_score ON users(employee_score);
CREATE INDEX idx_users_company_score ON users(company_score);
CREATE INDEX idx_users_department ON users(department);
CREATE INDEX idx_users_last_review_submission ON users(last_review_submission);
CREATE INDEX idx_users_last_review_approval ON users(last_review_approval);

CREATE INDEX idx_work_experience_user_id ON work_experience(user_id);
CREATE INDEX idx_projects_user_id ON projects(user_id);

CREATE INDEX idx_arkus_projects_user_id ON arkus_projects(user_id);
CREATE INDEX idx_arkus_projects_is_current ON arkus_projects(is_current);
CREATE INDEX idx_arkus_projects_status ON arkus_projects(status);

CREATE INDEX idx_previous_projects_user_id ON previous_projects(user_id);
CREATE INDEX idx_previous_projects_status ON previous_projects(status);

CREATE INDEX idx_user_technologies_user_id ON user_technologies(user_id);
CREATE INDEX idx_skills_user_id ON skills(user_id);
CREATE INDEX idx_certifications_user_id ON certifications(user_id);
CREATE INDEX idx_education_user_id ON education(user_id);
CREATE INDEX idx_languages_user_id ON languages(user_id);

CREATE INDEX idx_profile_reviews_user_id ON profile_reviews(user_id);
CREATE INDEX idx_profile_reviews_company_score ON profile_reviews(company_score);
CREATE INDEX idx_profile_reviews_approval_status ON profile_reviews(approval_status);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE arkus_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE previous_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_reviews ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (allow all for now - you can restrict later)
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on work_experience" ON work_experience FOR ALL USING (true);
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations on arkus_projects" ON arkus_projects FOR ALL USING (true);
CREATE POLICY "Allow all operations on technologies" ON technologies FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_technologies" ON user_technologies FOR ALL USING (true);
CREATE POLICY "Allow all operations on skills" ON skills FOR ALL USING (true);
CREATE POLICY "Allow all operations on certifications" ON certifications FOR ALL USING (true);
CREATE POLICY "Allow all operations on education" ON education FOR ALL USING (true);
CREATE POLICY "Allow all operations on languages" ON languages FOR ALL USING (true);
CREATE POLICY "Allow all operations on previous_projects" ON previous_projects FOR ALL USING (true);
CREATE POLICY "Allow all operations on profile_reviews" ON profile_reviews FOR ALL USING (true);
