-- Insert sample users matching the current mock data
INSERT INTO users (name, email, position, company, location, status, level, english_level, about, phone, linkedin_url, github_url) VALUES
    ('Ana García', 'ana.garcia@arkus.com', 'Senior Frontend Developer', 'Arkus', 'Tijuana, MX', 'available', 'T3', 'Fluent', 'Passionate frontend developer with 5+ years of experience building modern web applications using React, TypeScript, and Next.js. I love creating intuitive user interfaces and optimizing performance.', '+52-664-123-4567', 'https://linkedin.com/in/ana-garcia', 'https://github.com/ana-garcia'),
    
    ('Carlos Mendoza', 'carlos.mendoza@arkus.com', 'Backend Developer', 'Arkus', 'Guadalajara, MX', 'assigned', 'T2', 'Intermediate', 'Backend developer focused on building scalable APIs and microservices. Experienced with Node.js, PostgreSQL, and Docker. Always eager to learn new technologies.', '+52-33-234-5678', 'https://linkedin.com/in/carlos-mendoza', 'https://github.com/carlos-mendoza'),
    
    ('María López', 'maria.lopez@arkus.com', 'Project Manager', 'Arkus', 'CDMX, MX', 'available', 'T4', 'Fluent', 'Experienced project manager with a track record of delivering complex software projects on time and within budget. Certified Scrum Master with expertise in Agile methodologies.', '+52-55-345-6789', 'https://linkedin.com/in/maria-lopez', NULL),
    
    ('Diego Ramírez', 'diego.ramirez@arkus.com', 'Full Stack Developer', 'Arkus', 'Medellín, COL', 'available', 'T3', 'Advanced', 'Full stack developer with expertise in both frontend and backend technologies. Passionate about creating end-to-end solutions using React, Node.js, and AWS cloud services.', '+57-4-456-7890', 'https://linkedin.com/in/diego-ramirez', 'https://github.com/diego-ramirez'),
    
    ('Sofia Herrera', 'sofia.herrera@arkus.com', 'HR Manager', 'Arkus', 'Bogotá, COL', 'available', 'T4', 'Native', 'HR professional focused on talent acquisition and employee development. Experienced in building high-performing teams and implementing effective recruitment strategies.', '+57-1-567-8901', 'https://linkedin.com/in/sofia-herrera', NULL),
    
    ('Luis Morales', 'luis.morales@arkus.com', 'DevOps Engineer', 'Arkus', 'Cali, COL', 'assigned', 'T3', 'Advanced', 'DevOps engineer specializing in cloud infrastructure and CI/CD pipelines. Expert in AWS, Docker, and Kubernetes with a focus on automation and scalability.', '+57-2-678-9012', 'https://linkedin.com/in/luis-morales', 'https://github.com/luis-morales'),
    
    ('Isabella Torres', 'isabella.torres@arkus.com', 'UX/UI Designer', 'Arkus', 'Culiacán, MX', 'available', 'T2', 'Intermediate', 'Creative designer with a passion for user-centered design. Experienced in creating wireframes, prototypes, and design systems using Figma and Adobe Creative Suite.', '+52-667-789-0123', 'https://linkedin.com/in/isabella-torres', NULL),
    
    ('Roberto Silva', 'roberto.silva@arkus.com', 'Data Scientist', 'Arkus', 'Colima, MX', 'assigned', 'T3', 'Advanced', 'Data scientist with expertise in machine learning and statistical analysis. Proficient in Python, TensorFlow, and data visualization tools. Passionate about turning data into actionable insights.', '+52-312-890-1234', 'https://linkedin.com/in/roberto-silva', 'https://github.com/roberto-silva'),
    
    ('Camila Ruiz', 'camila.ruiz@arkus.com', 'QA Engineer', 'Arkus', 'Aguascalientes, MX', 'available', 'T2', 'Intermediate', 'Quality assurance engineer with experience in manual and automated testing. Skilled in creating comprehensive test plans and ensuring software quality across different platforms.', '+52-449-901-2345', 'https://linkedin.com/in/camila-ruiz', NULL),
    
    ('Andrés Vega', 'andres.vega@arkus.com', 'Mobile Developer', 'Arkus', 'CDMX, MX', 'available', 'T3', 'Advanced', 'Mobile developer specializing in React Native and Flutter. Experienced in building cross-platform mobile applications with focus on performance and user experience.', '+52-55-012-3456', 'https://linkedin.com/in/andres-vega', 'https://github.com/andres-vega')
