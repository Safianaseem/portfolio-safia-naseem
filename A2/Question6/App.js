import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Sample categories and movie data
const categories = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Drama' },
  { id: 3, name: 'Sci-Fi' },
  { id: 4, name: 'Animation' },
];

const moviesData = [
  { id: 1, title: 'Avengers: Endgame', image: 'https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg', category: 'Action' },
  { id: 2, title: 'Inception', image: 'https://upload.wikimedia.org/wikipedia/en/7/7f/Inception_ver3.jpg', category: 'Sci-Fi' },
  { id: 3, title: 'The Dark Knight', image: 'https://upload.wikimedia.org/wikipedia/en/8/8a/Dark_Knight.jpg', category: 'Action' },
  { id: 4, title: 'The Matrix', image: 'https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg', category: 'Sci-Fi' },
  { id: 5, title: 'The Lion King', image: 'https://upload.wikimedia.org/wikipedia/en/a/a7/The_Lion_King_2019_film_poster.jpg', category: 'Animation' },
  { id: 6, title: 'Titanic', image: 'https://upload.wikimedia.org/wikipedia/en/2/22/Titanic_poster.jpg', category: 'Drama' },
  { id: 7, title: 'Jurassic Park', image: 'https://upload.wikimedia.org/wikipedia/en/e/e7/Jurassic_Park_poster.jpg', category: 'Action' },
  { id: 8, title: 'Spider-Man: No Way Home', image: 'https://upload.wikimedia.org/wikipedia/en/c/cd/Spider-Man_No_Way_Home_poster.jpg', category: 'Action' },
  { id: 9, title: 'Star Wars: The Force Awakens', image: 'https://upload.wikimedia.org/wikipedia/en/7/7d/Star_Wars_The_Force_Awakens_poster.jpg', category: 'Sci-Fi' },
  { id: 10, title: 'The Godfather', image: 'https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg', category: 'Drama' },
];

// Create a Stack Navigator for navigating between screens
const Stack = createStackNavigator();

// HomeScreen with Categories and Movies
function HomeScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  const filteredMovies = selectedCategory
    ? moviesData.filter(movie => movie.category === selectedCategory)
    : moviesData;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === item.name && styles.categoryButtonSelected,
            ]}
            onPress={() => handleCategoryPress(item.name)}
          >
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <Text style={styles.title}>Movies</Text>
      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.movieCard}
            onPress={() => navigation.navigate('MovieDetails', { movie: item })}
          >
            <Image source={{ uri: item.image }} style={styles.movieImage} />
            <Text style={styles.movieTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}

// MovieDetailsScreen to show movie details
function MovieDetailsScreen({ route, navigation }) {
  const { movie } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: movie.image }} style={styles.moviePosterLarge} />
      <Text style={styles.movieTitleLarge}>{movie.title}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('SeatSelection', { movie })}
        style={styles.bookButton}
      >
        <Text style={styles.bookButtonText}>Book Now 🎟</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// SeatSelectionScreen to select seats
function SeatSelectionScreen({ route, navigation }) {
  const { movie } = route.params;
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const fetchSeats = async () => {
      const fetchedSeats = Array(40).fill(0);
      fetchedSeats[2] = 1;
      fetchedSeats[5] = 1;
      fetchedSeats[18] = 1;
      setSeats(fetchedSeats);
    };

    fetchSeats();
  }, []);

  const toggleSeat = (index) => {
    if (seats[index] === 1) return;
    if (selectedSeats.includes(index)) {
      setSelectedSeats(selectedSeats.filter((i) => i !== index));
    } else {
      setSelectedSeats([...selectedSeats, index]);
    }
  };

  const confirmBooking = async () => {
    try {
      Alert.alert('Success', `You have successfully booked ${selectedSeats.length} seat(s)!`);
      navigation.navigate('MyBookings');
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.movieTitleLarge}>Select Your Seats for {movie.title}</Text>
      <View style={styles.seatGrid}>
        {seats.map((seat, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.seat,
              seat === 1
                ? styles.seatBooked
                : selectedSeats.includes(index)
                ? styles.seatSelected
                : styles.seatAvailable,
            ]}
            onPress={() => toggleSeat(index)}
          >
            <Text style={styles.seatText}>{index + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity onPress={confirmBooking} style={styles.bookButton}>
        <Text style={styles.bookButtonText}>Confirm Selection ✅</Text>
      </TouchableOpacity>
    </View>
  );
}

// MyBookingsScreen to show booking history
function MyBookingsScreen() {
  return (
    <View style={styles.centered}>
      <Text>No Bookings Yet</Text>
    </View>
  );
}

// App component with navigation
export default function App() {
  const [bookings, setBookings] = useState([]);

  const saveBooking = (movie, seats) => {
    const newBooking = { movie, seats };
    setBookings([...bookings, newBooking]);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} />
        <Stack.Screen
          name="SeatSelection"
          component={(props) => <SeatSelectionScreen {...props} />}
        />
        <Stack.Screen name="MyBookings">
          {(props) => <MyBookingsScreen {...props} bookings={bookings} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 20 },
  categoryButton: {
    marginRight: 15,
    padding: 10,
    backgroundColor: '#dfe6e9',
    borderRadius: 8,
  },
  categoryButtonSelected: { backgroundColor: '#0984e3' },
  categoryText: { fontSize: 18, color: '#2d3436' },
  movieCard: { marginBottom: 20, alignItems: 'center' },
  movieImage: { width: 200, height: 300, borderRadius: 10 },
  movieTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 10, textAlign: 'center' },
  moviePosterLarge: { width: '100%', height: 400, borderRadius: 10 },
  movieTitleLarge: { fontSize: 24, fontWeight: 'bold', marginVertical: 15, textAlign: 'center' },
  bookButton: { backgroundColor: '#0984e3', padding: 15, borderRadius: 8, marginTop: 20, alignItems: 'center' },
  bookButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  seatGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginVertical: 20 },
  seat: { width: 50, height: 50, margin: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 5 },
  seatAvailable: { backgroundColor: '#dfe6e9' },
  seatSelected: { backgroundColor: '#74b9ff' },
  seatBooked: { backgroundColor: '#636e72' },
  seatText: { fontSize: 14, fontWeight: 'bold' },
});
