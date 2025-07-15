import { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../lib/supabase";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  handleLogin: (email: string, password: string) => Promise<boolean>;
  handleRegister: (email: string, password: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  handleLogin: async () => false,
  handleRegister: async () => false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Login failed", error.message);
      return false;
    }

    return true;
  };

  const handleRegister = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      Alert.alert("Registration failed", error.message);
      return false;
    }

    Alert.alert("Success", "Check your email to confirm your account.");
    return true;
  };

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    handleLogin,
    handleRegister,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
