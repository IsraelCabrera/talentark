-- Clear existing data
DELETE FROM user_technologies;
DELETE FROM profile_reviews;
DELETE FROM certifications;
DELETE FROM languages;
DELETE FROM skills;
DELETE FROM projects;
DELETE FROM education;
DELETE FROM work_experience;
DELETE FROM users;
DELETE FROM technologies;

-- Insert technologies
INSERT INTO technologies (id, name, category) VALUES
(1, 'React', 'Frontend'),
(2, 'Node.js', 'Backend'),
(3, 'Python', 'Backend'),
(4, 'JavaScript', 'Frontend'),
(5, 'TypeScript', 'Frontend'),
(6, 'PostgreSQL', 'Database'),
(7, 'MongoDB', 'Database'),
(8, 'AWS', 'Cloud'),
(9, 'Docker', 'DevOps'),
(10, 'Kubernetes', 'DevOps'),
(11, 'Java', 'Backend'),
(12, 'Spring Boot', 'Backend'),
(13, 'Angular', 'Frontend'),
(14, 'Vue.js', 'Frontend'),
(15, 'GraphQL', 'API'),
(16, 'Redis', 'Database'),
(17, 'Elasticsearch', 'Database'),
(18, 'Jenkins', 'DevOps'),
(19, 'Terraform', 'DevOps'),
(20, 'Go', 'Backend');

-- Insert users
INSERT INTO users (id, name, email, phone, position, level, location, status, hire_date, bio) VALUES
(1, 'Sarah Johnson', 'sarah.johnson@arkus.com', '+1-555-0101', 'Senior Full Stack Developer', 'T3', 'New York, NY', 'available', '2021-03-15', 'Experienced full-stack developer with expertise in React and Node.js. Passionate about building scalable web applications.'),
(2, 'Michael Chen', 'michael.chen@arkus.com', '+1-555-0102', 'DevOps Engineer', 'T2', 'San Francisco, CA', 'assigned', '2020-07-22', 'DevOps specialist focused on cloud infrastructure and automation. AWS certified with extensive Kubernetes experience.'),
(3, 'Emily Rodriguez', 'emily.rodriguez@arkus.com', '+1-555-0103', 'Frontend Developer', 'T2', 'Austin, TX', 'available', '2022-01-10', 'Creative frontend developer specializing in modern JavaScript frameworks and responsive design.'),
(4, 'David Kim', 'david.kim@arkus.com', '+1-555-0104', 'Backend Developer', 'T3', 'Seattle, WA', 'available', '2019-11-05', 'Backend engineer with strong experience in microservices architecture and database optimization.'),
(5, 'Jessica Brown', 'jessica.brown@arkus.com', '+1-555-0105', 'Tech Lead', 'T4', 'Chicago, IL', 'assigned', '2018-05-12', 'Technical leader with 8+ years of experience in software architecture and team management.'),
(6, 'Alex Thompson', 'alex.thompson@arkus.com', '+1-555-0106', 'Junior Developer', 'T1', 'Denver, CO', 'available', '2023-06-01', 'Recent graduate with strong fundamentals in web development and eagerness to learn new technologies.'),
(7, 'Maria Garcia', 'maria.garcia@arkus.com', '+1-555-0107', 'Data Engineer', 'T3', 'Miami, FL', 'available', '2020-09-18', 'Data engineering specialist with expertise in big data processing and analytics pipelines.'),
(8, 'James Wilson', 'james.wilson@arkus.com', '+1-555-0108', 'Mobile Developer', 'T2', 'Los Angeles, CA', 'assigned', '2021-12-03', 'Mobile app developer with experience in both iOS and Android platforms using React Native.'),
(9, 'Lisa Anderson', 'lisa.anderson@arkus.com', '+1-555-0109', 'QA Engineer', 'T2', 'Boston, MA', 'available', '2022-04-20', 'Quality assurance engineer focused on automated testing and continuous integration.'),
(10, 'Robert Taylor', 'robert.taylor@arkus.com', '+1-555-0110', 'Solutions Architect', 'T4', 'Washington, DC', 'available', '2017-08-14', 'Enterprise solutions architect with deep expertise in system design and technology strategy.');

