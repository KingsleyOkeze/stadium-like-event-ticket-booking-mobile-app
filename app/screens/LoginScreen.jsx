import { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import { useRouter, Link } from "expo-router";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext"; // adjust path as needed

function LoginScreen() {
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("/user/login", {
        email,
        password
      });

      if (response.status === 200) {
        const { token, userId, firstName, lastName } = response.data;

        // Save to context + AsyncStorage
        await login({ token, userId, email, firstName, lastName });

        router.replace("/tabs/Home"); // or "/tabs" depending on your setup
      }
    } catch (error) {
      console.error("Login request error:", error.request);
      console.error("Login response error:", error.response?.data.error);
      Alert.alert(
        "Login Failed",
        error.response?.data?.error || "Something went wrong.",
        [{ text: "OK" }],
        { cancelable: true }
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.bottomText}>
        Don’t have an account?{" "}
        <Link style={styles.link} href="/screens/SignUpScreen">
          Sign up
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

export default LoginScreen;
