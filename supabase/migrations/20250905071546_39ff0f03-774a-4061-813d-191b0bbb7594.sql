-- Allow both partners to view all daily notes (shared between couple)
DROP POLICY "Users can view only their own daily notes" ON public.daily_notes;

CREATE POLICY "Both partners can view all daily notes" 
ON public.daily_notes 
FOR SELECT 
USING (true);

-- Allow both partners to view all daily photos (shared memories)
DROP POLICY "Both users can view all daily photos" ON public.daily_photos;

CREATE POLICY "Both partners can view all daily photos" 
ON public.daily_photos 
FOR SELECT 
USING (true);