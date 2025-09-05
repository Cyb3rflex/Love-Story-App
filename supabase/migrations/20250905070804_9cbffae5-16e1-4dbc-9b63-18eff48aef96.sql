-- Fix critical security vulnerability: Restrict daily notes access to own notes only
DROP POLICY "Both users can view all daily notes" ON public.daily_notes;

CREATE POLICY "Users can view only their own daily notes" 
ON public.daily_notes 
FOR SELECT 
USING (auth.uid() = user_id);

-- Fix critical security vulnerability: Restrict profile access to own profile only  
DROP POLICY "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view only their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);