-- Clear existing data
TRUNCATE TABLE profile_reviews, previous_projects, languages, education, certifications, skills, user_technologies, technologies, arkus_projects, projects, work_experience, users RESTART IDENTITY CASCADE;

-- Insert sample technologies first
INSERT INTO technologies (id, name) VALUES
    ('tech-1', 'React'),
    ('tech-2', 'Node.js'),
    ('tech-3', 'TypeScript'),
    ('tech-4', 'Python'),
    ('tech-5', 'AWS'),
    ('tech-6', 'Docker'),
    ('tech-7', 'Kubernetes'),
    ('tech-8', 'PostgreSQL'),
    ('tech-9', 'MongoDB'),
    ('tech-10', 'Vue.js'),
    ('tech-11', 'Django'),
    ('tech-12', 'MySQL'),
    ('tech-13', 'Azure'),
    ('tech-14', 'Express'),
    ('tech-15', 'JavaScript'),
    ('tech-16', 'CSS'),
    ('tech-17', 'HTML'),
    ('tech-18', 'Redux'),
    ('tech-19', 'GraphQL'),
    ('tech-20', 'Terraform');

-- Insert users with all new fields
INSERT INTO users (id, name, email, phone, role, location, english_level, status, level, position, company, about, reports_to, employee_score, company_score, current_project_assignment, current_project_id, project_allocation_percentage, hire_date, department, last_review_submission, last_review_approval) VALUES
    ('dca37910-61d0-474f-a7b5-6323aad275fa', 'Sarah Johnson', 'sarah.johnson@arkus.com', '+1 (555) 123-4567', 'employee', 'Austin, TX', 'Native', 'available', 'Senior', 'Senior Frontend Developer', 'Arkus', 'Experienced frontend developer with 8+ years in React, TypeScript, and modern web technologies. Passionate about creating intuitive user experiences and mentoring junior developers.', 'manager-123', 92, 8, 'E-Commerce Platform Redesign', 'project-ecommerce-2024', 80, '2019-03-15', 'Engineering', '2023-12-20 14:45:00', '2023-12-22 09:15:00'),
    
    ('manager-123', 'Michael Chen', 'michael.chen@arkus.com', '+1 (555) 234-5678', 'pm', 'San Francisco, CA', 'Native', 'busy', 'Lead', 'Engineering Manager', 'Arkus', 'Engineering manager with 10+ years of experience leading high-performing development teams. Specialized in agile methodologies and technical leadership.', NULL, 88, 9, 'Team Management & Strategy', 'management-2024', 95, '2017-01-10', 'Engineering', '2023-11-15 10:30:00', '2023-11-16 14:20:00'),
    
    ('employee-3', 'Emily Rodriguez', 'emily.rodriguez@arkus.com', '+1 (555) 345-6789', 'employee', 'New York, NY', 'Native', 'available', 'Mid', 'UX Designer', 'Arkus', 'Creative UX designer with a passion for user-centered design and accessibility. 5+ years of experience in creating intuitive digital experiences.', 'manager-123', 85, 7, 'Healthcare Management System', 'project-healthcare-2024', 60, '2020-06-20', 'Design', '2023-10-05 16:15:00', '2023-10-07 11:45:00'),
    
    ('employee-4', 'David Kim', 'david.kim@arkus.com', '+1 (555) 456-7890', 'employee', 'Seattle, WA', 'Native', 'available', 'Senior', 'Backend Developer', 'Arkus', 'Backend developer specializing in scalable microservices architecture and cloud technologies. Expert in Node.js, Python, and AWS.', 'manager-123', 90, 8, 'API Gateway Optimization', 'project-api-2024', 75, '2018-09-12', 'Engineering', '2023-12-01 09:20:00', '2023-12-03 13:10:00'),
    
    ('employee-5', 'Lisa Thompson', 'lisa.thompson@arkus.com', '+1 (555) 567-8901', 'hr', 'Chicago, IL', 'Native', 'available', 'Senior', 'HR Business Partner', 'Arkus', 'HR professional focused on talent development and employee engagement. 7+ years of experience in human resources and organizational development.', NULL, 87, 8, 'Talent Acquisition Platform', 'project-hr-2024', 40, '2019-11-08', 'Human Resources', '2023-09-20 14:30:00', '2023-09-22 10:15:00'),
    
    ('employee-6', 'James Wilson', 'james.wilson@arkus.com', '+1 (555) 678-9012', 'employee', 'Denver, CO', 'Native', 'busy', 'Mid', 'DevOps Engineer', 'Arkus', 'DevOps engineer with expertise in containerization, CI/CD pipelines, and infrastructure automation. Passionate about improving development workflows.', 'manager-123', 83, 7, 'Infrastructure Modernization', 'project-infra-2024', 90, '2021-02-14', 'Engineering', '2023-11-28 11:45:00', '2023-11-30 15:20:00'),
    
    ('current-user', 'Alex Thompson', 'alex.thompson@arkus.com', '+1 (555) 789-0123', 'employee', 'Austin, TX', 'Native', 'available', 'Senior', 'Senior Full Stack Developer', 'Arkus', 'Passionate full-stack developer with 8+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud architecture. Love mentoring junior developers and contributing to open-source projects.', 'manager-123', 94, 9, 'E-Commerce Platform Redesign', 'project-ecommerce-2024', 85, '2019-03-15', 'Engineering', '2023-12-20 14:45:00', '2023-12-22 09:15:00');

