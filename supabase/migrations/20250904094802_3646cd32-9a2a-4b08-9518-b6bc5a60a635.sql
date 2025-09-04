-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create daily_photos table
CREATE TABLE public.daily_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  upload_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on daily_photos
ALTER TABLE public.daily_photos ENABLE ROW LEVEL SECURITY;

-- Create policies for daily_photos
CREATE POLICY "Both users can view all daily photos" 
ON public.daily_photos 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own photos" 
ON public.daily_photos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos" 
ON public.daily_photos 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos" 
ON public.daily_photos 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create daily_notes table
CREATE TABLE public.daily_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  note_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on daily_notes
ALTER TABLE public.daily_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for daily_notes
CREATE POLICY "Both users can view all daily notes" 
ON public.daily_notes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own notes" 
ON public.daily_notes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" 
ON public.daily_notes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" 
ON public.daily_notes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create surprise_messages table
CREATE TABLE public.surprise_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  media_url TEXT,
  media_type TEXT CHECK (media_type IN ('video', 'image', 'audio', 'text')),
  unlock_date DATE NOT NULL,
  is_unlocked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on surprise_messages
ALTER TABLE public.surprise_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for surprise_messages
CREATE POLICY "Users can view unlocked surprises or all surprises after unlock date" 
ON public.surprise_messages 
FOR SELECT 
USING (is_unlocked = true OR unlock_date <= CURRENT_DATE);

CREATE POLICY "Users can insert their own surprises" 
ON public.surprise_messages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own surprises" 
ON public.surprise_messages 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own surprises" 
ON public.surprise_messages 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create storage bucket for photos and media
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('surprises', 'surprises', false);

-- Create storage policies for photos bucket
CREATE POLICY "Anyone can view photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'photos');

CREATE POLICY "Users can upload photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for surprises bucket
CREATE POLICY "Users can view surprise files after unlock" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'surprises');

CREATE POLICY "Users can upload surprise files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'surprises' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own surprise files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'surprises' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own surprise files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'surprises' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'name', 'User'));
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_photos_updated_at
  BEFORE UPDATE ON public.daily_photos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_notes_updated_at
  BEFORE UPDATE ON public.daily_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_surprise_messages_updated_at
  BEFORE UPDATE ON public.surprise_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();