-- Insert work experience
INSERT INTO work_experience (user_id, company, position, start_date, end_date, description) VALUES
(1, 'Arkus Inc.', 'Senior Full Stack Developer', '2021-03-15', NULL, 'Leading development of customer-facing web applications using React and Node.js'),
(1, 'TechStart Solutions', 'Full Stack Developer', '2019-06-01', '2021-03-14', 'Developed and maintained multiple web applications for startup clients'),
(2, 'Arkus Inc.', 'DevOps Engineer', '2020-07-22', NULL, 'Managing cloud infrastructure and implementing CI/CD pipelines'),
(2, 'CloudTech Corp', 'Junior DevOps Engineer', '2018-09-15', '2020-07-21', 'Assisted in cloud migration projects and infrastructure automation'),
(3, 'Arkus Inc.', 'Frontend Developer', '2022-01-10', NULL, 'Creating responsive user interfaces and improving user experience'),
(4, 'Arkus Inc.', 'Backend Developer', '2019-11-05', NULL, 'Designing and implementing scalable backend services and APIs'),
(5, 'Arkus Inc.', 'Tech Lead', '2018-05-12', NULL, 'Leading technical teams and making architectural decisions for enterprise projects');

-- Insert education
INSERT INTO education (user_id, institution, degree, field_of_study, graduation_year) VALUES
(1, 'Stanford University', 'Bachelor of Science', 'Computer Science', 2019),
(2, 'UC Berkeley', 'Master of Science', 'Computer Engineering', 2018),
(3, 'University of Texas at Austin', 'Bachelor of Science', 'Computer Science', 2021),
(4, 'University of Washington', 'Bachelor of Science', 'Software Engineering', 2019),
(5, 'MIT', 'Master of Science', 'Computer Science', 2016),
(6, 'Colorado State University', 'Bachelor of Science', 'Computer Science', 2023),
(7, 'University of Miami', 'Master of Science', 'Data Science', 2020),
(8, 'UCLA', 'Bachelor of Science', 'Computer Science', 2021),
(9, 'Boston University', 'Bachelor of Science', 'Information Systems', 2022),
(10, 'Georgetown University', 'Master of Business Administration', 'Technology Management', 2015);

-- Insert projects
INSERT INTO projects (user_id, name, description, technologies, start_date, end_date) VALUES
(1, 'E-commerce Platform', 'Built a full-stack e-commerce platform with payment integration', 'React, Node.js, PostgreSQL, Stripe API', '2023-01-15', '2023-06-30'),
(2, 'Infrastructure Automation', 'Automated deployment pipeline for microservices architecture', 'Docker, Kubernetes, Jenkins, Terraform', '2023-03-01', '2023-08-15'),
(3, 'Design System', 'Created comprehensive design system and component library', 'React, TypeScript, Storybook, Figma', '2023-02-01', '2023-07-30'),
(4, 'API Gateway', 'Developed high-performance API gateway for microservices', 'Node.js, GraphQL, Redis, MongoDB', '2023-01-01', '2023-05-31'),
(5, 'Enterprise Dashboard', 'Led development of real-time analytics dashboard', 'React, D3.js, WebSocket, PostgreSQL', '2022-09-01', '2023-03-15');

-- Insert languages
INSERT INTO languages (user_id, language, proficiency) VALUES
(1, 'English', 'Native'),
(1, 'Spanish', 'Conversational'),
(2, 'English', 'Fluent'),
(2, 'Mandarin', 'Native'),
(3, 'English', 'Native'),
(3, 'Spanish', 'Native'),
(4, 'English', 'Fluent'),
(4, 'Korean', 'Native'),
(5, 'English', 'Native'),
(6, 'English', 'Native'),
(7, 'English', 'Fluent'),
(7, 'Spanish', 'Native'),
(8, 'English', 'Native'),
(9, 'English', 'Native'),
(10, 'English', 'Native');

