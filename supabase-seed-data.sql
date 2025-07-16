-- Insert sample technologies first
INSERT INTO technologies (name) VALUES 
('React'), ('Node.js'), ('PostgreSQL'), ('TypeScript'), ('Docker'), 
('Kubernetes'), ('AWS'), ('Python'), ('Figma'), ('Adobe Creative Suite'), 
('HTML/CSS'), ('JavaScript'), ('Machine Learning'), ('SQL'), ('TensorFlow'),
('Java'), ('Spring Boot'), ('MongoDB'), ('Redis'), ('React Native'),
('Swift'), ('Kotlin'), ('Firebase');

-- Insert sample users
INSERT INTO users (name, email, role, location, english_level, status, level, position, company, about) VALUES 
('Sarah Johnson', 'sarah.johnson@arkus.com', 'employee', 'Tijuana, MX', 'Native', 'assigned', 'T4', 'Senior Full Stack Developer', 'Arkus', 'Experienced full-stack developer with expertise in React and Node.js. Passionate about creating scalable web applications.'),
('Miguel Rodriguez', 'miguel.rodriguez@arkus.com', 'employee', 'Guadalajara, MX', 'Advanced', 'available', 'T3', 'DevOps Engineer', 'Arkus', 'DevOps specialist focused on cloud infrastructure and automation. AWS certified professional.'),
('Emily Chen', 'emily.chen@arkus.com', 'employee', 'Medellín, COL', 'Native', 'assigned', 'T3', 'UX/UI Designer', 'Arkus', 'Creative designer with a focus on user experience and modern design systems.'),
('James Wilson', 'james.wilson@arkus.com', 'employee', 'Bogotá, COL', 'Native', 'available', 'T4', 'Data Scientist', 'Arkus', 'Data scientist specializing in machine learning and predictive analytics.'),
('Ana Silva', 'ana.silva@arkus.com', 'employee', 'Cali, COL', 'Intermediate', 'assigned', 'T2', 'Backend Developer', 'Arkus', 'Backend developer with strong experience in Java and microservices architecture.'),
('David Kim', 'david.kim@arkus.com', 'employee', 'CDMX, MX', 'Advanced', 'available', 'T2', 'Mobile Developer', 'Arkus', 'Mobile app developer specializing in cross-platform solutions using React Native.'),
('Laura Martinez', 'laura.martinez@arkus.com', 'pm', 'Tijuana, MX', 'Native', 'assigned', 'T4', 'Project Manager', 'Arkus', 'Experienced project manager with a background in agile methodologies and team leadership.'),
('Carlos Ruiz', 'carlos.ruiz@arkus.com', 'hr', 'Guadalajara, MX', 'Advanced', 'available', 'T3', 'HR Specialist', 'Arkus', 'HR professional focused on talent acquisition and employee development.'),
('Sofia Gonzalez', 'sofia.gonzalez@arkus.com', 'admin', 'Medellín, COL', 'Native', 'assigned', 'T4', 'System Administrator', 'Arkus', 'System administrator with expertise in infrastructure management and security.');

-- Insert work experience (current assignments)
INSERT INTO work_experience (user_id, position, company, start_date, description, is_current) 
SELECT u.id, u.position, u.company, '2023-01-15', 
  CASE 
    WHEN u.name = 'Sarah Johnson' THEN 'Leading development of e-commerce platform using React and Node.js'
    WHEN u.name = 'Miguel Rodriguez' THEN 'Managing cloud infrastructure and CI/CD pipelines'
    WHEN u.name = 'Emily Chen' THEN 'Designing user interfaces for mobile and web applications'
    WHEN u.name = 'James Wilson' THEN 'Developing machine learning models for customer analytics'
    WHEN u.name = 'Ana Silva' THEN 'Building microservices architecture for payment systems'
    WHEN u.name = 'David Kim' THEN 'Developing cross-platform mobile applications'
    ELSE 'Current role responsibilities and projects'
  END, true
FROM users u;

-- Insert projects (work experience history)
INSERT INTO projects (user_id, project_name, client_name, description, start_date, end_date)
SELECT u.id, 
  CASE 
    WHEN u.name = 'Sarah Johnson' THEN 'E-commerce Platform'
    WHEN u.name = 'Miguel Rodriguez' THEN 'Infrastructure Automation'
    WHEN u.name = 'Emily Chen' THEN 'Mobile App Redesign'
    WHEN u.name = 'James Wilson' THEN 'Predictive Analytics'
    WHEN u.name = 'Ana Silva' THEN 'Microservices Architecture'
    WHEN u.name = 'David Kim' THEN 'Cross-platform Mobile App'
    ELSE 'Sample Project'
  END,
  CASE 
    WHEN u.name = 'Sarah Johnson' THEN 'TechCorp'
    WHEN u.name = 'Miguel Rodriguez' THEN 'CloudTech'
    WHEN u.name = 'Emily Chen' THEN 'DesignCo'
    WHEN u.name = 'James Wilson' THEN 'DataCorp'
    WHEN u.name = 'Ana Silva' THEN 'FinTech Solutions'
    WHEN u.name = 'David Kim' THEN 'MobileTech'
    ELSE 'Sample Client'
  END,
  'Project description and key achievements',
  '2022-06-01', '2022-12-31'
