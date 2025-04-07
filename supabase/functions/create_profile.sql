
-- Create a database function that will handle user profile creation with elevated privileges
-- This function runs with security definer which means it executes with the privileges of the function owner
CREATE OR REPLACE FUNCTION public.create_user_profile(
  user_id UUID,
  user_email TEXT,
  user_name TEXT,
  user_role TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_exists BOOLEAN;
  result JSONB;
BEGIN
  -- Check if profile already exists
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE id = user_id
  ) INTO profile_exists;
  
  -- If profile doesn't exist, create it
  IF NOT profile_exists THEN
    INSERT INTO public.users (id, email, name, role, created_at)
    VALUES (user_id, user_email, user_name, user_role, now());
    
    result := json_build_object('success', true, 'message', 'Profile created successfully');
  ELSE
    -- Profile already exists, return success but with different message
    result := json_build_object('success', true, 'message', 'Profile already exists');
  END IF;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    -- Return error details
    RETURN json_build_object(
      'success', false,
      'message', 'Error creating profile',
      'error', SQLERRM
    );
END;
$$;
