import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import FeedScreen from './screens/FeedScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChatScreen from './screens/ChatScreen';
import NotificationsScreen from './screens/NotificationsScreen'; // <-- New Screen

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        {/* Login Screen - No Header */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Signup Screen - No Header */}
        <Stack.Screen name="Signup" component={SignupScreen} />

        {/* Feed Screen - No Header */}
        <Stack.Screen name="Feed" component={FeedScreen} />

        {/* Profile Screen - Show Header with Back Arrow */}
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={({ route }) => ({
            headerShown: true,
            title: route.params?.user ? `${route.params.user}'s Profile` : 'Profile',
            headerStyle: {
              backgroundColor: '#6200EE',
            },
            headerTintColor: '#fff',
          })}
        />

        {/* Chat Screen - Show Header with Back Arrow */}
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({ route }) => ({
            headerShown: true,
            title: `Chat with ${route.params?.user}`,
            headerStyle: {
              backgroundColor: '#6200EE',
            },
            headerTintColor: '#fff',
          })}
        />

        {/* Notifications Screen - Show Header with Back Arrow */}
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            headerShown: true,
            title: 'Notifications',
            headerStyle: {
              backgroundColor: '#6200EE',
            },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
