import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Text } from '@/components/Themed';
import { TransactionType } from '@/components/types';

const colors = ['#FFFFFF', '#003459', '#007EA7', '#00A8E8', '#44CCFF', '#77DFF9'];

interface TransactionsPieChartProps {
  transactions: TransactionType[];
}

const screenWidth = Dimensions.get('window').width;

const TransactionsPieChart: React.FC<TransactionsPieChartProps> = ({ transactions }) => {
  // Skupina transakcí podle kategorií
  const categoryExpenses = transactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.price;
    return acc;
  }, {} as Record<string, number>);

  // Seřazení kategorií podle výdajů a výběr top 5
  const sortedCategories = Object.entries(categoryExpenses)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Výpočet "Jiné" jako součet zbylých kategorií
  const otherExpenses = Object.entries(categoryExpenses)
    .sort(([, a], [, b]) => b - a)
    .slice(5)
    .reduce((sum, [, value]) => sum + value, 0);

  const pieData = [
    ...sortedCategories.map(([category, value]) => ({
      name: category,
      value,
      color: colors[sortedCategories.findIndex((item) => item[0] === category) + 1],
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    })),
    {
      name: 'Jiné',
      value: otherExpenses,
      color: '#d3d3d3',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>Výdaje podle kategorií</Text>
      <PieChart
        data={pieData}
        width={screenWidth - 64}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="value"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
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

export default TransactionsPieChart;
