// App.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, Modal, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createStackNavigator();

// Mock transactions
const mockTransactions = [
  { id: 1, amount: 500, category: 'Salary', date: '2025-04-01', type: 'income' },
  { id: 2, amount: 200, category: 'Groceries', date: '2025-04-03', type: 'expense' },
  { id: 3, amount: 50, category: 'Dining', date: '2025-04-05', type: 'expense' },
  { id: 4, amount: 1000, category: 'Freelance', date: '2025-04-07', type: 'income' },
  { id: 5, amount: 150, category: 'Entertainment', date: '2025-04-10', type: 'expense' },
];

function DashboardScreen() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('expense');
  const [date, setDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        setTransactions(mockTransactions);
        setLoading(false);
        setError(null);
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError('Failed to fetch transactions');
    }
  };

  const addTransaction = () => {
    if (!amount || !category || !date) return;
    const newTransaction = {
      id: Date.now(),
      amount: parseFloat(amount),
      category,
      date,
      type,
    };
    setTransactions([newTransaction, ...transactions]);
    setAmount('');
    setCategory('');
    setDate('');
    setType('expense');
    setModalVisible(false);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const totalIncome = transactions.filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions.filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const renderTransaction = ({ item }) => (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <TouchableOpacity
        onLongPress={() => deleteTransaction(item.id)}
        style={styles.transactionCard}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon
            name={item.type === 'income' ? 'cash-plus' : 'cash-minus'}
            size={24}
            color={item.type === 'income' ? 'green' : 'red'}
            style={{ marginRight: 10 }}
          />
          <View>
            <Text style={styles.transactionText}>{item.category}</Text>
            <Text style={styles.transactionDate}>{item.date}</Text>
          </View>
        </View>
        <Text style={styles.transactionAmount(item.type)}>
          ${item.amount}
        </Text>
      </TouchableOpacity>
    </Animated.View>
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
        <TouchableOpacity onPress={fetchTransactions} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Income: ${totalIncome}</Text>
        <Text style={styles.summaryText}>Expenses: ${totalExpenses}</Text>
        <Text style={styles.summaryText}>Balance: ${balance}</Text>
      </View>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>+ Add Transaction</Text>
      </TouchableOpacity>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTransaction}
        style={styles.transactionList}
      />

      {/* Modal for Adding Transaction */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Transaction</Text>
            <TextInput
              placeholder="Amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
            />
            <TextInput
              placeholder="Category"
              value={category}
              onChangeText={setCategory}
              style={styles.input}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                placeholder="Select Date"
                style={styles.input}
                value={date}
                editable={false}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || new Date();
                  setShowDatePicker(false);
                  setDate(currentDate.toISOString().split('T')[0]);
                }}
              />
            )}
            <View style={styles.typeButtons}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'income' && { backgroundColor: '#00b894' },
                ]}
                onPress={() => setType('income')}
              >
                <Text style={styles.typeButtonText}>Income</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'expense' && { backgroundColor: '#d63031' },
                ]}
                onPress={() => setType('expense')}
              >
                <Text style={styles.typeButtonText}>Expense</Text>
              </TouchableOpacity>
            </View>
            <Button title="Save" onPress={addTransaction} />
            <Button title="Cancel" color="grey" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    elevation: 2,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  transactionList: {
    marginTop: 10,
  },
  transactionCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionAmount: (type) => ({
    fontSize: 16,
    fontWeight: 'bold',
    color: type === 'income' ? 'green' : 'red',
  }),
  transactionDate: {
    fontSize: 14,
    color: '#636e72',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  addButton: {
    backgroundColor: '#0984e3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#f1f2f6',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  typeButton: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#dfe6e9',
    width: '40%',
    alignItems: 'center',
  },
  typeButtonText: {
    fontWeight: 'bold',
    color: '#2d3436',
  },
});