-- Insert certifications with updated structure
INSERT INTO certifications (id, user_id, name, issuer, issue_date, expiry_date, credential_url) VALUES
    ('cert-1', 'current-user', 'AWS Solutions Architect Professional', 'Amazon Web Services', '2023-06-15', '2026-06-15', 'https://aws.amazon.com/verification'),
    ('cert-2', 'current-user', 'Google Cloud Professional Developer', 'Google Cloud', '2023-03-20', '2025-03-20', 'https://cloud.google.com/certification/'),
    ('cert-3', 'dca37910-61d0-474f-a7b5-6323aad275fa', 'React Professional Developer', 'Meta', '2023-08-10', NULL, 'https://developers.facebook.com/certification/'),
    ('cert-4', 'employee-4', 'Kubernetes Administrator', 'Cloud Native Computing Foundation', '2023-05-20', '2026-05-20', 'https://www.cncf.io/certification/'),
    ('cert-5', 'employee-6', 'Docker Certified Associate', 'Docker Inc', '2023-04-15', '2025-04-15', 'https://www.docker.com/certification/');

-- Insert languages with updated structure
INSERT INTO languages (id, user_id, language_name, proficiency_level) VALUES
    ('lang-1', 'current-user', 'English', 'Native'),
    ('lang-2', 'current-user', 'Spanish', 'Intermediate'),
    ('lang-3', 'current-user', 'French', 'Beginner'),
    ('lang-4', 'dca37910-61d0-474f-a7b5-6323aad275fa', 'English', 'Native'),
    ('lang-5', 'dca37910-61d0-474f-a7b5-6323aad275fa', 'Korean', 'Fluent'),
    ('lang-6', 'employee-3', 'English', 'Native'),
    ('lang-7', 'employee-3', 'Spanish', 'Native'),
    ('lang-8', 'employee-4', 'English', 'Native'),
    ('lang-9', 'employee-4', 'Korean', 'Native'),
    ('lang-10', 'employee-4', 'Japanese', 'Intermediate');

-- Insert skills with updated structure
INSERT INTO skills (id, user_id, skill_name, level) VALUES
    ('skill-1', 'current-user', 'React', 'Expert'),
    ('skill-2', 'current-user', 'Node.js', 'Expert'),
    ('skill-3', 'current-user', 'TypeScript', 'Advanced'),
    ('skill-4', 'current-user', 'AWS', 'Advanced'),
    ('skill-5', 'current-user', 'Docker', 'Intermediate'),
    ('skill-6', 'current-user', 'Kubernetes', 'Intermediate'),
    ('skill-7', 'dca37910-61d0-474f-a7b5-6323aad275fa', 'React', 'Expert'),
    ('skill-8', 'dca37910-61d0-474f-a7b5-6323aad275fa', 'TypeScript', 'Expert'),
    ('skill-9', 'dca37910-61d0-474f-a7b5-6323aad275fa', 'CSS', 'Advanced'),
    ('skill-10', 'employee-4', 'Python', 'Expert'),
    ('skill-11', 'employee-4', 'Node.js', 'Advanced'),
    ('skill-12', 'employee-4', 'AWS', 'Expert'),
    ('skill-13', 'employee-6', 'Docker', 'Expert'),
    ('skill-14', 'employee-6', 'Kubernetes', 'Advanced'),
    ('skill-15', 'employee-6', 'Terraform', 'Advanced');

