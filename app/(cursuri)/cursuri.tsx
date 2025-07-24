import { useCourses } from '@/context/CoursesContext';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation} from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CoursesScreen() {
  const { courses, loading, loadMoreCourses, hasMore } = useCourses();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style ={styles.backButtonText}>Înapoi</Text>
        </TouchableOpacity>
      <Text style={styles.title}>Lista de cursuri</Text>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {['Nume', 'Nr_credite', 'Profesor', 'Sala', 'Tip_evaluare', 'Ora', 'Data', 'Tip_curs', 'Semestru', 'An' ].map((key) => (
              <Text key={key} style={styles.field}>
                <Text style={styles.fieldKey}>{key}:</Text> {String(item[key] || 'N/A')}
              </Text>
            ))}
          </View>
        )}
        ListFooterComponent={
          loading ? <Text style={styles.loadingText}>Se încarcă...</Text> : null
        }
        onEndReached={() => {
          if (!loading && hasMore) {
            loadMoreCourses();
          }
        }}
        onEndReachedThreshold={0.5} // la 50% de scroll de jos declanșează
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  item: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  field: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  fieldKey: {
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
});
