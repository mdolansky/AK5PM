import React, { useState, useEffect } from 'react';
import { Text, View } from '@/components/Themed';
import { StyleSheet, ScrollView, Dimensions, Button } from 'react-native';
import { getTransactions } from '@/components/storageHandler';
import { TransactionType } from '@/components/types';
import { Picker } from '@react-native-picker/picker';
import { monthNames } from '@/constants/DateLocale';
import TransactionsLineChart from '@/components/TransactionsLineChart';
import TransactionsPieChart from '@/components/TransactionsPieChart';
import TransactionsHeatmap from '@/components/TransactionHeatmap';
import { useFocusEffect } from 'expo-router';

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
      </View>

      {/* Picker pro výběr měsíce a roku */}
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

      {/* Tlačítka pro změnu typu grafu */}
      <View style={styles.headerContainer}>
        <View style={styles.buttonContainer}>
          <Button title="Line Chart" onPress={() => setChartType('Line')} />
          <Button title="Pie Chart" onPress={() => setChartType('Pie')} />
          <Button title="Heatmap" onPress={() => setChartType('Heatmap')} />
        </View>
      </View>

      {/* Graf podle výběru */}
      {renderChart()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  picker: {
    height: 50,
    backgroundColor: '#f9f9f9',
    width: (screenWidth - 64) / 2,
  },
});
