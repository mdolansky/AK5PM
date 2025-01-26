import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Text } from '@/components/Themed';
import { TransactionType } from '@/components/types';

interface TransactionsLineChartProps {
  transactions: TransactionType[];
}

const screenWidth = Dimensions.get('window').width;

const TransactionsLineChart: React.FC<TransactionsLineChartProps> = ({ transactions }) => {
  // Skupina transakcí podle dne v měsíci
  const dailyExpenses = transactions.reduce((acc, transaction) => {
    const transactionDate = new Date(transaction.date);
    const day = transactionDate.getDate();
    acc[day] = (acc[day] || 0) + transaction.price;
    return acc;
  }, {} as Record<number, number>);

  // Převod na pole pro graf
  const labels = Array.from({ length: 31 }, (_, i) => `${i + 1}`);
  const data = labels.map((_, i) => dailyExpenses[i + 1] || 0);

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>Denní výdaje</Text>
      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: data,
            },
          ],
        }}
        width={screenWidth - 64}
        height={220}
        yAxisLabel=""
        yAxisSuffix=' Kč'
        formatXLabel={(value) => (Number(value) % 2 === 0 ? value : '')}
        withDots={false}
        withVerticalLines={false}
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          barPercentage: 0.3,
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
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

export default TransactionsLineChart;
