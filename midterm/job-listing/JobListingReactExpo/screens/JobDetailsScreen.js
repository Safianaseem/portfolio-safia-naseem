import React from "react";
import { View, ScrollView } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons"; // ✅ Simplified Import

const JobDetailsScreen = ({ route, navigation }) => {
  const { job } = route.params;

  // ✅ Safe JSON parsing for qualifications
  let qualifications = [];
  try {
    qualifications = Array.isArray(job.qualifications)
      ? job.qualifications
      : JSON.parse(job.qualifications || "[]");
  } catch (error) {
    console.error("Error parsing qualifications:", error);
  }

  return (
    <ScrollView style={{ flex: 1, padding: 15, backgroundColor: "#f9f9f9" }}>
      <Card style={{ borderRadius: 12, elevation: 5, padding: 10, backgroundColor: "white" }}>
        <Card.Content>
          <Text variant="titleLarge" style={{ fontWeight: "bold", color: "#333" }}>{job.title}</Text>
          <Text variant="bodyMedium" style={{ color: "#666" }}>{job.company}</Text>

          {/* ✅ Location */}
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
            <Ionicons name="location-outline" size={20} color="gray" />
            <Text style={{ fontSize: 16, marginLeft: 5, color: "#444" }}>{job.location}</Text>
          </View>

          {/* ✅ Salary */}
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
            <Ionicons name="cash-outline" size={20} color="green" />
            <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 5, color: "green" }}>
              ${job.salary_from} - ${job.salary_to}
            </Text>
          </View>

          {/* ✅ Job Category */}
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
            <Ionicons name="briefcase-outline" size={20} color="blue" />
            <Text style={{ fontSize: 16, marginLeft: 5, color: "blue" }}>{job.job_category}</Text>
          </View>

          {/* ✅ Description Section */}
          <Text variant="titleMedium" style={{ fontWeight: "bold", marginTop: 15 }}>Description</Text>
          <Text variant="bodyMedium" style={{ color: "#444", marginTop: 5 }}>{job.description}</Text>

          {/* ✅ Qualifications */}
          <Text variant="titleMedium" style={{ fontWeight: "bold", marginTop: 15 }}>Qualifications</Text>
          {qualifications.map((qual, index) => (
            <View key={index} style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#007BFF" />
              <Text style={{ marginLeft: 8, fontSize: 16, color: "#555" }}>{qual}</Text>
            </View>
          ))}

          {/* ✅ Contact */}
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
            <Ionicons name="call-outline" size={20} color="black" />
            <Text style={{ fontSize: 16, marginLeft: 5, fontWeight: "bold" }}> {job.contact}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* ✅ Back Button */}
      <Button
        mode="contained"
        style={{ marginTop: 20, backgroundColor: "#007BFF", borderRadius: 8, paddingVertical: 6 }}
        labelStyle={{ fontSize: 16 }}
        icon="arrow-left"
        onPress={() => navigation.goBack()}
      >
        Back to Jobs
      </Button>
    </ScrollView>
  );
};

export default JobDetailsScreen;