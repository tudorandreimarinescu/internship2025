// src/context/CoursesContext.tsx
import { supabase } from '@/lib/supabase';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface Course {
  id: number;
  [key: string]: any;
}

interface CoursesContextType {
  courses: Course[];
  loading: boolean;
  refreshCourses: () => void;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

export const CoursesProvider = ({ children }: { children: React.ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCourses = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('Cursuri').select('*');
    if (error) {
      console.error('Eroare Supabase:', error.message);
    } else {
      setCourses(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <CoursesContext.Provider value={{ courses, loading, refreshCourses: fetchCourses }}>
      {children}
    </CoursesContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CoursesContext);
  if (!context) {
    throw new Error('useCourses trebuie folosit în interiorul CoursesProvider');
  }
  return context;
};
