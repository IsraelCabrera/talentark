-- Enable Row Level Security on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Add auth_user_id column to link with Supabase auth
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id);

-- Create user_roles table for role management
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) CHECK (role IN ('super_user', 'hr', 'manager', 'collaborator')) NOT NULL,
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);

-- Create function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_auth_id UUID)
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT ur.role INTO user_role
    FROM users u
    JOIN user_roles ur ON u.id = ur.user_id
    WHERE u.auth_user_id = user_auth_id
    AND ur.is_active = true
    ORDER BY ur.created_at DESC
    LIMIT 1;
    
    RETURN COALESCE(user_role, 'collaborator');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user can update scores
CREATE OR REPLACE FUNCTION can_update_scores(user_auth_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role(user_auth_id) = 'super_user';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user can view scores
CREATE OR REPLACE FUNCTION can_view_scores(user_auth_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    user_role := get_user_role(user_auth_id);
    RETURN user_role IN ('super_user', 'hr', 'manager');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user can upload users
CREATE OR REPLACE FUNCTION can_upload_users(user_auth_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    user_role := get_user_role(user_auth_id);
    RETURN user_role IN ('super_user', 'hr');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user can approve profiles
CREATE OR REPLACE FUNCTION can_approve_profiles(user_auth_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    user_role := get_user_role(user_auth_id);
    RETURN user_role IN ('super_user', 'manager');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for users table
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "HR and above can view all profiles" ON users;
DROP POLICY IF EXISTS "Super users can update all profiles" ON users;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth_user_id = auth.uid());

-- Policy: Users can update their own profile (collaborators)
CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (
        auth_user_id = auth.uid() 
        AND get_user_role(auth.uid()) = 'collaborator'
    );

-- Policy: HR, Managers, and Super Users can view all profiles
CREATE POLICY "HR and above can view all profiles" ON users
    FOR SELECT USING (
        get_user_role(auth.uid()) IN ('hr', 'manager', 'super_user')
    );

-- Policy: Super Users can update all profiles and scores
CREATE POLICY "Super users can update all profiles" ON users
    FOR UPDATE USING (
        get_user_role(auth.uid()) = 'super_user'
    );

-- Policy: HR can insert new users
CREATE POLICY "HR can insert new users" ON users
    FOR INSERT WITH CHECK (
        can_upload_users(auth.uid())
    );

-- RLS Policies for user_roles table
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
DROP POLICY IF EXISTS "Super users can manage all roles" ON user_roles;

CREATE POLICY "Users can view their own role" ON user_roles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = user_roles.user_id 
            AND users.auth_user_id = auth.uid()
        )
        OR get_user_role(auth.uid()) IN ('super_user', 'hr', 'manager')
    );

CREATE POLICY "Super users can manage all roles" ON user_roles
    FOR ALL USING (
        get_user_role(auth.uid()) = 'super_user'
    );

-- RLS Policies for profile_reviews table
ALTER TABLE profile_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own reviews" ON profile_reviews;
DROP POLICY IF EXISTS "Managers can view and approve reviews" ON profile_reviews;
DROP POLICY IF EXISTS "Users can submit reviews" ON profile_reviews;

CREATE POLICY "Users can view their own reviews" ON profile_reviews
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = profile_reviews.user_id 
            AND users.auth_user_id = auth.uid()
        )
        OR can_approve_profiles(auth.uid())
    );

CREATE POLICY "Managers can view and approve reviews" ON profile_reviews
    FOR ALL USING (
        can_approve_profiles(auth.uid())
    );

CREATE POLICY "Users can submit reviews" ON profile_reviews
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = profile_reviews.user_id 
            AND users.auth_user_id = auth.uid()
        )
    );

-- Insert default super user (you'll need to update this with actual auth user ID)
-- This should be done after creating the first user through Supabase Auth
-- INSERT INTO user_roles (user_id, role, assigned_by) 
-- SELECT id, 'super_user', id FROM users WHERE email = 'admin@arkus.com' LIMIT 1;
