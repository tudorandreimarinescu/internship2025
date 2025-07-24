import { FlatList, Text, useColorScheme, View, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useCalendar } from '../../context/CalendarContext';
import { useRouter } from 'expo-router'; // Import pentru routing

function generateColorForCourse(courseName: string): string {
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF5', '#FF8C00', '#8A2BE2'];
  let hash = 0;
  for (let i = 0; i < courseName.length; i++) {
    hash = courseName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function CalendarPage() {
  const {
    currentDate,
    markedDates,
    selectedDate,
    cursuri,
    handleDayPress,
  } = useCalendar();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const router = useRouter(); // Hook pentru routing

  const handleGoBack = () => {
    router.back(); // Use expo-router's back method
  };

  return (
    <View style={{ flex: 1, paddingTop: 50, backgroundColor: isDark ? '#000' : '#fff' }}>
      {/* Buton pentru a merge inapoi */}
      <TouchableOpacity
        onPress={handleGoBack} // Navigheaza inapoi pe home
        style={{
          padding: 10,
          backgroundColor: '#2196f3',
          borderRadius: 5,
          alignSelf: 'flex-start',
          marginLeft: 20,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Inapoi</Text>
      </TouchableOpacity>

      <Calendar
        markingType="multi-dot"
        current={currentDate}
        markedDates={{
          ...markedDates,
          ...(selectedDate
            ? {
                [selectedDate]: {
                  ...(markedDates[selectedDate] || {}),
                  selected: true,
                  selectedColor: '#2194f3',
                },
              }
            : {}),
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
          textDayHeaderFontSize: 14,
        }}
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 10,
          padding: 10,
          margin: 20,
          height: 360,
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
              keyExtractor={(_, index) => index.toString()}
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
                    elevation: 3,
                    borderLeftWidth: 5,
                    borderLeftColor: generateColorForCourse(item.Nume),
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: isDark ? '#ffffff' : '#000000',
                    }}
                  >
                    {item.Ora} - {item.Nume} ({item.Tip_curs})
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: isDark ? '#ffffff' : '#000000',
                    }}
                  >
                    Prof. {item.Profesor}, sala {item.Sala}
                  </Text>
                </View>
              )}
              style={{ maxHeight: 300 }}
              contentContainerStyle={{ paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      )}
    </View>
  );
}