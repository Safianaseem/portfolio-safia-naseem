import React, { useEffect, useState } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl 
} from "react-native";
import { fetchJobs } from "../services/jobService";
import { logoutUser } from "../services/authService";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // ✅ Import Icons

const JobListingsScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const jobData = await fetchJobs();
      setJobs(jobData);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Pull-to-Refresh Logic
  const onRefresh = async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
  };

  // ✅ Handle Logout with Alert
  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Yes", 
        onPress: async () => {
          await logoutUser();
          navigation.replace("Login");
        } 
      }
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* ✅ Stylish Header */}
      <View style={{ 
        flexDirection: "row", justifyContent: "space-between", 
        alignItems: "center", padding: 15, backgroundColor: "#007BFF" 
      }}>
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "white" }}>Job Listings</Text>
        <TouchableOpacity onPress={handleLogout} style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text style={{ color: "white", fontSize: 16, marginLeft: 5 }}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }} />
      ) : jobs.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Ionicons name="briefcase-outline" size={50} color="gray" />
          <Text style={{ fontSize: 18, marginTop: 10, color: "gray" }}>No jobs available</Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(job) => job.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("JobDetails", { job: item })}
              style={{
                padding: 15,
                backgroundColor: "white",
                marginHorizontal: 15,
                marginVertical: 7,
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
                elevation: 3, // ✅ Shadow for Android
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>{item.title}</Text>
              <Text style={{ color: "#666", marginTop: 5 }}>{item.company}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default JobListingsScreen;