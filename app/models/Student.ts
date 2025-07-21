/**
 * Student model representing the students table in Supabase
 * Based on the actual table structure
 */
export interface Student {
  id: number;            // int8 in the database
  Nume: string;          // TEXT
  Prenume: string;       // TEXT
  Grupa: string;         // TEXT
  An: number;            // int4
  Specializare: string;  // TEXT
  Email: string;         // TEXT
}

/**
 * Student creation data - fields needed when creating a new student record
 * (excludes id which is auto-generated)
 */
export interface StudentCreationData {
  Nume: string;          // Last name
  Prenume: string;       // First name
  Grupa: string;         // Group
  An: number;            // Year
  Specializare: string;  // Specialization
  Email: string;         // Email
}
