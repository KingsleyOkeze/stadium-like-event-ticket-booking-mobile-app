import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AuthContext } from "../contexts/AuthContext";

function ProfileScreen() {
    const { user, logout } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>👤 My Profile</Text>

            <View style={styles.body}>
                {user ? (
                    <View style={styles.card}>
                        <Text style={styles.label}>Full Name</Text>
                        <Text style={styles.value}>
                            {user.firstName || "N/A"} {user.lastName || ""}
                        </Text>

                        <Text style={styles.label}>Email</Text>
                        <Text style={styles.value}>{user.email || "N/A"}</Text>

                        <Text style={styles.label}>ID</Text>
                        <Text style={styles.value}>{user._id || "N/A"}</Text>
                    </View>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyEmoji}>🤷‍♂️</Text>
                        <Text style={styles.emptyText}>No user data available</Text>
                        <Text style={styles.emptySubText}>Please log in again if this persists</Text>
                    </View>
                )}

                <View style={styles.logoutWrapper}>
                    <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff"
    },
    heading: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#2c3e50",
        textAlign: "center",
        marginTop: 20,
        marginBottom: 20
    },
    body: {
        flex: 1,
        justifyContent: "space-between"
    },
    card: {
        backgroundColor: "#f9f9f9",
        padding: 20,
        borderRadius: 10,
        elevation: 1,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
    },
    label: {
        fontSize: 13,
        color: "#888",
        marginTop: 12
    },
    value: {
        fontSize: 16,
        fontWeight: "500",
        color: "#34495e"
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        marginTop: 50
    },
    emptyEmoji: {
        fontSize: 60,
        marginBottom: 10
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#2c3e50",
        marginBottom: 4
    },
    emptySubText: {
        fontSize: 14,
        color: "#888",
        textAlign: "center"
    },
    logoutWrapper: {
        marginTop: 30,
        marginBottom: 10
    },
    logoutBtn: {
        backgroundColor: "#d33b3b",  // Matches admin web app button hover tone
        padding: 14,
        borderRadius: 8,
        alignItems: "center"
    },
    logoutText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16
    }
});

export default ProfileScreen;
