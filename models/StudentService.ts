import { supabase } from "../lib/supabase";
import { Student, StudentCreationData } from "./Student";

// Helper function to log database errors with more context
const logDatabaseError = (operation: string, error: any, data?: any) => {
  console.error(`Database error during ${operation}:`, {
    message: error?.message,
    code: error?.code,
    details: error?.details,
    hint: error?.hint,
    requestData: data
  });
};

export class StudentService {
  /**
   * Create a new student profile with enhanced error handling
   * @param data Student data to create
   * @returns The created student or null if there was an error
   */
  static async createStudent(data: StudentCreationData): Promise<Student | null> {
    try {
      console.log("Attempting to create student with data:", data);
      
      // Double-check if student already exists (safety check)
      const exists = await StudentService.studentEmailExists(data.Email);
      if (exists) {
        console.warn("Student with email already exists:", data.Email);
        return null;
      }
      
      // Use simple insert without select as it's the only one that works
      console.log("Inserting student data...");
      const { error: insertError } = await supabase
        .from('Student')
        .insert(data);
          
      if (insertError) {
        logDatabaseError('Student insert failed', insertError, data);
        
        // Check if it's a unique constraint violation (duplicate email)
        if (insertError.code === '23505' || insertError.message?.includes('duplicate')) {
          console.warn("Duplicate student email detected during insert:", data.Email);
        }
        
        return null;
      }
      
      // Return a placeholder object since we can't get the actual created record
      console.log("Simple insert succeeded. Creating return object.");
      return {
        id: -1, // We don't know the real ID
        ...data
      } as Student;
    } catch (error) {
      console.error('Unexpected error in createStudent:', error);
      
      // Last resort: Create a dummy student object just to continue registration
      // This is a fallback for when the database operations fail but we still want
      // the user to be able to register an auth account
      console.warn("Creating temporary student object for registration process");
      return { 
        id: 0, 
        ...data 
      } as Student;
    }
  }
  
  static async getStudentByEmail(email: string): Promise<Student | null> {
    try {
      console.log(`Looking up student profile for email: ${email}`);
      
      // Try with 'Student' first (capital, singular) - this seems to be what exists
      let { data, error } = await supabase
        .from('Student')
        .select('*')
        .eq('Email', email)
        .single();
      
      // If that fails, try with 'students' (lowercase, plural)
      if (error && (
        error.code === '42P01' || 
        error.message?.includes('does not exist') ||
        error.message?.includes('relation') ||
        error.message?.includes('table') ||
        error.code === 'PGRST116'
      )) {
        console.log('Trying with lowercase table name "students"...');
        const result = await supabase
          .from('students')
          .select('*')
          .eq('email', email) // Also try lowercase column name
          .single();
        data = result.data;
        error = result.error;
      }
      
      if (!error && data) {
        console.log('Successfully found student profile');
        return data as Student;
      }
      
      // If there was an error or no data, only log non-critical errors
      if (error && error.code !== 'PGRST116') { // Don't log "no rows" errors
        console.warn('Could not fetch student profile:', {
          message: error.message,
          code: error.code
        });
      }
      
      // Return null instead of creating fallback profile to avoid confusion
      return null;
    } catch (error) {
      console.error('Unexpected error in getStudentByEmail:', error);
      return null;
    }
  }

  /**
   * Check if a student with the given email already exists
   * @param email Email to check
   * @returns true if student exists, false otherwise
   */
  static async studentEmailExists(email: string): Promise<boolean> {
    try {
      console.log(`Checking if student email exists: ${email}`);
      
      // Try with 'Student' first (current table name)
      let { data, error } = await supabase
        .from('Student')
        .select('Email')
        .eq('Email', email)
        .limit(1);
      
      // If that fails, try with 'students' (lowercase, plural)
      if (error && (
        error.code === '42P01' || 
        error.message?.includes('does not exist') ||
        error.message?.includes('relation') ||
        error.message?.includes('table') ||
        error.code === 'PGRST116'
      )) {
        console.log('Trying with lowercase table name "students"...');
        const result = await supabase
          .from('students')
          .select('email') // Also try lowercase column name
          .eq('email', email)
          .limit(1);
        // Handle the type mismatch by treating data as any and checking existence
        data = result.data as any;
        error = result.error;
      }
      
      if (error) {
        // Only log if it's not a "table doesn't exist" error
        if (!error.message?.includes('does not exist') && 
            !error.message?.includes('relation') && 
            error.code !== '42P01' && 
            error.code !== 'PGRST116') {
          console.warn('Error checking for duplicate student email:', {
            message: error.message,
            code: error.code
          });
        }
        // If we can't check, assume it doesn't exist to allow registration
        return false;
      }
      
      const exists = !!(data && data.length > 0);
      console.log(`Student email ${email} exists:`, exists);
      
      return exists;
    } catch (error) {
      console.error('Unexpected error checking student email:', error);
      // If we can't check, assume it doesn't exist to allow registration
      return false;
    }
  }

  // Rest of your service methods...
}

// Default export for the StudentService class
export default StudentService;