import {
  FlatList,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useCalendar } from '@/context/CalendarContext';
import { useRouter } from 'expo-router';

function generateColorForCourse(courseName: string): string {
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF5', '#FF8C00', '#8A2BE2'];
  let hash = 0;
  for (let i = 0; i < courseName.length; i++) {
    hash = courseName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function CalendarPage() {
  const { currentDate, markedDates, selectedDate, cursuri, handleDayPress } = useCalendar();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#000' : '#fff', paddingTop: 50, paddingHorizontal: 20 }}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 10 }}>
        <Text style={{ color: '#2196f3', fontSize: 16 }}>← Înapoi</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 24, fontWeight: 'bold', color: isDark ? '#fff' : '#000', textAlign: 'center', marginBottom: 20 }}>
        Calendar Cursuri
      </Text>

      <Calendar
        markingType="multi-dot"
        current={currentDate}
        markedDates={{
          ...markedDates,
          ...(selectedDate ? {
            [selectedDate]: {
              ...(markedDates[selectedDate] || {}),
              selected: true,
              selectedColor: '#2196f3',
            }
          } : {})
        }}
        onDayPress={handleDayPress}
        theme={{
          calendarBackground: isDark ? '#121212' : '#ffffff',
          dayTextColor: isDark ? '#ffffff' : '#000',
          todayTextColor: '#2196f3',
          selectedDayBackgroundColor: '#2196f3',
          selectedDayTextColor: '#ffffff',
          monthTextColor: isDark ? '#ffffff' : '#000',
          arrowColor: '#2196f3',
          textDisabledColor: '#555',
        }}
        style={{
          borderRadius: 10,
          marginBottom: 20,
        }}
      />

      {selectedDate !== '' && (
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: isDark ? '#fff' : '#000' }}>
            Cursuri pentru {selectedDate}:
          </Text>

          {cursuri.length === 0 ? (
            <Text style={{ color: 'gray' }}>Nu există cursuri în această zi.</Text>
          ) : (
            <FlatList
              data={cursuri}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <View
                  style={{
                    backgroundColor: isDark ? '#1e1e1e' : '#f0f0f0',
                    padding: 12,
                    borderRadius: 10,
                    borderLeftWidth: 5,
                    borderLeftColor: generateColorForCourse(item.Nume),
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '600', color: isDark ? '#fff' : '#000' }}>
                    {item.Ora} - {item.Nume} ({item.Tip_curs})
                  </Text>
                  <Text style={{ fontSize: 14, color: isDark ? '#ccc' : '#333' }}>
                    Prof. {item.Profesor}, sala {item.Sala}
                  </Text>
                </View>
              )}
              style={{ maxHeight: 300 }}
              contentContainerStyle={{ paddingBottom: 50 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      )}
    </View>
  );
}
