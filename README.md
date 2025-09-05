# 💝 Love Story App

A beautiful, romantic web application designed for couples to share their daily moments, photos, notes, and surprise messages. Built with React, TypeScript, Tailwind CSS, and Supabase.

## ✨ Features

- **Countdown Timer**: Track days since your relationship began
- **Daily Notes**: Share your thoughts and feelings with each other
- **Photo Gallery**: Upload and view shared memories together  
- **Surprise Messages**: Create time-locked surprises for your partner
- **Secure Authentication**: Private, secure login for just the two of you
- **Beautiful Design**: Romantic gradient themes and smooth animations
- **Mobile Responsive**: Perfect experience on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- A Supabase account

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd love-story-app
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API to get your project URL and anon key
3. Update `src/integrations/supabase/client.ts` with your credentials:

```typescript
const SUPABASE_URL = "your-project-url";
const SUPABASE_PUBLISHABLE_KEY = "your-anon-key";
```

### 3. Configure Your Love Story

Update the `src/config/couple.ts` file with your details:

```typescript
export const COUPLE_CONFIG = {
  // Your names (used in the app interface)
  partner1: {
    name: "Your Name",
    email: "your.email@example.com"
  },
  partner2: {
    name: "Partner's Name", 
    email: "partner.email@example.com"
  },
  
  // Your relationship start date (for the countdown)
  relationshipStart: "2024-09-04", // YYYY-MM-DD format
  
  // App customization
  appTitle: "Our Love Story",
  reunionCountdownDays: 50 // How many days to count up to
};
```

### 4. Set Up Database

The app will automatically create the required database tables when you first run it. Run the following SQL in your Supabase SQL Editor:

```sql
-- Enable the app to create profiles automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'name', 'User'));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## 📱 Deployment

### Deploy to Netlify/Vercel

1. Build the app: `npm run build`
2. Deploy the `dist` folder to your preferred hosting platform
3. Make sure your Supabase project is properly configured

### Deploy via Lovable (Easiest)

1. Open your [Lovable Project](https://lovable.dev)
2. Click Share → Publish
3. Your app will be live instantly!

## 🔧 Customization

### Couple Configuration

All couple-specific settings are in `src/config/couple.ts`:

- **Names**: Update `partner1.name` and `partner2.name`
- **Emails**: Set `partner1.email` and `partner2.email` 
- **Start Date**: Change `relationshipStart` to your special date
- **Countdown**: Adjust `reunionCountdownDays` for your timeline

### Themes & Colors

Edit `src/index.css` and `tailwind.config.ts` to customize the romantic color scheme:

```css
/* Update CSS variables in index.css */
:root {
  --primary: 340 82% 52%;      /* Main romantic pink */
  --primary-foreground: 0 0% 98%;
  --gradient-romantic: linear-gradient(135deg, hsl(340, 82%, 52%), hsl(350, 89%, 60%));
}
```

### Adding Features

- **New note categories**: Extend the `daily_notes` table
- **Photo albums**: Group photos by events or dates  
- **Custom surprise types**: Add new media types to `surprise_messages`
- **Anniversary reminders**: Add milestone tracking
- **Voice messages**: Extend surprises with audio support

## 🏗️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, RLS)
- **Build Tool**: Vite
- **UI Components**: Radix UI primitives with shadcn/ui
- **Icons**: Lucide React
- **Date Handling**: date-fns with timezone support
- **Animations**: CSS animations with Tailwind

## 📊 Database Schema

### Tables

- **`profiles`** - User profile information and names
- **`daily_notes`** - Daily thoughts, feelings, and messages
- **`daily_photos`** - Shared photo memories with descriptions
- **`surprise_messages`** - Time-locked surprise content with media

### Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Users can only access their own data**
- **Secure file upload** with size limits (5MB photos, 10MB media)
- **Authentication required** for all app features
- **Private surprise storage** with time-based unlocking

## 🔒 Privacy & Security

This app is designed for **maximum privacy** between couples:

- ✅ Only authenticated users can access the app
- ✅ Users can only see their own notes and data
- ✅ Photos are securely stored in Supabase storage
- ✅ Surprises remain locked until their unlock date
- ✅ All database access is protected by Row Level Security
- ✅ No data is shared with third parties

## 🤝 Contributing

Want to make this love story app even better?

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your romantic improvements
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📚 Common Issues & Solutions

### "Cannot read properties of undefined"
- Make sure you've updated `src/config/couple.ts` with your details
- Check that your Supabase credentials are correct

### Photos not uploading
- Verify your Supabase storage buckets are created
- Check file size limits (5MB max for photos)

### Countdown not showing correctly
- Ensure `relationshipStart` date is in YYYY-MM-DD format
- Check your timezone settings in the component

### Authentication not working
- Confirm Supabase project URL and keys are correct
- Make sure email confirmation is disabled in Supabase Auth settings

## 💕 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support & Community

Need help setting up your love story app?

- 📖 [Supabase Documentation](https://supabase.com/docs)
- ⚛️ [React Documentation](https://react.dev)
- 💬 [Lovable Discord Community](https://discord.com/channels/1119885301872070706/1280461670979993613)
- 🎥 [Lovable YouTube Tutorials](https://www.youtube.com/watch?v=9KHLTZaJcR8&list=PLbVHz4urQBZkJiAWdG8HWoJTdgEysigIO)

---

**Made with 💖 for couples who want to share their digital love story**

*"Love is not just about the big moments, but all the little daily moments that make your story unique."*

### ✨ Perfect for:
- **Long-distance couples** staying connected
- **New relationships** building memories together  
- **Anniversary celebrations** with surprise countdowns
- **Daily connection** through notes and photos
- **Married couples** keeping the romance alive
- **Anyone in love** who wants a private digital space

**Start your digital love story today! 💝**