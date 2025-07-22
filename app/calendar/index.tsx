import React, { useEffect, useState } from 'react';
import { FlatList, Text, useColorScheme, View, TouchableOpacity, Alert, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSupabase } from '../../context/SupabaseProvider';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

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
  const [allCursuri, setAllCursuri] = useState<Curs[]>([]); // Cache all courses data
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const current = new Date().toISOString().split('T')[0];
  const supabase = useSupabase();
  const { logout, user } = useAuth();
  const router = useRouter();

  const performLogout = async () => {
    try {
      console.log("Logout button pressed, starting logout...");
      await logout();
      console.log("Logout completed, navigating to login...");
      
      // Navigate immediately after logout
      router.replace("/");
      console.log("Navigation completed");
    } catch (error) {
      console.error("Error during logout:", error);
      // Force navigation even if logout fails
      router.replace("/");
    }
  };

  const handleLogout = () => {
    // For web/desktop, use confirm dialog as fallback
    if (Platform.OS === 'web') {
      const confirmed = confirm("Sigur doriți să vă deconectați?");
      if (confirmed) {
        performLogout();
      }
    } else {
      // For mobile, use native Alert
      Alert.alert(
        "Logout",
        "Sigur doriți să vă deconectați?",
        [
          {
            text: "Anulează",
            style: "cancel"
          },
          {
            text: "Logout",
            style: "destructive",
            onPress: performLogout
          }
        ],
        { cancelable: true } // Allow closing by clicking outside on desktop
      );
    }
  };

  // Harta de culori pentru fiecare tip curs
  const colorMap: Record<string, string> = {
    'Curs': '#B497BD',        // lavender
    'Laborator': '#FFD6BA',   // peach
    // poți adăuga și alte tipuri cu alte culori aici
  };

  useEffect(() => {
    const fetchAllCourses = async () => {
      if (isLoading) return; // Prevent multiple simultaneous requests
      
      setIsLoading(true);
      console.log('Fetching all courses data...');
      
      try {
        // Fetch all course data once
        const { data, error } = await supabase
          .from('Cursuri')
          .select('Data, Ora, Nume, Tip_curs, Profesor, Sala');

        if (error) {
          console.error('Eroare la citirea datelor:', error.message);
          return;
        }

        if (data) {
          setAllCursuri(data);
          
          // Build marked dates from all data
          const marcate: Record<string, any> = {};
          data.forEach((item, index) => {
            if (item.Data) {
              if (!marcate[item.Data]) {
                marcate[item.Data] = { dots: [] };
              }
              const culoare = colorMap[item.Tip_curs] || 'blue';
              marcate[item.Data].dots.push({
                key: `dot-${item.Data}-${index}`,
                color: culoare,
                selectedDotColor: 'white',
              });
            }
          });

          setMarkedDates(marcate);
          console.log('Course data loaded and calendar marked');
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllCourses();
  }, []); // Only run once on component mount

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    
    // Filter from cached data instead of making a new database call
    const cursuriPentruZi = allCursuri.filter(curs => curs.Data === day.dateString);
    setCursuri(cursuriPentruZi);
    
    if (cursuriPentruZi.length > 0) {
      console.log(`Found ${cursuriPentruZi.length} courses for ${day.dateString}`);
    } else {
      console.log(`No courses found for ${day.dateString}`);
    }
  };

  return (
    <View style={{ flex: 1, paddingTop: 50, backgroundColor: isDark ? '#000' : '#fff' }}>
      {/* Header with logout button */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        paddingBottom: 10 
      }}>
        <Text style={{ 
          fontSize: 20, 
          fontWeight: 'bold', 
          color: isDark ? '#fff' : '#000' 
        }}>
          Calendar
        </Text>
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: '#ff4444',
            paddingHorizontal: 15,
            paddingVertical: 8,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Logout</Text>
        </TouchableOpacity>
      </View>

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
