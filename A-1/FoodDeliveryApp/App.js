import React, { useState } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, TextInput, Image, Button, ScrollView, StyleSheet 
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

// Dummy Data
const categories = ["Pizza", "Burgers", "Drinks", "Desserts"];
const restaurants = [
  { id: "1", name: "Pizza Palace", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM69ZxRUw3Pn_hM05cU-Nl0WU4UKLrW6nR2g&s", description: "Delicious handmade pizzas with fresh ingredients." },
  { id: "2", name: "Burger House", image: "https://images.deliveryhero.io/image/fd-pk/LH/m1pj-listing.jpg", description: "Juicy burgers with the best flavors in town." },
];
const menuItems = [
  { id: "1", name: "Margherita Pizza", price: 10, image: "https://eu.ooni.com/cdn/shop/articles/20220211142754-margherita-9920_0483214a-7057-4277-9a3b-f2ab17c01e13.jpg?v=1737105958&width=1080" },
  { id: "2", name: "Cheese Burger", price: 8, image: "https://assets.epicurious.com/photos/5c745a108918ee7ab68daf79/1:1/w_2560%2Cc_limit/Smashburger-recipe-120219.jpg" },
];

const HomeScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurants</Text>
      <TextInput
        style={styles.input}
        placeholder="Search Food"
        value={search}
        onChangeText={setSearch}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryBar}>
        {categories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.categoryButton}>
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("RestaurantDetails", { restaurant: item })}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const RestaurantDetailsScreen = ({ route, navigation }) => {
  const { restaurant } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{restaurant.name}</Text>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Cart", { item })}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.cardTitle}>{item.name} - ${item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const CartScreen = ({ route, navigation }) => {
  const { item } = route.params || {};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      {item ? (
        <View>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text>{item.name} - ${item.price}</Text>
        </View>
      ) : (
        <Text>Cart is empty</Text>
      )}
      <Button title="Checkout" onPress={() => navigation.navigate("Checkout")} />
    </View>
  );
};

const CheckoutScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Checkout</Text>
    <Button title="Place Order" onPress={() => navigation.navigate("OrderTracking")} />
  </View>
);

const OrderTrackingScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Order Tracking</Text>
    <Text>Your food is on the way!</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  categoryBar: { marginVertical: 10 },
  categoryButton: { marginRight: 10, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 10, backgroundColor: "transparent" },
  categoryText: { fontSize: 16, fontWeight: "bold", color: "black" },
  card: { backgroundColor: "#fff", padding: 10, borderRadius: 10, marginVertical: 10, shadowColor: "#000", shadowOpacity: 0.2, shadowOffset: { width: 0, height: 2 } },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
  cardDescription: { fontSize: 14, color: "gray" },
  image: { width: "100%", height: 100, borderRadius: 10 }
});

const App = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="RestaurantDetails" component={RestaurantDetailsScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