-- Insert certifications
INSERT INTO certifications (user_id, name, issuer, issue_date, expiry_date) VALUES
(1, 'AWS Certified Developer', 'Amazon Web Services', '2023-01-15', '2026-01-15'),
(2, 'Certified Kubernetes Administrator', 'Cloud Native Computing Foundation', '2022-11-20', '2025-11-20'),
(2, 'AWS Solutions Architect', 'Amazon Web Services', '2023-03-10', '2026-03-10'),
(3, 'Google UX Design Certificate', 'Google', '2022-08-15', NULL),
(4, 'MongoDB Certified Developer', 'MongoDB Inc.', '2023-02-28', '2026-02-28'),
(5, 'PMP Certification', 'Project Management Institute', '2022-06-15', '2025-06-15'),
(7, 'Google Cloud Professional Data Engineer', 'Google Cloud', '2023-04-20', '2025-04-20'),
(8, 'React Native Certified Developer', 'Meta', '2023-01-30', '2025-01-30'),
(10, 'TOGAF 9 Certified', 'The Open Group', '2022-09-12', NULL);

-- Insert skills
INSERT INTO skills (user_id, name, level, category) VALUES
(1, 'Problem Solving', 'Expert', 'Soft Skills'),
(1, 'Team Leadership', 'Advanced', 'Soft Skills'),
(2, 'System Architecture', 'Expert', 'Technical'),
(2, 'Troubleshooting', 'Expert', 'Technical'),
(3, 'UI/UX Design', 'Advanced', 'Design'),
(3, 'Creative Thinking', 'Expert', 'Soft Skills'),
(4, 'Database Design', 'Expert', 'Technical'),
(4, 'Performance Optimization', 'Advanced', 'Technical'),
(5, 'Strategic Planning', 'Expert', 'Management'),
(5, 'Mentoring', 'Expert', 'Soft Skills');

-- Insert user technologies
INSERT INTO user_technologies (user_id, technology_id, level) VALUES
(1, 1, 'Expert'), (1, 2, 'Advanced'), (1, 4, 'Expert'), (1, 5, 'Advanced'), (1, 6, 'Intermediate'),
(2, 8, 'Expert'), (2, 9, 'Expert'), (2, 10, 'Advanced'), (2, 18, 'Advanced'), (2, 19, 'Intermediate'),
(3, 1, 'Advanced'), (3, 4, 'Expert'), (3, 5, 'Advanced'), (3, 13, 'Intermediate'), (3, 14, 'Intermediate'),
(4, 2, 'Expert'), (4, 3, 'Advanced'), (4, 6, 'Expert'), (4, 7, 'Advanced'), (4, 15, 'Intermediate'),
(5, 1, 'Expert'), (5, 2, 'Expert'), (5, 4, 'Expert'), (5, 5, 'Advanced'), (5, 6, 'Advanced'),
(6, 1, 'Beginner'), (6, 4, 'Intermediate'), (6, 5, 'Beginner'), (6, 6, 'Beginner'),
(7, 3, 'Expert'), (7, 6, 'Advanced'), (7, 7, 'Expert'), (7, 16, 'Advanced'), (7, 17, 'Intermediate'),
(8, 1, 'Advanced'), (8, 4, 'Expert'), (8, 5, 'Advanced'), (8, 2, 'Intermediate'),
(9, 4, 'Advanced'), (9, 3, 'Intermediate'), (9, 18, 'Advanced'),
(10, 8, 'Expert'), (10, 11, 'Expert'), (10, 12, 'Advanced'), (10, 6, 'Advanced'), (10, 19, 'Advanced');

-- Insert profile reviews
INSERT INTO profile_reviews (user_id, last_reviewed_date, approval_status, reviewed_by, review_notes) VALUES
(1, '2023-12-01', 'approved', 'HR Manager', 'Profile complete and up to date. Excellent technical skills documentation.'),
(2, '2023-11-28', 'approved', 'HR Manager', 'Strong DevOps profile with relevant certifications.'),
(3, '2023-12-05', 'pending_review', NULL, NULL),
(4, '2023-11-30', 'approved', 'HR Manager', 'Comprehensive backend development experience.'),
(5, '2023-12-02', 'approved', 'HR Manager', 'Outstanding leadership profile with strong technical background.'),
(6, '2023-12-10', 'pending_review', NULL, NULL),
(7, '2023-12-03', 'approved', 'HR Manager', 'Excellent data engineering expertise.'),
(8, '2023-12-07', 'pending_review', NULL, NULL),
(9, '2023-12-04', 'approved', 'HR Manager', 'Good QA engineering profile.'),
(10, '2023-12-01', 'approved', 'HR Manager', 'Exceptional solutions architect with extensive experience.');
