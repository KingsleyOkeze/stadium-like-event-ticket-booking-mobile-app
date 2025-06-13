import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { Link } from "expo-router";

function SignUpScreen() {
    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = async () => {
        console.log("signup function called")
        try {
            const response = await axios.post("/user/signup", {
                firstName,
                lastName,
                email,
                password
            });

            if (response.status === 201) {
                router.replace("/screens/LoginScreen");
                console.log("User account created successfully.");
            }
        } catch (err) {
            console.error("Signup error:", err);
            Alert.alert(
                "Error",
                `Error signing up! ${err.response.data.error}`,
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
            );
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Join StadiumSys 🎉</Text>
            <Text style={styles.subtitle}>Create your student account</Text>

            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <Text style={styles.bottomText}>
                Already have an account?{" "}
                <Link style={styles.link} href="/screens/LoginScreen">
                    Login
                </Link>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#fff"
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 4,
        color: "#2C3E50"
    },
    subtitle: {
        fontSize: 14,
        color: "#7f8c8d",
        marginBottom: 24
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        marginBottom: 16
    },
    button: {
        backgroundColor: "#E94E4E",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 16
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16
    },
    bottomText: {
        textAlign: "center",
        fontSize: 14,
        color: "#2c3e50"
    },
    link: {
        color: "#E94E4E",
        fontWeight: "bold"
    }
});

export default SignUpScreen;
