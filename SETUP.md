# 🚀 Quick Setup Guide

## For Couples Who Want to Use This App

### Step 1: Get Your Own Copy
1. **Fork this repository** or download as ZIP
2. **Create a Supabase account** at [supabase.com](https://supabase.com)
3. **Create a new Supabase project**

### Step 2: Configure Your Love Story
Edit `src/config/couple.ts` with your details:

```typescript
export const COUPLE_CONFIG = {
  partner1: {
    name: "Your Name",           // 👈 Replace with your name
    email: "you@example.com"     // 👈 Replace with your email
  },
  partner2: {
    name: "Partner's Name",      // 👈 Replace with partner's name  
    email: "partner@example.com" // 👈 Replace with partner's email
  },
  
  relationshipStart: "2024-09-04", // 👈 Your special date (YYYY-MM-DD)
  reunionCountdownDays: 50,        // 👈 How many days to count to
  appTitle: "Our Love Story"       // 👈 Your app title
};
```

### Step 3: Update Supabase Connection
In `src/integrations/supabase/client.ts`, replace:

```typescript
const SUPABASE_URL = "your-project-url-here";
const SUPABASE_PUBLISHABLE_KEY = "your-anon-key-here";
```

Get these values from your Supabase project dashboard → Settings → API.

### Step 4: Deploy Your App

**Option A: Deploy via Lovable (Easiest)**
1. Import this project into [Lovable](https://lovable.dev)
2. Make your configuration changes
3. Click "Publish" - done! 🎉

**Option B: Deploy Manually**
1. Build: `npm run build`  
2. Deploy `dist` folder to Netlify, Vercel, or your preferred host
3. Set up your custom domain (optional)

### Step 5: Set Up Database
The app will create tables automatically, but you may need to run this SQL in your Supabase SQL Editor:

```sql
-- Create user profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'name', 'User'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### Step 6: Create Your Accounts
1. Both partners visit your deployed app
2. Sign up with the emails you configured
3. Start sharing your love story! 💕

---

## 🎯 What You Get

✅ **Private couple space** - Only you two can access  
✅ **Daily notes** - Share thoughts and feelings  
✅ **Photo memories** - Upload and view special moments  
✅ **Surprise messages** - Time-locked content for special dates  
✅ **Countdown timer** - Track time until your reunion/anniversary  
✅ **Beautiful design** - Romantic themes and smooth animations  
✅ **Mobile friendly** - Perfect on phones and tablets  
✅ **Secure & private** - Your data belongs to you  

## 🆘 Need Help?

- **Issues?** Check the main [README.md](./README.md) for troubleshooting
- **Questions?** Create an issue in this repository  
- **Customization?** All the code is yours to modify!

**Ready to start your digital love story? 💝**