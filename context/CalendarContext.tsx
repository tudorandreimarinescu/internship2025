import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';


// Tipul datelor unui curs
export type Curs = {
  Data: string;
  Ora: string;
  Nume: string;
  Tip_curs: string;
  Profesor: string;
  Sala: string;
};

// Tipul contextului
type CalendarContextType = {
  markedDates: Record<string, any>;
  cursuri: Curs[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  fetchCursuriForDate: (date: string) => void;
  currentDate: string;
  handleDayPress: (day: { dateString: string }) => void;
};


const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider = ({ children }: { children: React.ReactNode }) => {
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [cursuri, setCursuri] = useState<Curs[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const currentDate = new Date().toISOString().split('T')[0];
  
  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    fetchCursuriForDate(day.dateString);
  };
  
  // Funcție pentru a genera o culoare unică pe baza numelui cursului
  const generateColorForCourse = (courseName: string): string => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF5'];
    let hash = 0;
    for (let i = 0; i < courseName.length; i++) {
      hash = courseName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  useEffect(() => {
    const fetchDates = async () => {
      const { data, error } = await supabase
        .from('Cursuri')
        .select('Data, Nume');

      if (error) {
        console.error('Eroare la citirea datelor:', error.message);
        return;
      }

      const marcate: Record<string, any> = {};
      data.forEach(item => {
        if (item.Data) {
          if (!marcate[item.Data]) {
            marcate[item.Data] = { dots: [] };
          }

          const color = generateColorForCourse(item.Nume); // Generează culoarea pentru curs

          marcate[item.Data].dots.push({
            key: `${item.Nume}`, // ID-ul cursului
            color: color, // Culoarea generată
            selectedDotColor: 'white',
          });
        }
      });

      setMarkedDates(marcate);
    };

    fetchDates();
  }, []);

  const fetchCursuriForDate = async (date: string) => {
    const { data, error } = await supabase
      .from('Cursuri')
      .select('Ora, Nume, Tip_curs, Profesor, Sala, Data')
      .eq('Data', date);

    if (error) {
      console.error('Eroare la citirea cursurilor:', error.message);
      return;
    }

    setCursuri(data || []);
  };

  return (
    <CalendarContext.Provider
      value={{ markedDates, cursuri, selectedDate, setSelectedDate, fetchCursuriForDate, currentDate, handleDayPress }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) throw new Error('useCalendar must be used within a CalendarProvider');
  return context;
};