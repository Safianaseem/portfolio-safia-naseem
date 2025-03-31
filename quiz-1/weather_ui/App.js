import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

export default function WeatherApp() {
  const [city, setCity] = useState("Islamabad");

  const getWeatherIcon = (description) => {
    switch (description) {
      case "Clear":
        return <Ionicons name="sunny" size={60} color="#FFA726" />;
      case "Rain":
        return <MaterialCommunityIcons name="weather-rainy" size={60} color="#42A5F5" />;
      case "Clouds":
        return <FontAwesome5 name="cloud" size={60} color="#90A4AE" />;
      case "Snow":
        return <MaterialCommunityIcons name="weather-snowy" size={60} color="#B3E5FC" />;
      case "Thunderstorm":
        return <Ionicons name="thunderstorm" size={60} color="#FF7043" />;
      case "Drizzle":
        return <MaterialCommunityIcons name="weather-partly-rainy" size={60} color="#64B5F6" />;
      case "Mist":
      case "Haze":
      case "Fog":
        return <MaterialCommunityIcons name="weather-fog" size={60} color="#B0BEC5" />;
      default:
        return <Ionicons name="partly-sunny" size={60} color="#FFD54F" />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Weather App</Text>
        <TextInput
          value={city}
          onChangeText={setCity}
          placeholder="Enter city name"
          style={styles.input}
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Get Weather</Text>
        </TouchableOpacity>

        <View style={styles.weatherContainer}>
          <Text style={styles.cityName}>{city}</Text>
          {getWeatherIcon("Clear")}
          <Text style={styles.temp}>25°C</Text>
          <Text style={styles.description}>Clear</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#E0F7FA",
  },
  card: {
    width: "100%",
    maxWidth: 350,
    padding: 24,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 12,
  },
  button: {
    width: "100%",
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  weatherContainer: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F1F8E9",
    borderRadius: 15,
    width: "100%",
  },
  cityName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  temp: {
    fontSize: 36,
    fontWeight: "bold",
    marginVertical: 8,
  },
  description: {
    fontSize: 18,
    textTransform: "capitalize",
    marginTop: 4,
  },
});
