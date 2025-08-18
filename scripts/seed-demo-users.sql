-- Insert demo users for testing authentication
-- Note: You'll need to create these users in Supabase Auth first, then update the auth_user_id values

-- Demo Super User
INSERT INTO users (
    id,
    auth_user_id,
    name,
    email,
    role,
    position,
    location,
    employee_score,
    company_score,
    created_at
) VALUES (
    uuid_generate_v4(),
    NULL, -- Replace with actual auth user ID after creating in Supabase Auth
    'Admin User',
    'admin@arkus.com',
    'admin',
    'System Administrator',
    'Austin, TX',
    95,
    9,
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Demo HR User
INSERT INTO users (
    id,
    auth_user_id,
    name,
    email,
    role,
    position,
    location,
    employee_score,
    company_score,
    created_at
) VALUES (
    uuid_generate_v4(),
    NULL, -- Replace with actual auth user ID after creating in Supabase Auth
    'HR Manager',
    'hr@arkus.com',
    'hr',
    'Human Resources Manager',
    'Austin, TX',
    88,
    8,
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Demo Manager User
INSERT INTO users (
    id,
    auth_user_id,
    name,
    email,
    role,
    position,
    location,
    employee_score,
    company_score,
    created_at
) VALUES (
    uuid_generate_v4(),
    NULL, -- Replace with actual auth user ID after creating in Supabase Auth
    'Project Manager',
    'manager@arkus.com',
    'pm',
    'Senior Project Manager',
    'Austin, TX',
    90,
    8,
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Demo Employee User
INSERT INTO users (
    id,
    auth_user_id,
    name,
    email,
    role,
    position,
    location,
    employee_score,
    company_score,
    created_at
) VALUES (
    uuid_generate_v4(),
    NULL, -- Replace with actual auth user ID after creating in Supabase Auth
    'John Employee',
    'employee@arkus.com',
    'employee',
    'Software Developer',
    'Austin, TX',
    85,
    7,
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert corresponding roles
-- Super User role
INSERT INTO user_roles (user_id, role, assigned_by)
SELECT u.id, 'super_user', u.id
FROM users u
WHERE u.email = 'admin@arkus.com'
ON CONFLICT DO NOTHING;

-- HR role
INSERT INTO user_roles (user_id, role, assigned_by)
SELECT u.id, 'hr', (SELECT id FROM users WHERE email = 'admin@arkus.com' LIMIT 1)
FROM users u
WHERE u.email = 'hr@arkus.com'
ON CONFLICT DO NOTHING;

-- Manager role
INSERT INTO user_roles (user_id, role, assigned_by)
SELECT u.id, 'manager', (SELECT id FROM users WHERE email = 'admin@arkus.com' LIMIT 1)
FROM users u
WHERE u.email = 'manager@arkus.com'
ON CONFLICT DO NOTHING;

-- Collaborator role
INSERT INTO user_roles (user_id, role, assigned_by)
SELECT u.id, 'collaborator', (SELECT id FROM users WHERE email = 'admin@arkus.com' LIMIT 1)
FROM users u
WHERE u.email = 'employee@arkus.com'
ON CONFLICT DO NOTHING;
