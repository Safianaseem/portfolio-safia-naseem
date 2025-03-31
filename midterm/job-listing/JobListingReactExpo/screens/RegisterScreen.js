import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet 
} from "react-native";
import { registerUser } from "../services/authService";
import { useNavigation } from "@react-navigation/native";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors] = useState({ name: "", email: "", password: "" });

  const navigation = useNavigation();

  // ✅ Function to validate form fields
  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
  
    setLoading(true);
    try {
      const result = await registerUser(email.trim(), password, name.trim());
  
      if (!result.success) {
        Alert.alert("Registration Failed", result.message); // ✅ Show only message
        return;
      }
  
      Alert.alert("Success", "Account created! You can now log in.");
      navigation.replace("Login");
    } catch (error) {
      console.error("Unexpected error:", error);
      Alert.alert("Registration Failed", "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {/* ✅ Full Name Input */}
      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={[styles.input, errors.name ? styles.inputError : null]}
      />
      {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

      {/* ✅ Email Input */}
      <TextInput
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={[styles.input, errors.email ? styles.inputError : null]}
      />
      {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

      {/* ✅ Password Input */}
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.input, errors.password ? styles.inputError : null]}
      />
      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

      {/* ✅ Register Button */}
      <TouchableOpacity 
        onPress={handleRegister} 
        style={styles.button} 
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
      </TouchableOpacity>

      {/* ✅ Navigate to Login */}
      <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.loginTextContainer}>
        <Text style={styles.loginText}>Already have an account? <Text style={{ color: "#007BFF" }}>Login</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

// ✅ Improved Styles
const styles = StyleSheet.create({
  container: { 
    flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f8f9fa" 
  },
  title: { 
    fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 25, color: "#333" 
  },
  input: { 
    borderWidth: 1, borderColor: "#ccc", padding: 12, 
    marginBottom: 10, borderRadius: 8, backgroundColor: "#fff" 
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  button: { 
    backgroundColor: "#28A745", padding: 15, alignItems: "center", 
    borderRadius: 8, marginTop: 10 
  },
  buttonText: { 
    color: "white", fontSize: 16, fontWeight: "bold" 
  },
  loginTextContainer: { 
    marginTop: 20 
  },
  loginText: { 
    textAlign: "center", fontSize: 14, color: "#333" 
  },
});

export default RegisterScreen;
