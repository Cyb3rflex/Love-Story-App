// 💝 Configure your love story details here
// Update these values with your own information

export const COUPLE_CONFIG = {
  // Your relationship details
  partner1: {
    name: "David",
    email: "david@example.com"
  },
  partner2: {
    name: "Shalom", 
    email: "shalom@example.com"
  },
  
  // Important dates
  relationshipStart: "2024-09-04", // YYYY-MM-DD format
  
  // Countdown settings
  reunionCountdownDays: 50, // How many days to count up to
  
  // App customization
  appTitle: "Our Love Story",
  tagline: "Every moment together is a treasure",
  
  // Theme colors (optional - defaults to romantic theme)
  primaryColor: "hsl(340, 82%, 52%)", // Rose/pink
  accentColor: "hsl(350, 89%, 60%)",  // Bright pink
  
  // Allowed email domains for registration (leave empty to allow any)
  allowedEmailDomains: [], // e.g., ["gmail.com", "outlook.com"]
};

// Export individual values for easy access
export const { partner1, partner2, relationshipStart, reunionCountdownDays, appTitle } = COUPLE_CONFIG;