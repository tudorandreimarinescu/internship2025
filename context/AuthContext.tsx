// context/AuthContext.tsx
import { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { Student, StudentCreationData } from "../models/Student";
import { StudentService } from "../models/StudentService";

// Types for clean API
export interface AuthError {
  type: 'connection' | 'validation' | 'duplicate_email' | 'auth' | 'student_creation' | 'general';
  message: string;
  shouldNavigateToLogin?: boolean;
}

export interface AuthResult {
  success: boolean;
  error?: AuthError;
  user?: User;
  student?: Student | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  group: string;
  year: string;
  specialization: string;
  email: string;
  password: string;
}

type AuthContextType = {
  // State
  session: Session | null;
  user: User | null;
  student: Student | null;
  loading: boolean;
  
  // Auth Methods
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (data: RegisterData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  
  // Student Methods
  loadStudentProfile: (email: string) => Promise<Student | null>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  student: null,
  loading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  loadStudentProfile: async () => null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [studentLoaded, setStudentLoaded] = useState(false); // Track if we've already loaded student

  const loadStudentProfile = useCallback(async (email: string): Promise<Student | null> => {
    try {
      console.log('Loading student profile for:', email);
      const studentProfile = await StudentService.getStudentByEmail(email);
      console.log('Student profile loaded:', studentProfile ? `${studentProfile.Prenume} ${studentProfile.Nume}` : 'No profile found');
      return studentProfile;
    } catch (error) {
      console.error("Error loading student profile:", error);
      return null;
    }
  }, []); // Memoize the function to prevent unnecessary recreations

  useEffect(() => {
    const init = async () => {
      console.log('AuthContext: Starting initialization...');
      try {
        const { data } = await supabase.auth.getSession();
        console.log('AuthContext: Got session data:', !!data.session);
        setSession(data.session);
        
        // If we have a session, try to load student profile
        if (data.session?.user?.email) {
          console.log('AuthContext: Loading student profile for:', data.session.user.email);
          const studentProfile = await loadStudentProfile(data.session.user.email);
          setStudent(studentProfile);
          setStudentLoaded(true);
          console.log('AuthContext: Student profile loaded:', !!studentProfile);
        }
        
        console.log('AuthContext: Setting loading to false');
        setLoading(false);
      } catch (error) {
        console.error('AuthContext: Error during initialization:', error);
        setLoading(false);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        
        if (event === 'SIGNED_OUT') {
          // Clear student data when user signs out
          setStudent(null);
          setStudentLoaded(false);
          console.log('User signed out, cleared student data');
        } else if (session?.user?.email && !studentLoaded) {
          // Load student profile when user signs in, but only if not already loaded
          const studentProfile = await loadStudentProfile(session.user.email);
          setStudent(studentProfile);
          setStudentLoaded(true);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validateYear = (year: string): boolean => {
    if (!/^\d+$/.test(year)) return false;
    const yearNum = parseInt(year);
    return yearNum >= 1 && yearNum <= 6;
  };

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    const { email, password } = credentials;

    // Input validation
    if (!email || !password) {
      return {
        success: false,
        error: {
          type: 'validation',
          message: 'Vă rugăm completați email și parolă'
        }
      };
    }

    try {
      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Authentication error:", error);
        
        if (error.message?.includes("Invalid login credentials")) {
          return {
            success: false,
            error: {
              type: 'auth',
              message: 'Email sau parolă incorecte. Verificați datele și încercați din nou.'
            }
          };
        } else if (error.message?.includes("No API key found")) {
          return {
            success: false,
            error: {
              type: 'auth',
              message: 'Problemă cu configurarea aplicației. Contactați administratorul.'
            }
          };
        } else if (error.message?.includes("400") || error.message?.includes("Bad Request")) {
          return {
            success: false,
            error: {
              type: 'auth',
              message: 'Problemă cu serverul. Încercați din nou mai târziu.'
            }
          };
        } else {
          return {
            success: false,
            error: {
              type: 'auth',
              message: error.message
            }
          };
        }
      }

      if (!data?.user) {
        return {
          success: false,
          error: {
            type: 'auth',
            message: 'Nu s-au putut încărca datele utilizatorului'
          }
        };
      }

      // Try to load student profile
      try {
        const studentProfile = await loadStudentProfile(email);
        
        if (!studentProfile) {
          console.warn("Student profile not found for:", email);
          // Still consider login successful, but note missing profile
          return {
            success: true,
            user: data.user,
            student: null
          };
        }

        console.log("Student profile loaded successfully:", studentProfile);
        return {
          success: true,
          user: data.user,
          student: studentProfile
        };
      } catch (profileError) {
        console.error("Error loading student profile:", profileError);
        // Login was successful, but profile loading failed
        return {
          success: true,
          user: data.user,
          student: null
        };
      }
    } catch (error: any) {
      console.error("Unexpected login error:", error);
      return {
        success: false,
        error: {
          type: 'general',
          message: error.message || 'A apărut o eroare la autentificare'
        }
      };
    }
  };

  const register = async (data: RegisterData): Promise<AuthResult> => {
    const { firstName, lastName, group, year, specialization, email, password } = data;

    // Input validation
    if (!firstName || !lastName || !group || !year || !specialization || !email || !password) {
      return {
        success: false,
        error: {
          type: 'validation',
          message: 'Vă rugăm completați toate câmpurile'
        }
      };
    }

    if (!validateEmail(email)) {
      return {
        success: false,
        error: {
          type: 'validation',
          message: 'Vă rugăm să introduceți un email valid'
        }
      };
    }

    if (!validatePassword(password)) {
      return {
        success: false,
        error: {
          type: 'validation',
          message: 'Parola trebuie să aibă cel puțin 6 caractere'
        }
      };
    }

    if (!validateYear(year)) {
      return {
        success: false,
        error: {
          type: 'validation',
          message: 'Anul de studiu trebuie să fie între 1 și 6'
        }
      };
    }

    try {
      // Check if student email already exists in the Student table
      console.log("Checking for existing student with email:", email);
      const studentExists = await StudentService.studentEmailExists(email);
      if (studentExists) {
        console.warn("Registration blocked: Student with email already exists:", email);
        return {
          success: false,
          error: {
            type: 'duplicate_email',
            message: 'Există deja un student înregistrat cu acest email. Încercați să vă autentificați sau folosiți un alt email.',
            shouldNavigateToLogin: true
          }
        };
      }
      console.log("No existing student found, proceeding with registration");

      // Create auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        console.error("Registration error:", authError);
        
        if (authError.message?.includes("User already registered") || 
            authError.message?.includes("already been registered") ||
            authError.message?.includes("email address is already in use") ||
            authError.message?.includes("duplicate") ||
            authError.code === "user_already_exists") {
          return {
            success: false,
            error: {
              type: 'duplicate_email',
              message: 'Există deja un cont cu acest email. Încercați să vă autentificați sau folosiți un alt email.',
              shouldNavigateToLogin: true
            }
          };
        } else if (authError.message?.includes("No API key found")) {
          return {
            success: false,
            error: {
              type: 'auth',
              message: 'Problemă cu configurarea aplicației. Contactați administratorul.'
            }
          };
        } else if (authError.message?.includes("Invalid email")) {
          return {
            success: false,
            error: {
              type: 'validation',
              message: 'Vă rugăm să introduceți un email valid.'
            }
          };
        } else if (authError.message?.includes("Password")) {
          return {
            success: false,
            error: {
              type: 'validation',
              message: 'Parola trebuie să aibă cel puțin 6 caractere.'
            }
          };
        } else {
          return {
            success: false,
            error: {
              type: 'auth',
              message: authError.message || 'A apărut o eroare la crearea contului'
            }
          };
        }
      }

      if (!authData?.user) {
        return {
          success: false,
          error: {
            type: 'auth',
            message: 'Nu s-a putut crea contul de autentificare'
          }
        };
      }

      // Create student profile
      const studentData: StudentCreationData = {
        Nume: lastName,
        Prenume: firstName,
        Grupa: group,
        An: parseInt(year),
        Specializare: specialization,
        Email: email
      };

      const student = await StudentService.createStudent(studentData);
      
      if (!student) {
        console.error("Could not create student profile");
        return {
          success: true, // Auth account was created successfully
          user: authData.user,
          student: null,
          error: {
            type: 'student_creation',
            message: 'Contul a fost creat, dar profilul de student nu a putut fi creat. Puteți încerca să vă autentificați și profilul va fi creat automat.'
          }
        };
      }

      return {
        success: true,
        user: authData.user,
        student: student
      };
    } catch (error: any) {
      console.error("Unexpected registration error:", error);
      return {
        success: false,
        error: {
          type: 'general',
          message: error.message || 'A apărut o eroare la înregistrare'
        }
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log("Starting logout process...");
      
      // Use local scope to avoid 403 errors on desktop/web
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) {
        console.error("Supabase signOut error:", error);
        // Continue with manual cleanup if server signout fails
      } else {
        console.log("Supabase signOut completed successfully");
      }
      
      // Clear local state
      setSession(null);
      setStudent(null);
      setStudentLoaded(false);
      console.log("Local state cleared");
      
    } catch (error) {
      console.error("Logout error:", error);
      // Ensure local state is cleared even if Supabase fails
      setSession(null);
      setStudent(null);
      setStudentLoaded(false);
    }
  };

  const value = {
    session,
    user: session?.user ?? null,
    student,
    loading,
    login,
    register,
    logout,
    loadStudentProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
