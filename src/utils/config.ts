/**
 * Central configuration utility to access environment variables
 * This provides type safety and default values for our app configuration
 */

interface AppConfig {
  // Supabase Configuration
  supabaseUrl: string;
  supabaseAnonKey: string;

  // App Settings
  appName: string;
  apiTimeout: number;

  // Feature Flags
  enableAnalytics: boolean;
  enablePushNotifications: boolean;

  // Environment
  isDevelopment: boolean;
  isProduction: boolean;
}

const config: AppConfig = {
  // Supabase Configuration
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,

  // App Settings
  appName: import.meta.env.VITE_APP_NAME || "DeliciousBite",
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT || 30000),

  // Feature Flags
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  enablePushNotifications:
    import.meta.env.VITE_ENABLE_PUSH_NOTIFICATIONS === "true",

  // Environment
  isDevelopment: import.meta.env.NODE_ENV === "development",
  isProduction: import.meta.env.NODE_ENV === "production",
};

// Validate critical config values
if (!config.supabaseUrl || !config.supabaseAnonKey) {
  throw new Error(
    "Missing required Supabase environment variables. Check your .env file."
  );
}

export default config;