-- Insert education with updated structure
INSERT INTO education (id, user_id, degree, institution, graduation_date, gpa) VALUES
    ('edu-1', 'current-user', 'Bachelor of Science in Computer Science', 'University of Texas at Austin', '2016-05-15', '3.8'),
    ('edu-2', 'dca37910-61d0-474f-a7b5-6323aad275fa', 'Bachelor of Science in Computer Science', 'Stanford University', '2015-06-12', '3.9'),
    ('edu-3', 'employee-3', 'Bachelor of Fine Arts in Digital Design', 'Parsons School of Design', '2018-05-20', '3.7'),
    ('edu-4', 'employee-4', 'Master of Science in Computer Science', 'University of Washington', '2017-06-15', '3.85'),
    ('edu-5', 'employee-5', 'Master of Business Administration', 'Northwestern Kellogg', '2016-06-10', '3.6'),
    ('edu-6', 'employee-6', 'Bachelor of Science in Information Technology', 'Colorado State University', '2020-05-15', '3.5');

-- Insert user technologies relationships
INSERT INTO user_technologies (user_id, technology_id, level) VALUES
    ('current-user', 'tech-1', 'Expert'),    -- React
    ('current-user', 'tech-2', 'Expert'),    -- Node.js
    ('current-user', 'tech-3', 'Advanced'),  -- TypeScript
    ('current-user', 'tech-5', 'Advanced'),  -- AWS
    ('current-user', 'tech-6', 'Intermediate'), -- Docker
    ('dca37910-61d0-474f-a7b5-6323aad275fa', 'tech-1', 'Expert'), -- React
    ('dca37910-61d0-474f-a7b5-6323aad275fa', 'tech-3', 'Expert'), -- TypeScript
    ('dca37910-61d0-474f-a7b5-6323aad275fa', 'tech-16', 'Advanced'), -- CSS
    ('employee-4', 'tech-4', 'Expert'),      -- Python
    ('employee-4', 'tech-2', 'Advanced'),    -- Node.js
    ('employee-4', 'tech-5', 'Expert'),      -- AWS
    ('employee-6', 'tech-6', 'Expert'),      -- Docker
    ('employee-6', 'tech-7', 'Advanced'),    -- Kubernetes
    ('employee-6', 'tech-20', 'Advanced');   -- Terraform

