import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Stack = createStackNavigator();

// 🏡 Home Screen
function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://fakestoreapi.com/products');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0984e3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchProducts} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
          >
            <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="contain" />
            <Text numberOfLines={1} style={styles.productTitle}>{item.title}</Text>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <TouchableOpacity
        style={[styles.addButton, { position: 'absolute', bottom: 20, alignSelf: 'center' }]}
        onPress={() => navigation.navigate('Cart')}
      >
        <Text style={styles.addButtonText}>Go to Cart 🛒</Text>
      </TouchableOpacity>
    </View>
  );
}

// 📦 Product Detail Screen
function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://fakestoreapi.com/products/${productId}`);
      setProduct(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load product details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const addToCart = async () => {
    try {
      const existingCart = await AsyncStorage.getItem('cart');
      const cart = existingCart ? JSON.parse(existingCart) : [];
      const updatedCart = [...cart, product];
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      Alert.alert('Success', 'Product added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0984e3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchProduct} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!product) return null;

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <TouchableOpacity onPress={addToCart} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add to Cart 🛒</Text>
      </TouchableOpacity>
    </View>
  );
}

// 🛒 Cart Screen
function CartScreen({ navigation }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      setCartItems(cart ? JSON.parse(cart) : []);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      await AsyncStorage.removeItem('cart');
      setCartItems([]);
      Alert.alert('Cart Cleared', 'All items have been removed from the cart.');
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      loadCart();
    });

    return focusListener;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0984e3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.cartImage} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text numberOfLines={1} style={styles.cartTitle}>{item.title}</Text>
              <Text style={styles.cartPrice}>${item.price.toFixed(2)}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Cart is Empty</Text>}
      />
      {cartItems.length > 0 && (
        <TouchableOpacity onPress={clearCart} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear Cart</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// 🌟 Main App
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// 🧹 Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  image: { width: '100%', height: 250, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  price: { fontSize: 20, fontWeight: '600', color: 'green', marginBottom: 10 },
  description: { fontSize: 16, color: '#636e72', marginBottom: 20 },
  addButton: { backgroundColor: '#0984e3', padding: 15, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: 'red', marginBottom: 10, textAlign: 'center' },
  retryButton: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#0984e3', borderRadius: 5 },
  retryText: { color: '#fff', fontWeight: '600' },
  productCard: { flex: 1, backgroundColor: '#f1f2f6', margin: 5, padding: 10, borderRadius: 10, alignItems: 'center' },
  productImage: { width: 100, height: 100, marginBottom: 10 },
  productTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  productPrice: { fontSize: 14, color: 'green', fontWeight: 'bold' },
  cartItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f2f6', padding: 10, borderRadius: 8, marginBottom: 10 },
  cartImage: { width: 60, height: 60 },
  cartTitle: { fontSize: 16, fontWeight: 'bold' },
  cartPrice: { fontSize: 14, color: 'green' },
  clearButton: { backgroundColor: '#e17055', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  clearButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
