import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

type Student = {
  Nume: string;
  Prenume: string;
  Grupa: string;
  An: number;
  Specializare: string;
  Email: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificare user + redirect dacă nu e logat
  useEffect(() => {
    console.log("🚀 [authLoading]:", authLoading);
    console.log("👤 [user]:", user);

    if (!authLoading && !user) {
      console.log("🔁 Redirect spre /login");
      router.replace("/login");
    }
  }, [user, authLoading]);

  // Fetch student după email
  useEffect(() => {
    if (user?.email) {
      fetchStudentData(user.email);
    }
  }, [user]);

  const fetchStudentData = async (email: string) => {
    console.log("📡 Căutăm student cu email:", email);

    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("Email", email)
      .single();

    if (error) {
      console.error("❌ Eroare la fetch:", error.message);
      Alert.alert("Eroare", "Datele studentului nu au putut fi preluate.");
    } else {
      console.log("✅ Student găsit:", data);
      setStudent(data);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (authLoading || loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {student ? (
        <>
          <Text style={styles.title}>
            Salut, {student.Prenume} {student.Nume}!
          </Text>
          <Text style={styles.subtitle}>Email: {student.Email}</Text>
          <Text style={styles.subtitle}>An: {student.An}</Text>
          <Text style={styles.subtitle}>
            Specializare: {student.Specializare}
          </Text>
          <Text style={styles.subtitle}>Grupă: {student.Grupa}</Text>
        </>
      ) : (
        <Text style={styles.subtitle}>Nu s-au găsit date despre student.</Text>
      )}

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 14, marginBottom: 5 },
  logout: {
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutText: { color: "#fff", fontWeight: "bold" },
});
