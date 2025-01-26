import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { ContributionGraph } from 'react-native-chart-kit';
import { Text } from '@/components/Themed';
import { TransactionType } from '@/components/types';

interface TransactionsHeatmapProps {
  transactions: TransactionType[];
  selectedMonth: number;
  selectedYear: number;
}

const screenWidth = Dimensions.get('window').width;

const TransactionsHeatmap: React.FC<TransactionsHeatmapProps> = ({ transactions, selectedMonth, selectedYear }) => {
  // Získání data o 3 měsíce zpátky
  const startDate = new Date(selectedYear, selectedMonth - 2, 1);
  const endDate = new Date(selectedYear, selectedMonth + 1, 0);

  // Filtrování transakcí podle vybraného období
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });

  // Příprava dat pro ContributionGraph
  const contributions = filteredTransactions.reduce((acc, transaction) => {
    // Převedení data na YYYY-MM-DD formát
    const date = transaction.date instanceof Date 
      ? transaction.date.toISOString().split('T')[0] 
      : new Date(transaction.date).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + transaction.price;
    return acc;
  }, {} as Record<string, number>);  

  const chartData = Object.keys(contributions).map((date) => ({
    date: date,
    count: contributions[date],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>Výdaje za poslední 3 měsíce</Text>
      <ContributionGraph
        values={chartData}
        endDate={endDate}
        numDays={90} // Počet dní od posledního dne zpět
        width={screenWidth - 64}
        height={220}
        tooltipDataAttrs={(value) => ({
          onPress: () => {
            console.log(`Datum: ${value.date}, Částka: ${value.value} Kč`);
          },
        })}
        chartConfig={{
          backgroundColor: '#f9f9f9',
          backgroundGradientFrom: '#f9f9f9',
          backgroundGradientTo: '#f9f9f9',
          color: (opacity = 1) => `rgba(0, 126, 167, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default TransactionsHeatmap;
