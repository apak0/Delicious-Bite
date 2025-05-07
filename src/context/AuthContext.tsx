import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";
import { supabase } from "../lib/supabase";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
    remember?: boolean
  ) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isStaff: boolean;
  isCustomer: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set session persistence based on remembered preference
    const rememberSession = localStorage.getItem("rememberSession") === "true";

    // Configure the auth session persistence
    supabase.auth.setSession({
      access_token: "",
      refresh_token: "",
    });

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUser(session.user.id);

        // If we have a session and remember was set, refresh it for longer duration
        if (rememberSession) {
          supabase.auth.refreshSession({
            refresh_token: session.refresh_token,
          });
        }
      }
      setLoading(false);
    });

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      if (data) {
        setUser(data as User);
      } else {
        setUser(null);
        console.log("No user data found for ID:", userId);
      }
    } catch (error) {
      console.error("Error in fetchUser:", error);
      setUser(null);
    }
  }

  const signIn = async (
    email: string,
    password: string,
    remember: boolean = false
  ) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // If remember me is checked, we'll extend the session
    if (remember) {
      // Get the current session
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // Update the session with a longer expiry
        await supabase.auth.refreshSession({
          refresh_token: data.session.refresh_token,
        });

        // Store the session persistence preference
        localStorage.setItem("rememberSession", "true");
      }
    } else {
      // Don't remember the session
      localStorage.removeItem("rememberSession");
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    if (signUpError) throw signUpError;

    if (data.user) {
      const { error: userError } = await supabase
        .from("users")
        .insert([{ id: data.user.id, email, name, role: "customer" }]);

      if (userError) throw userError;
    }
  };

  const signOut = async () => {
    try {
      // First clear local user state
      setUser(null);

      // More comprehensive sign out approach
      const { error } = await supabase.auth.signOut({
        scope: "global", // This ensures all devices/tabs are signed out
      });

      if (error) throw error;

      // Force clear localStorage items related to Supabase auth
      localStorage.removeItem("supabase.auth.token");
      localStorage.removeItem("supabase.auth.refreshToken");
      // Don't clear the rememberSession preference anymore
      // localStorage.removeItem("rememberSession");

      // Add a small delay to ensure everything is properly cleared
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Optional: Force reload the page to ensure clean state
      window.location.href = "/";
    } catch (err) {
      console.error("Error during sign out:", err);
      // Still try to clear user state even if there was an error
      setUser(null);
    }
  };

  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff" || isAdmin;
  const isCustomer = user?.role === "customer" || !user;

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isStaff,
    isCustomer,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
