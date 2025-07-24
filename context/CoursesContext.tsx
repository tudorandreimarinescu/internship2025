// src/context/CoursesContext.tsx
import { supabase } from '@/lib/supabase';
import React, { createContext, useContext, useEffect, useState } from 'react';

type CoursesProviderProps = {
  children: React.ReactNode;
  studentYear: number | undefined;
};

interface Course {
  id: number;
  title: string;
  description: string;
  teacher: string;
  duration: number;
  [key: string]: any;
}

interface CoursesContextType {
  courses: Course[];
  loading: boolean;
  loadMoreCourses: () => void;
  refreshCourses: () => void;
  hasMore: boolean;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

const PAGE_SIZE = 5;

export const CoursesProvider = ({ children, studentYear }: CoursesProviderProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchCourses = async (pageIndex: number) => {
    setLoading(true);
    const from = pageIndex * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error, count } = await supabase
      .from('Cursuri')
      .select('*', { count: 'exact' })
      .range(from, to);

    if (error) {
      console.error('Eroare Supabase:', error.message);
    } else {
      const filteredCourses = data.filter((item) => item.An === studentYear);
      // if (pageIndex === 0) {
      //   setCourses(filteredCourses || []);
      // } else {
        setCourses((prev) => [...prev, ...(filteredCourses || [])]);
      // }

      const totalCount = count ?? 0;
      const loadedCount = (pageIndex + 1) * PAGE_SIZE;
      setHasMore(loadedCount < totalCount);

      // ✅ Doar după succes, actualizăm pagina
      setPage(pageIndex);
    }

    setLoading(false);
  };

  const loadMoreCourses = () => {
    if (!loading && hasMore) {
      fetchCourses(page + 1);
    }
  };

  const refreshCourses = () => {
    setCourses([]);
    setHasMore(true);
    setPage(0);
    fetchCourses(0);
  };

  useEffect(() => {
    fetchCourses(0);
  }, []);

  return (
    <CoursesContext.Provider
      value={{ courses, loading, loadMoreCourses, refreshCourses, hasMore }}
    >
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
