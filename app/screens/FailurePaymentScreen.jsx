import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

function FailurePaymentScreen() {
  const router = useRouter();
  const { message } = useLocalSearchParams(); // 👈 get the passed message

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>😞</Text>
      <Text style={styles.title}>Booking Failed</Text>
      <Text style={styles.subtitle}>
        {message || "Something went wrong while trying to book this event. Please try again."}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace("/tabs/Home")}
        style={[styles.button, styles.outlinedBtn]}
      >
        <Text style={styles.outlinedText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20, backgroundColor: "#fff" },
    emoji: { fontSize: 80, marginBottom: 24 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, color: "#e74c3c", textAlign: "center" },
    subtitle: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginBottom: 30,
        paddingHorizontal: 10,
        lineHeight: 20,
    },

    button: {
        backgroundColor: "#E94E4E",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginBottom: 12,
        width: "80%",
        alignItems: "center"
    },
    buttonText: { color: "#fff", fontWeight: "bold" },
    outlinedBtn: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E94E4E"
    },
    outlinedText: {
        color: "#E94E4E",
        fontWeight: "bold"
    }
});


export default FailurePaymentScreen;