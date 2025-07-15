import { StyleSheet } from "react-native";

export const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: 220,
    height: 220,
    resizeMode: "contain",
    marginVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    color: "#3b82f6",
    fontWeight: "600",
  },
});
