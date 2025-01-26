import React, { useState, useEffect } from 'react';
import { Text, View } from '@/components/Themed';
import { StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { getTransactions } from '@/components/storageHandler';
import { TransactionType } from '@/components/types';
import { Picker } from '@react-native-picker/picker';
import { monthNames } from '@/constants/DateLocale';
import TransactionsLineChart from '@/components/TransactionsLineChart';
import TransactionsPieChart from '@/components/TransactionsPieChart';
import TransactionsHeatmap from '@/components/TransactionHeatmap';
import { Link, useFocusEffect } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

export default function HistoryScreen() {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [monthlyTransactions, setMonthlyTransactions] = useState<TransactionType[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [chartType, setChartType] = useState<string>('Line');

  useFocusEffect(
    React.useCallback(() => {
      const fetchTransactions = async () => {
        const allTransactions = await getTransactions();
        setTransactions(allTransactions);
      };

      fetchTransactions();
    }, [])
  );

  useEffect(() => {
    const filterTransactions = async () => {
      const filteredTransactions = transactions.filter((transaction: TransactionType) => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate.getMonth() === selectedMonth &&
          transactionDate.getFullYear() === selectedYear
        );
      });
      setMonthlyTransactions(filteredTransactions);
    };

    filterTransactions();
  }, [selectedMonth, selectedYear, chartType]);

  const renderChart = () => {
    switch (chartType) {
      case 'Line':
        return <TransactionsLineChart transactions={monthlyTransactions} />;
      case 'Pie':
        return <TransactionsPieChart transactions={monthlyTransactions} />;
      case 'Heatmap':
        return <TransactionsHeatmap transactions={transactions} selectedMonth={selectedMonth} selectedYear={selectedYear} />;
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Analýza</Text>
        <TouchableOpacity style={{ position: 'absolute', right: 4, top: 4 }}>
          <Link href="../modal" asChild>
            <FontAwesome name="wrench" size={24} color="#333" /> 
          </Link>
        </TouchableOpacity>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedYear}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
        >
          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
            <Picker.Item key={year} label={year.toString()} value={year} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedMonth}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedMonth(itemValue)}
        >
          {monthNames.map((month, index) => (
            <Picker.Item key={index} label={month} value={index} />
          ))}
        </Picker>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.chartButton, chartType === 'Line' && styles.activeButton]}
          onPress={() => setChartType('Line')}
        >
          <Text style={styles.chartButtonText}>Line Chart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chartButton, chartType === 'Pie' && styles.activeButton]}
          onPress={() => setChartType('Pie')}
        >
          <Text style={styles.chartButtonText}>Pie Chart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chartButton, chartType === 'Heatmap' && styles.activeButton]}
          onPress={() => setChartType('Heatmap')}
        >
          <Text style={styles.chartButtonText}>Heatmap</Text>
        </TouchableOpacity>
      </View>

      {renderChart()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  headerContainer: {
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  picker: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    width: (screenWidth - 48) / 2,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chartButton: {
    flex: 1,
    backgroundColor: '#007EA7',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#005F73',
  },
  chartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