FROM users u WHERE u.role = 'employee';

-- Insert user technologies
INSERT INTO user_technologies (user_id, technology_id, level)
SELECT u.id, t.id, 
  CASE 
    WHEN RANDOM() < 0.3 THEN 'Expert'
    WHEN RANDOM() < 0.6 THEN 'Advanced'
    WHEN RANDOM() < 0.8 THEN 'Intermediate'
    ELSE 'Beginner'
  END
FROM users u 
CROSS JOIN technologies t 
WHERE u.role = 'employee' AND RANDOM() < 0.4;

-- Insert certifications
INSERT INTO certifications (user_id, title, issuer, issue_date, expiration_date)
SELECT u.id,
  CASE 
    WHEN u.name = 'Sarah Johnson' THEN 'AWS Solutions Architect'
    WHEN u.name = 'Miguel Rodriguez' THEN 'AWS DevOps Professional'
    WHEN u.name = 'Emily Chen' THEN 'Google UX Design'
    WHEN u.name = 'James Wilson' THEN 'Google Cloud ML Engineer'
    WHEN u.name = 'Ana Silva' THEN 'Oracle Java Professional'
    WHEN u.name = 'David Kim' THEN 'Google Associate Android Developer'
    ELSE 'Professional Certification'
  END,
  CASE 
    WHEN u.name = 'Sarah Johnson' THEN 'Amazon Web Services'
    WHEN u.name = 'Miguel Rodriguez' THEN 'Amazon Web Services'
    WHEN u.name = 'Emily Chen' THEN 'Google'
    WHEN u.name = 'James Wilson' THEN 'Google Cloud'
    WHEN u.name = 'Ana Silva' THEN 'Oracle'
    WHEN u.name = 'David Kim' THEN 'Google'
    ELSE 'Certification Authority'
  END,
  '2023-03-15', '2026-03-15'
FROM users u WHERE u.role = 'employee';

-- Insert education
INSERT INTO education (user_id, degree_title, institution_name, graduation_date)
SELECT u.id,
  CASE 
    WHEN u.name = 'Sarah Johnson' THEN 'Bachelor of Computer Science'
    WHEN u.name = 'Miguel Rodriguez' THEN 'Bachelor of Systems Engineering'
    WHEN u.name = 'Emily Chen' THEN 'Bachelor of Design'
    WHEN u.name = 'James Wilson' THEN 'Master of Data Science'
    WHEN u.name = 'Ana Silva' THEN 'Bachelor of Software Engineering'
    WHEN u.name = 'David Kim' THEN 'Bachelor of Computer Engineering'
    ELSE 'Bachelor of Technology'
  END,
  CASE 
    WHEN u.location LIKE '%MX%' THEN 'Universidad de Guadalajara'
    WHEN u.location LIKE '%COL%' THEN 'Universidad Nacional de Colombia'
    ELSE 'Technical University'
  END,
  '2020-05-15'
FROM users u WHERE u.role = 'employee';

-- Insert languages
INSERT INTO languages (user_id, language_name, proficiency_level)
SELECT u.id, 'Spanish', 'Native' FROM users u
UNION ALL
SELECT u.id, 'English', 
  CASE u.english_level
    WHEN 'Native' THEN 'Native'
    WHEN 'Advanced' THEN 'Fluent'
    WHEN 'Intermediate' THEN 'Intermediate'
    ELSE 'Basic'
  END
FROM users u;

-- Insert profile reviews
INSERT INTO profile_reviews (user_id, last_reviewed_date, approval_status, reviewed_by, review_notes)
SELECT u.id, '2024-01-15', 
  CASE 
    WHEN RANDOM() < 0.7 THEN 'approved'
    WHEN RANDOM() < 0.9 THEN 'pending_review'
    ELSE 'needs_changes'
  END,
  (SELECT id FROM users WHERE role IN ('hr', 'admin') ORDER BY RANDOM() LIMIT 1),
  'Profile review completed'
FROM users u WHERE u.role = 'employee';
