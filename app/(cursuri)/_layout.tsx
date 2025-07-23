import { CoursesProvider } from '@/context/CoursesContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { useAuth } from '@/context/AuthContext';

function CourseProviderWithStudent({children}: {children: React.ReactNode}) {
  const {student} = useAuth();
  const studentYear = student?.An;
  return (
    <CoursesProvider studentYear={studentYear}>
      {children}
    </CoursesProvider>
  )
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <CourseProviderWithStudent>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            display: 'none',
          },
        }}
      />
    </CourseProviderWithStudent>
  );
}
