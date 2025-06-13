import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";


function SuccessPaymentScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.emoji}>🎉</Text>
            <Text style={styles.title}>Ticket Booked Successfully!</Text>
            <Text style={styles.subtitle}>You can now view your ticket in your ticket list.</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.replace("/tabs/MyTickets")}
            >
                <Text style={styles.buttonText}>
                    Go to My Tickets
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.replace("/tabs/Home")}
                style={[styles.button, styles.outlinedBtn]}
            >
                <Text style={styles.outlinedText}>
                    Back to Home
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20, backgroundColor: "#fff" },
    emoji: { fontSize: 80, marginBottom: 24 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, color: "#2c3e50", textAlign: "center" },
    subtitle: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 30 },
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



export default SuccessPaymentScreen;