-- Insert previous projects for My Profile section
INSERT INTO previous_projects (id, user_id, project_name, client_name, description, start_date, end_date, role, technologies, team_size, status) VALUES
    ('proj-1', 'current-user', 'E-Commerce Platform Redesign', 'TechCorp Solutions', 'Complete redesign and modernization of the client''s e-commerce platform using React and Node.js. Implemented new payment gateway integration and improved user experience.', '2023-08-01', '2024-01-15', 'Lead Frontend Developer', ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'], 6, 'completed'),
    
    ('proj-2', 'current-user', 'Banking Dashboard Modernization', 'SecureBank Corp', 'Modernized legacy banking dashboard with improved UX and security features. Implemented real-time transaction monitoring and enhanced reporting capabilities.', '2023-01-10', '2023-07-30', 'Full Stack Developer', ARRAY['Vue.js', 'Python', 'Django', 'MySQL', 'Docker'], 4, 'completed'),
    
    ('proj-3', 'current-user', 'Healthcare Management System', 'MedTech Solutions', 'Built comprehensive healthcare management system with patient portal and provider dashboard. Integrated with multiple third-party medical APIs.', '2022-06-15', '2022-12-20', 'Backend Developer', ARRAY['Node.js', 'Express', 'MongoDB', 'React', 'Azure'], 8, 'completed'),
    
    ('proj-4', 'dca37910-61d0-474f-a7b5-6323aad275fa', 'Social Media Analytics Platform', 'DataInsights Inc', 'Developed a comprehensive social media analytics platform with real-time data processing and visualization capabilities.', '2022-09-01', '2023-03-15', 'Frontend Lead', ARRAY['React', 'TypeScript', 'D3.js', 'Node.js', 'AWS'], 5, 'completed'),
    
    ('proj-5', 'employee-4', 'Microservices Migration', 'Enterprise Corp', 'Led the migration from monolithic architecture to microservices, improving system scalability and maintainability.', '2022-11-01', '2023-08-30', 'Backend Architect', ARRAY['Python', 'Docker', 'Kubernetes', 'AWS', 'PostgreSQL'], 12, 'completed');

-- Insert current arkus projects with updated structure
INSERT INTO arkus_projects (id, user_id, project_name, client_name, description, start_date, end_date, allocation_percentage, is_current, status, team_size, role, technologies) VALUES
    ('project-ecommerce-2024', 'current-user', 'E-Commerce Platform Redesign', 'TechCorp Solutions', 'Complete redesign and modernization of the client''s e-commerce platform using React and Node.js', '2024-01-15', NULL, 85, true, 'active', 6, 'Senior Full Stack Developer', ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS']),
    
    ('project-ecommerce-2024', 'dca37910-61d0-474f-a7b5-6323aad275fa', 'E-Commerce Platform Redesign', 'TechCorp Solutions', 'Complete redesign and modernization of the client''s e-commerce platform using React and Node.js', '2024-01-15', NULL, 80, true, 'active', 6, 'Senior Frontend Developer', ARRAY['React', 'TypeScript', 'CSS', 'JavaScript']),
    
    ('project-healthcare-2024', 'employee-3', 'Healthcare Management System', 'MedTech Solutions', 'Building comprehensive healthcare management system with patient portal and provider dashboard', '2024-02-01', NULL, 60, true, 'active', 8, 'UX Designer', ARRAY['Figma', 'Adobe XD', 'Sketch']),
    
    ('project-api-2024', 'employee-4', 'API Gateway Optimization', 'Internal Project', 'Optimizing and scaling the company''s API gateway infrastructure for better performance', '2024-01-10', NULL, 75, true, 'active', 4, 'Backend Developer', ARRAY['Python', 'AWS', 'Docker', 'Kubernetes']),
    
    ('project-infra-2024', 'employee-6', 'Infrastructure Modernization', 'Internal Project', 'Modernizing the company''s infrastructure with containerization and automated deployment pipelines', '2024-01-05', NULL, 90, true, 'active', 3, 'DevOps Engineer', ARRAY['Docker', 'Kubernetes', 'Terraform', 'AWS']);

-- Insert profile reviews
INSERT INTO profile_reviews (id, user_id, last_reviewed_date, approval_status, reviewed_by, review_notes, company_score, submission_message, submitted_at, approved_at) VALUES
    ('review-1', 'current-user', '2023-12-22', 'approved', 'manager-123', 'Excellent progress on technical skills and project leadership. Keep up the great work!', 9, 'Updated my skills and added recent certifications', '2023-12-20 14:45:00', '2023-12-22 09:15:00'),
    
    ('review-2', 'dca37910-61d0-474f-a7b5-6323aad275fa', '2023-12-22', 'approved', 'manager-123', 'Strong frontend development skills and great mentoring abilities.', 8, 'Added new React certification and updated project experience', '2023-12-20 16:30:00', '2023-12-22 10:45:00'),
    
    ('review-3', 'employee-4', '2023-12-03', 'approved', 'manager-123', 'Excellent backend architecture skills and AWS expertise.', 8, 'Updated certifications and added recent project work', '2023-12-01 09:20:00', '2023-12-03 13:10:00');
