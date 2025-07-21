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

  // Harta de culori pentru fiecare tip curs
  const colorMap: Record<string, string> = {
    'Curs': '#B497BD',        // lavender
    'Laborator': '#FFD6BA',   // peach
    // poți adăuga și alte tipuri cu alte culori aici
  };

  useEffect(() => {
    const fetchDates = async () => {
      // Aici preluăm toate cursurile, nu doar datele, ca să știm tipul cursului pentru fiecare zi
      const { data, error } = await supabase
        .from('Cursuri')
        .select('Data, Tip_curs');

      if (error) {
        console.error('Eroare la citirea datelor:', error.message);
        return;
      }

      const marcate: Record<string, any> = {};

      data.forEach((item, index) => {
        if (item.Data) {
          if (!marcate[item.Data]) {
            marcate[item.Data] = { dots: [] };
          }
          // culoarea pentru tipul cursului, dacă nu există în map, punem albastru default
          const culoare = colorMap[item.Tip_curs] || 'blue';

          marcate[item.Data].dots.push({
            key: `dot-${item.Data}-${index}`,
            color: culoare,
            selectedDotColor: 'white',
          });
        }
      });

      setMarkedDates(marcate);
    };

    fetchDates();
  }, []);

  const handleDayPress = async (day: any) => {
    setSelectedDate(day.dateString);

    const { data, error } = await supabase
      .from('Cursuri')
      .select('Ora, Nume, Tip_curs, Profesor, Sala')
      .eq('Data', day.dateString);

    if (error) {
      console.error('Eroare la citirea cursurilor:', error.message);
      return;
    }

    setCursuri((data || []).map(item => ({
      ...item,
      Data: day.dateString
    })));
  };

  return (
    <View style={{ flex: 1, paddingTop: 50, backgroundColor: isDark ? '#000' : '#fff' }}>
      <Calendar
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
          calendarBackground: isDark ? '#121212' : '#ffffff',
          textSectionTitleColor: isDark ? '#cccccc' : '#2e3a59',
          dayTextColor: isDark ? '#ffffff' : '#2e3a59',
          todayTextColor: '#2196f3',
          selectedDayBackgroundColor: '#2196f3',
          selectedDayTextColor: '#ffffff',
          monthTextColor: isDark ? '#ffffff' : '#2e3a59',
          arrowColor: '#2196f3',
          textDisabledColor: '#444444',
          textMonthFontWeight: 'bold',
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
              keyExtractor={(item, index) => `${item.Data}-${item.Ora}-${item.Nume}-${index}`}
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