ON CONFLICT (email) DO NOTHING;

-- Get user IDs for relationships
DO $$
DECLARE
    ana_id UUID;
    carlos_id UUID;
    maria_id UUID;
    diego_id UUID;
    sofia_id UUID;
    luis_id UUID;
    isabella_id UUID;
    roberto_id UUID;
    camila_id UUID;
    andres_id UUID;
    react_id UUID;
    nodejs_id UUID;
    typescript_id UUID;
    python_id UUID;
    docker_id UUID;
    aws_id UUID;
    figma_id UUID;
    postgresql_id UUID;
    javascript_id UUID;
    nextjs_id UUID;
    agile_id UUID;
    scrum_id UUID;
    tensorflow_id UUID;
    adobe_id UUID;
BEGIN
    -- Get user IDs
    SELECT id INTO ana_id FROM users WHERE email = 'ana.garcia@arkus.com';
    SELECT id INTO carlos_id FROM users WHERE email = 'carlos.mendoza@arkus.com';
    SELECT id INTO maria_id FROM users WHERE email = 'maria.lopez@arkus.com';
    SELECT id INTO diego_id FROM users WHERE email = 'diego.ramirez@arkus.com';
    SELECT id INTO sofia_id FROM users WHERE email = 'sofia.herrera@arkus.com';
    SELECT id INTO luis_id FROM users WHERE email = 'luis.morales@arkus.com';
    SELECT id INTO isabella_id FROM users WHERE email = 'isabella.torres@arkus.com';
    SELECT id INTO roberto_id FROM users WHERE email = 'roberto.silva@arkus.com';
    SELECT id INTO camila_id FROM users WHERE email = 'camila.ruiz@arkus.com';
    SELECT id INTO andres_id FROM users WHERE email = 'andres.vega@arkus.com';

    -- Get technology IDs
    SELECT id INTO react_id FROM technologies WHERE name = 'React';
    SELECT id INTO nodejs_id FROM technologies WHERE name = 'Node.js';
    SELECT id INTO typescript_id FROM technologies WHERE name = 'TypeScript';
    SELECT id INTO python_id FROM technologies WHERE name = 'Python';
    SELECT id INTO docker_id FROM technologies WHERE name = 'Docker';
    SELECT id INTO aws_id FROM technologies WHERE name = 'AWS';
    SELECT id INTO figma_id FROM technologies WHERE name = 'Figma';
    SELECT id INTO postgresql_id FROM technologies WHERE name = 'PostgreSQL';
    SELECT id INTO javascript_id FROM technologies WHERE name = 'JavaScript';
    SELECT id INTO nextjs_id FROM technologies WHERE name = 'Next.js';
    SELECT id INTO agile_id FROM technologies WHERE name = 'Agile';
    SELECT id INTO scrum_id FROM technologies WHERE name = 'Scrum';
    SELECT id INTO tensorflow_id FROM technologies WHERE name = 'TensorFlow';
    SELECT id INTO adobe_id FROM technologies WHERE name = 'Adobe Creative Suite';

    -- Insert user technologies to match the mock data
    INSERT INTO user_technologies (user_id, technology_id, level, years_experience) VALUES
        -- Ana García - Senior Frontend Developer
        (ana_id, react_id, 'Expert', 5),
        (ana_id, typescript_id, 'Advanced', 4),
        (ana_id, nextjs_id, 'Advanced', 3),
        (ana_id, javascript_id, 'Expert', 6),
        
        -- Carlos Mendoza - Backend Developer
        (carlos_id, nodejs_id, 'Advanced', 3),
        (carlos_id, postgresql_id, 'Advanced', 3),
        (carlos_id, docker_id, 'Intermediate', 2),
        (carlos_id, javascript_id, 'Advanced', 4),
        
        -- María López - Project Manager
        (maria_id, agile_id, 'Expert', 6),
        (maria_id, scrum_id, 'Expert', 5),
        
        -- Diego Ramírez - Full Stack Developer
        (diego_id, react_id, 'Advanced', 4),
        (diego_id, nodejs_id, 'Advanced', 4),
        (diego_id, aws_id, 'Intermediate', 2),
        (diego_id, javascript_id, 'Expert', 5),
        
        -- Luis Morales - DevOps Engineer
        (luis_id, aws_id, 'Expert', 5),
        (luis_id, docker_id, 'Expert', 4),
        
        -- Isabella Torres - UX/UI Designer
        (isabella_id, figma_id, 'Advanced', 3),
        (isabella_id, adobe_id, 'Advanced', 4),
        
        -- Roberto Silva - Data Scientist
        (roberto_id, python_id, 'Expert', 5),
        (roberto_id, tensorflow_id, 'Advanced', 3),
        
        -- Andrés Vega - Mobile Developer
        (andres_id, react_id, 'Advanced', 3)
    ON CONFLICT (user_id, technology_id) DO NOTHING;

    -- Insert work experience
    INSERT INTO work_experience (user_id, position, company, start_date, end_date, description, is_current) VALUES
        (ana_id, 'Senior Frontend Developer', 'Arkus', '2022-01-01', NULL, 'Leading frontend development for multiple client projects using React and TypeScript. Mentoring junior developers and establishing best practices.', true),
        (ana_id, 'Frontend Developer', 'TechCorp', '2019-06-01', '2021-12-31', 'Developed responsive web applications using React and Vue.js. Collaborated with UX/UI designers to implement pixel-perfect designs.', false),
        (carlos_id, 'Backend Developer', 'Arkus', '2021-03-01', NULL, 'Developing scalable APIs and microservices using Node.js and PostgreSQL. Implementing CI/CD pipelines and monitoring solutions.', true),
        (maria_id, 'Project Manager', 'Arkus', '2020-01-01', NULL, 'Managing multiple software development projects using Agile methodologies. Coordinating cross-functional teams and ensuring timely delivery.', true),
        (diego_id, 'Full Stack Developer', 'Arkus', '2021-08-01', NULL, 'Building end-to-end web applications using React, Node.js, and AWS. Participating in architecture decisions and code reviews.', true),
        (luis_id, 'DevOps Engineer', 'Arkus', '2020-06-01', NULL, 'Managing cloud infrastructure and CI/CD pipelines. Implementing monitoring and logging solutions for production systems.', true),
        (isabella_id, 'UX/UI Designer', 'Arkus', '2022-03-01', NULL, 'Creating user-centered designs and prototypes. Conducting user research and usability testing to improve product experiences.', true),
        (roberto_id, 'Data Scientist', 'Arkus', '2021-09-01', NULL, 'Developing machine learning models and data analysis pipelines. Creating data visualizations and insights for business decisions.', true)
    ON CONFLICT DO NOTHING;

    -- Insert projects
    INSERT INTO projects (user_id, project_name, client_name, start_date, end_date, description, is_current) VALUES
        (ana_id, 'E-commerce Platform', 'RetailCorp', '2023-01-01', NULL, 'Leading the frontend development of a modern e-commerce platform with advanced filtering and search capabilities.', true),
        (carlos_id, 'Banking API', 'FinanceBank', '2022-06-01', '2023-03-31', 'Developed secure banking APIs with real-time transaction processing and fraud detection capabilities.', false),
        (diego_id, 'Healthcare Dashboard', 'MedTech Solutions', '2023-02-01', NULL, 'Building a comprehensive healthcare dashboard for patient management and analytics.', true),
        (luis_id, 'Cloud Migration', 'Enterprise Corp', '2022-09-01', '2023-06-30', 'Led the migration of legacy systems to AWS cloud infrastructure with improved scalability and cost optimization.', false),
        (isabella_id, 'Mobile App Design', 'StartupXYZ', '2023-04-01', NULL, 'Designing user interface and experience for a new mobile application focused on productivity and collaboration.', true),
        (roberto_id, 'Predictive Analytics', 'Manufacturing Inc', '2023-01-01', NULL, 'Developing machine learning models for predictive maintenance and quality control in manufacturing processes.', true)
    ON CONFLICT DO NOTHING;

    -- Insert education
    INSERT INTO education (user_id, degree_title, institution_name, field_of_study, start_date, end_date, grade) VALUES
        (ana_id, 'Bachelor of Computer Science', 'Universidad Autónoma de Baja California', 'Computer Science', '2015-08-01', '2019-06-30', '9.2/10'),
        (carlos_id, 'Bachelor of Software Engineering', 'Universidad de Guadalajara', 'Software Engineering', '2016-08-01', '2020-06-30', '8.8/10'),
        (maria_id, 'Master of Business Administration', 'ITESM', 'Project Management', '2018-08-01', '2020-12-15', '9.5/10'),
        (diego_id, 'Bachelor of Systems Engineering', 'Universidad Nacional de Colombia', 'Systems Engineering', '2017-02-01', '2021-12-15', '4.2/5.0'),
        (sofia_id, 'Bachelor of Psychology', 'Universidad Nacional de Colombia', 'Organizational Psychology', '2014-02-01', '2018-11-30', '4.5/5.0'),
        (luis_id, 'Bachelor of Computer Engineering', 'Universidad del Valle', 'Computer Engineering', '2015-02-01', '2019-11-30', '4.3/5.0'),
        (isabella_id, 'Bachelor of Graphic Design', 'Universidad Autónoma de Sinaloa', 'Graphic Design', '2018-08-01', '2022-06-30', '9.0/10'),
        (roberto_id, 'Master of Data Science', 'Universidad de Colima', 'Data Science', '2019-08-01', '2021-12-15', '9.3/10'),
        (camila_id, 'Bachelor of Software Engineering', 'Universidad Autónoma de Aguascalientes', 'Software Engineering', '2018-08-01', '2022-06-30', '8.9/10'),
        (andres_id, 'Bachelor of Computer Science', 'Universidad Nacional Autónoma de México', 'Computer Science', '2017-08-01', '2021-06-30', '9.1/10')
    ON CONFLICT DO NOTHING;

    -- Insert languages
    INSERT INTO languages (user_id, language_name, proficiency_level) VALUES
        (ana_id, 'Spanish', 'Native'),
        (ana_id, 'English', 'Fluent'),
        (carlos_id, 'Spanish', 'Native'),
        (carlos_id, 'English', 'Intermediate'),
        (maria_id, 'Spanish', 'Native'),
        (maria_id, 'English', 'Fluent'),
        (diego_id, 'Spanish', 'Native'),
        (diego_id, 'English', 'Advanced'),
        (sofia_id, 'Spanish', 'Native'),
        (sofia_id, 'English', 'Native'),
        (luis_id, 'Spanish', 'Native'),
        (luis_id, 'English', 'Advanced'),
        (isabella_id, 'Spanish', 'Native'),
        (isabella_id, 'English', 'Intermediate'),
        (roberto_id, 'Spanish', 'Native'),
        (roberto_id, 'English', 'Advanced'),
        (camila_id, 'Spanish', 'Native'),
        (camila_id, 'English', 'Intermediate'),
        (andres_id, 'Spanish', 'Native'),
        (andres_id, 'English', 'Advanced')
    ON CONFLICT (user_id, language_name) DO NOTHING;

    -- Insert certifications
    INSERT INTO certifications (user_id, title, issuer, issue_date, credential_id) VALUES
        (ana_id, 'React Developer Certification', 'Meta', '2023-03-15', 'META-REACT-2023-001'),
        (carlos_id, 'AWS Certified Developer', 'Amazon Web Services', '2022-11-20', 'AWS-DEV-2022-456'),
        (maria_id, 'Certified Scrum Master', 'Scrum Alliance', '2021-09-10', 'CSM-2021-789'),
        (diego_id, 'Full Stack Web Developer', 'freeCodeCamp', '2022-05-30', 'FCC-FULLSTACK-2022-123'),
        (luis_id, 'AWS Solutions Architect', 'Amazon Web Services', '2021-12-05', 'AWS-SA-2021-999'),
        (roberto_id, 'TensorFlow Developer Certificate', 'Google', '2023-01-20', 'TF-DEV-2023-555'),
        (isabella_id, 'UX Design Certificate', 'Google', '2022-08-15', 'GOOGLE-UX-2022-333'),
        (camila_id, 'ISTQB Foundation Level', 'International Software Testing Qualifications Board', '2022-04-10', 'ISTQB-FL-2022-777')
    ON CONFLICT DO NOTHING;

END $$;
