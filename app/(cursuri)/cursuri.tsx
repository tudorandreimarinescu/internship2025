import { useCourses } from '@/context/CoursesContext';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from 'expo-router';

export default function CoursesScreen() {
  const { courses, loading, loadMoreCourses, hasMore } = useCourses();
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={[styles.backButtonText, { color: '#2196f3' }]}>← Înapoi</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
        Lista de cursuri
      </Text>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        renderItem={({ item }) => (
          <View style={[styles.item, { backgroundColor: isDark ? '#1e1e1e' : '#f9f9f9' }]}>
            {[
              'Nume',
              'Nr_credite',
              'Profesor',
              'Sala',
              'Tip_evaluare',
              'Ora',
              'Data',
              'Tip_curs',
              'Semestru',
              'An',
            ].map((key) => (
              <Text
                key={key}
                style={{
                  fontSize: 14,
                  marginBottom: 3,
                  color: isDark ? '#ccc' : '#333',
                }}
              >
                <Text style={{ fontWeight: 'bold' }}>{key}:</Text> {String(item[key] || 'N/A')}
              </Text>
            ))}
          </View>
        )}
        ListFooterComponent={
          loading ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator size="small" color="#2196f3" />
              <Text style={{ textAlign: 'center', color: isDark ? '#888' : '#555', marginTop: 8 }}>
                Se încarcă...
              </Text>
            </View>
          ) : null
        }
        onEndReached={() => {
          if (!loading && hasMore) {
            loadMoreCourses();
          }
        }}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  item: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
  },
});
