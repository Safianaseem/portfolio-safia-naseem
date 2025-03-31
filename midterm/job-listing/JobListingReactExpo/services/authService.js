import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "http://192.168.10.12:5000/api/auth";

export const registerUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, password });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Registration failed:", error.response?.data || error.message);

    // ✅ Return error message instead of throwing
    return { success: false, message: error.response?.data?.message || "Registration failed" };
  }
};

  
export const loginUser = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/login`, { email, password });
      await AsyncStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };
  

export const logoutUser = async () => {
  await AsyncStorage.removeItem("token");
};

export const getToken = async () => {
    const token = await AsyncStorage.getItem("token");
    console.log("Retrieved token from AsyncStorage:", token);
    return token;
  };
  