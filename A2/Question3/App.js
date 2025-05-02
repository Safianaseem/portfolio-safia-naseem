import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// Main Home Screen with Movie List
function HomeScreen({ navigation }) {
  const [allMovies, setAllMovies] = useState({});
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('action'); // Default category (lowercase)

  // Categories to filter movies
  const categories = ['action', 'comedy', 'drama', 'romance', 'sci-fi'];

  // Fetch movies for each category
  const fetchMovies = async () => {
    try {
      let moviesData = {};
      for (const category of categories) {
        const response = await axios.get(`https://api.sampleapis.com/movies/${category}`);
        moviesData[category] = response.data;
      }
      setAllMovies(moviesData);
      setFilteredMovies(moviesData[selectedCategory]);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredMovies(allMovies[selectedCategory]);
    } else {
      const filtered = allMovies[selectedCategory]?.filter(movie =>
        movie.title?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [searchText, selectedCategory, allMovies]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('MovieDetail', { movie: item })}>
      <Image
        source={{ uri: item.posterURL || 'https://via.placeholder.com/100x150.png?text=No+Image' }}
        style={styles.poster}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.date}>{item.year || 'N/A'}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0984e3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchMovies} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search movies..."
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />

      {/* Categories List */}
      <ScrollView horizontal style={styles.categoryList}>
        {categories.map((category) => (
          <TouchableOpacity 
            key={category} 
            style={[styles.categoryButton, selectedCategory === category && styles.selectedCategory]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={styles.categoryText}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Movie List */}
      <FlatList
        data={filteredMovies}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

// Movie Detail Screen
function MovieDetailScreen({ route }) {
  const { movie } = route.params;

  return (
    <View style={styles.detailContainer}>
      <Image
        source={{ uri: movie.posterURL || 'https://via.placeholder.com/100x150.png?text=No+Image' }}
        style={styles.posterDetail}
      />
      <Text style={styles.titleDetail}>{movie.title}</Text>
      <Text style={styles.dateDetail}>{movie.year}</Text>
      <Text style={styles.description}>{movie.synopsis || 'No description available.'}</Text>
    </View>
  );
}

// Main App Component with Navigation
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // General Container Styles
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  // Search Bar Styles
  searchInput: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
  },

  // Categories Styles
  categoryList: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCategory: {
    borderColor: '#0984e3', // Highlight selected category with border color
  },
  categoryText: {
    fontSize: 16,
    color: '#636e72',
  },

  // Movie List Styles
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  poster: {
    width: 70,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#636e72',
  },

  // Loading and Error Handling Styles
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0984e3',
    borderRadius: 5,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },

  // Movie Detail Styles
  detailContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  posterDetail: {
    width: 200,
    height: 300,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  titleDetail: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  dateDetail: {
    fontSize: 18,
    color: '#636e72',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
});
