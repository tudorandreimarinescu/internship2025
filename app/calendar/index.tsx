import React, { useEffect, useState } from 'react';
import { FlatList, Text, useColorScheme, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSupabase } from '../../context/SupabaseProvider';

// tip  pentru cursuri, astea se afiseaza în calendar si sunt afisate din baza de date
type Curs = {
  Data: string;
  Ora: string;
  Nume: string;
  Tip_curs: string;
  Profesor: string;
  Sala: string;
};

export default function CalendarPage() {
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [cursuri, setCursuri] = useState<Curs[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const current = new Date().toISOString().split('T')[0];
  const supabase = useSupabase();

  useEffect(() => {
    const fetchDates = async () => {
      const { data, error } = await supabase // citeste toate datele din tabelul Cursuri
        .from('Cursuri')
        .select('Data');

      if (error) {
        console.error('Eroare la citirea datelor:', error.message); // verifica in console din f12
        return;
      }

      const marcate: Record<string, any> = {}; //constanta marcate ii pentru a marca zilele cu cursuri
      data.forEach((item, index) => {
        if (item.Data) {
            if (!marcate[item.Data]) {
                marcate[item.Data] = { dots: [] };
            }

            marcate[item.Data].dots.push({
            key: `dot-${item.Data}-${index}`, // Fixed: use index to ensure unique keys
            color: 'blue', // course.color pe viitor
            selectedDotColor: 'white'
        });
        }
        
      });

      setMarkedDates(marcate);
    };

    fetchDates();
  }, []);

  // cand apas pe o zi, se afiseaza mai jos datele din ziua aia 
  const handleDayPress = async (day: any) => {
    setSelectedDate(day.dateString);

    const { data, error } = await supabase
      .from('Cursuri')
      .select('Ora, Nume, Tip_curs, Profesor, Sala') // bag toate coloanele necesare
      .eq('Data', day.dateString); // si le filtrez dupa 'Data'

    if (error) {
      console.error('Eroare la citirea cursurilor:', error.message); // aci ii bai daca mai vad asta....
      return;
    }

    setCursuri((data || []).map(item => ({ 
      ...item, // adaug toate datele din baza de date
      Data: day.dateString // aici am adaugat Data pentru a avea context, daca nu p 
    })));
  };

  return (
    <View style={{ flex: 1, paddingTop: 50, backgroundColor: isDark ? '#000' : '#fff' }}> 
      <Calendar //stilul calendarului, se poate modifica daca nu plake
        markingType="multi-dot"
        current={current}
        markedDates={{
          ...markedDates,
          ...(selectedDate ? {
            [selectedDate]: {
              ...(markedDates[selectedDate] || {}),
              selected: true,
              selectedColor: '#2194f3'
            }
          } : {})
        }}
        onDayPress={handleDayPress}
        theme={{
          calendarBackground: isDark ? '#121212' : '#ffffff', // fundalul calendarului, si se si verifica daca e dark
          textSectionTitleColor: isDark ? '#cccccc' : '#2e3a59',// culoarea titlului secțiunii, aka Luna
          dayTextColor: isDark ? '#ffffff' : '#2e3a59',// culoarea textului zilei
          todayTextColor: '#2196f3',// culoarea textului zilei de azi
          selectedDayBackgroundColor: '#2196f3',// culoarea fundalului zilei selectate
          selectedDayTextColor: '#ffffff',// culoarea textului zilei selectate
          monthTextColor: isDark ? '#ffffff' : '#2e3a59', // culoarea textului lunii
          arrowColor: '#2196f3',// culoarea săgeților de navigare, aia de acol dincolt
          textDisabledColor: '#444444',// culoarea textului zilelor dezactivate, inca n-avem da mai vedem
          textMonthFontWeight: 'bold', //textul lunii cu bold sa se vada 
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14
        }}
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 10,
          padding: 10,
          margin: 20,
          height: 360
        }}
      />

      {/* lista de sub calendar cu cursuri daca am selectat o zi */}
      {selectedDate !== '' && (
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Cursuri pentru {selectedDate}:
          </Text>

          {cursuri.length === 0 ? (
            <Text style={{ color: 'gray' }}>Nu exista cursuri în aceasta zi.</Text>
          ) : (
            <FlatList
              data={cursuri}
              keyExtractor={(item, index) => `${item.Data}-${item.Ora}-${item.Nume}-${index}`}//More unique key combining multiple fields
              renderItem={({ item }) => (
                <View
                  style={{
                    backgroundColor: isDark ? '#1e1e1e' : '#f0f0f0',
                    padding: 12,
                    borderRadius: 10,
                    borderColor: isDark ? '#444' : '#ccc',
                    borderWidth: 1,
                    marginBottom: 10,
                    shadowColor: isDark ? '#000' : '#aaa',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 3
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '600', color: isDark ? '#ffffff' : '#000000' }}>
                    {item.Ora} - {item.Nume} ({item.Tip_curs})
                  </Text>
                  <Text style={{ fontSize: 14, color: isDark ? '#cccccc' : '#333333' }}>
                    Prof. {item.Profesor}, sala {item.Sala}
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
}
