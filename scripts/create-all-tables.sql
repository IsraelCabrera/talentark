-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    position VARCHAR(150),
    company VARCHAR(100) DEFAULT 'Arkus',
    location VARCHAR(100),
    status VARCHAR(20) CHECK (status IN ('available', 'assigned')) DEFAULT 'available',
    level VARCHAR(10) CHECK (level IN ('T1', 'T2', 'T3', 'T4')) DEFAULT 'T1',
    english_level VARCHAR(20) DEFAULT 'Intermediate',
    profile_picture_url TEXT,
    about TEXT,
    phone VARCHAR(20),
    linkedin_url TEXT,
    github_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create work experience table
CREATE TABLE IF NOT EXISTS work_experience (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    position VARCHAR(150) NOT NULL,
    company VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    description TEXT,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_name VARCHAR(150) NOT NULL,
    client_name VARCHAR(100),
    description TEXT,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create technologies table
CREATE TABLE IF NOT EXISTS technologies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_technologies junction table
CREATE TABLE IF NOT EXISTS user_technologies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
    level VARCHAR(20) DEFAULT 'Intermediate',
    years_experience INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, technology_id)
);

-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    issuer VARCHAR(100) NOT NULL,
    issue_date DATE,
    expiration_date DATE,
    credential_id VARCHAR(100),
    credential_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    level VARCHAR(20) DEFAULT 'Intermediate',
    category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create education table
CREATE TABLE IF NOT EXISTS education (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    degree_title VARCHAR(150) NOT NULL,
    institution_name VARCHAR(150) NOT NULL,
    field_of_study VARCHAR(100),
    start_date DATE,
    end_date DATE,
    grade VARCHAR(20),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    language_name VARCHAR(50) NOT NULL,
    proficiency_level VARCHAR(20) CHECK (proficiency_level IN ('Basic', 'Intermediate', 'Advanced', 'Fluent', 'Native')) DEFAULT 'Intermediate',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, language_name)
);

-- Create activity_log table for tracking changes
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(location);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_level ON users(level);
CREATE INDEX IF NOT EXISTS idx_work_experience_user_id ON work_experience(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_user_technologies_user_id ON user_technologies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_technologies_technology_id ON user_technologies(technology_id);
CREATE INDEX IF NOT EXISTS idx_certifications_user_id ON certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON skills(user_id);
CREATE INDEX IF NOT EXISTS idx_education_user_id ON education(user_id);
CREATE INDEX IF NOT EXISTS idx_languages_user_id ON languages(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now, can be restricted later)
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on work_experience" ON work_experience FOR ALL USING (true);
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations on technologies" ON technologies FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_technologies" ON user_technologies FOR ALL USING (true);
CREATE POLICY "Allow all operations on certifications" ON certifications FOR ALL USING (true);
CREATE POLICY "Allow all operations on skills" ON skills FOR ALL USING (true);
CREATE POLICY "Allow all operations on education" ON education FOR ALL USING (true);
CREATE POLICY "Allow all operations on languages" ON languages FOR ALL USING (true);
CREATE POLICY "Allow all operations on activity_log" ON activity_log FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default technologies
INSERT INTO technologies (name, category) VALUES
    ('React', 'Frontend'),
    ('Vue.js', 'Frontend'),
    ('Angular', 'Frontend'),
    ('TypeScript', 'Language'),
    ('JavaScript', 'Language'),
    ('Python', 'Language'),
    ('Java', 'Language'),
    ('C#', 'Language'),
    ('Node.js', 'Backend'),
    ('Express.js', 'Backend'),
    ('NestJS', 'Backend'),
    ('Django', 'Backend'),
    ('Flask', 'Backend'),
    ('Spring Boot', 'Backend'),
    ('PostgreSQL', 'Database'),
    ('MySQL', 'Database'),
    ('MongoDB', 'Database'),
    ('Redis', 'Database'),
    ('Docker', 'DevOps'),
    ('Kubernetes', 'DevOps'),
    ('AWS', 'Cloud'),
    ('Azure', 'Cloud'),
    ('Google Cloud', 'Cloud'),
    ('Git', 'Tools'),
    ('Jira', 'Tools'),
    ('Figma', 'Design'),
    ('Adobe Creative Suite', 'Design'),
    ('Next.js', 'Frontend'),
    ('Machine Learning', 'AI/ML'),
    ('TensorFlow', 'AI/ML'),
    ('Agile', 'Methodology'),
    ('Scrum', 'Methodology'),
    ('User Research', 'Design'),
    ('Performance Management', 'Management'),
    ('Recruitment', 'Management'),
    ('Training', 'Management')
ON CONFLICT (name) DO NOTHING;
