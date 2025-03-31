import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, Animated 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../services/authService";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required!");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(email, password);
      console.log("✅ Login successful, token:", data.token);
      
      await AsyncStorage.setItem("token", data.token);
      navigation.replace("JobListings"); // ✅ Auto-navigate after successful login
    } catch (error) {
      Alert.alert("Login Failed", "Invalid Email Or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <TextInput 
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        placeholderTextColor="#999"
      />

      <TextInput 
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#999"
      />

      {/* ✅ Enhanced Login Button with Animation */}
      <TouchableOpacity 
        onPress={handleLogin} 
        style={[styles.button, loading && styles.buttonDisabled]} 
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      {/* ✅ Register Link */}
      <TouchableOpacity onPress={() => navigation.navigate("Register")} activeOpacity={0.7}>
        <Text style={styles.registerText}>Don't have an account? <Text style={styles.registerLink}>Register</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

// ✅ Improved Styles
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    padding: 20, 
    backgroundColor: "#f4f4f4" 
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginBottom: 5, 
    color: "#333" 
  },
  subtitle: { 
    fontSize: 16, 
    textAlign: "center", 
    color: "#666", 
    marginBottom: 20 
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ddd", 
    padding: 15, 
    borderRadius: 8, 
    backgroundColor: "#fff", 
    marginBottom: 15, 
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3
  },
  button: { 
    backgroundColor: "#007BFF", 
    paddingVertical: 15, 
    alignItems: "center", 
    borderRadius: 8, 
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5
  },
  buttonDisabled: { backgroundColor: "#a0c4ff" },
  buttonText: { 
    color: "white", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  registerText: { 
    textAlign: "center", 
    color: "#666", 
    marginTop: 15, 
    fontSize: 16 
  },
  registerLink: { 
    color: "#007BFF", 
    fontWeight: "bold" 
  }
});

