// App.js
import React from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";

// Screens
import Dashboard from "./screens/Dashboard";
import AddExpense from "./screens/AddExpense";
import Transactions from "./screens/Transactions";
import Reports from "./screens/Reports";
import BudgetSettings from "./screens/BudgetSettings";
import ProfileSettings from "./screens/ProfileSettings";

const Stack = createNativeStackNavigator();

export default function App() {
  const isDark = useColorScheme() === "dark";

  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? "#1e1e1e" : "#fff",
          },
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 20,
          },
          headerTintColor: isDark ? "#fff" : "#000",
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ title: "Dashboard Overview" }} />
        <Stack.Screen name="AddExpense" component={AddExpense} options={{ title: "Add New Expense" }} />
        <Stack.Screen name="Transactions" component={Transactions} options={{ title: "All Transactions" }} />
        <Stack.Screen name="Reports" component={Reports} options={{ title: "Reports & Analytics" }} />
        <Stack.Screen name="BudgetSettings" component={BudgetSettings} options={{ title: "Budget Settings" }} />
        <Stack.Screen name="ProfileSettings" component={ProfileSettings} options={{ title: "Profile & Theme" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
