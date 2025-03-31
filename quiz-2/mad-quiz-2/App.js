import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

// APIs URLs
const DISNEY_MOVIES_URL = 'https://apidisneymovies.bsite.net/api/v1/movies/all?details=true';
const DISNEY_CHARACTERS_URL = 'https://api.disneyapi.dev/character';
const DISNEY_PLUS_MOVIES_URL = 'https://zylalabs.com/api/5969/disney+movies+api/7922/get+movies+list';

// Main Component
export default function App() {
  const [movies, setMovies] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [disneyPlusMovies, setDisneyPlusMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data from all APIs
  const fetchData = async () => {
    try {
      const moviesResponse = await fetch(DISNEY_MOVIES_URL);
      const moviesData = await moviesResponse.json();

      const charactersResponse = await fetch(DISNEY_CHARACTERS_URL);
      const charactersData = await charactersResponse.json();

      const disneyPlusResponse = await fetch(DISNEY_PLUS_MOVIES_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY', // Replace with your API key
        },
      });
      const disneyPlusData = await disneyPlusResponse.json();

      setMovies(moviesData);
      setCharacters(charactersData.data);
      setDisneyPlusMovies(disneyPlusData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
        Disney Movies & Characters
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : selectedMovie ? (
        <View>
          <TouchableOpacity onPress={() => setSelectedMovie(null)}>
            <Text style={{ color: 'blue', marginBottom: 10 }}>\u2190 Back</Text>
          </TouchableOpacity>
          <Image source={{ uri: selectedMovie.image }} style={{ width: '100%', height: 300, borderRadius: 10 }} />
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>{selectedMovie.title}</Text>
          <Text style={{ fontSize: 14, color: 'gray' }}>Release Year: {selectedMovie.year}</Text>
          <Text style={{ fontSize: 16, marginVertical: 10 }}>Rating: {selectedMovie.rating}/10</Text>
        </View>
      ) : (
        <>
          {/* Disney Movies */}
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>\uD83C\uDFAC Disney Animated Movies</Text>
          <FlatList
            data={movies}
            keyExtractor={(item) => item.movieId.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setSelectedMovie(item)} style={{ marginVertical: 10, alignItems: 'center' }}>
                <Image source={{ uri: item.image }} style={{ width: 150, height: 220, borderRadius: 10 }} />
                <Text style={{ marginTop: 5, fontSize: 16, fontWeight: 'bold' }}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Disney+ Streaming Movies */}
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>\uD83D\uDCFA Disney+ Movies</Text>
          <FlatList
            data={disneyPlusMovies}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ marginVertical: 10, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.title}</Text>
              </View>
            )}
          />

          {/* Disney Characters */}
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>\uD83E\uDDD1\u200D\uD83C\uDFA4 Disney Characters</Text>
          <FlatList
            data={characters}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <View style={{ marginVertical: 10, alignItems: 'center' }}>
                {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={{ width: 120, height: 120, borderRadius: 10 }} />}
                <Text style={{ marginTop: 5, fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
              </View>
            )}
          />
        </>
      )}
    </ScrollView>
  );
}
