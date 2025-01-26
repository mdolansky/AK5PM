import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import { TransactionType, ExchangeRatesResponseType } from '@/components/types';
import { getDailyTransactions, getMonthlyTransactions } from '@/components/storageHandler';
import { monthNames } from '@/constants/DateLocale';
import { getExchangeRates } from '@/components/apiHandler';

export default function HomeScreen() {
  const [currentMonthSpendings, setCurrentMonthSpendings] = useState(0);
  const [currentDaySpendings, setCurrentDaySpendings] = useState(0);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRatesResponseType>({ data: { CZK: 2 } });
  const currentDate = new Date();
  const monthName = monthNames[currentDate.getMonth()];
  const [currency, setCurrency] = useState('CZK');
  const usdExchangeRate = parseFloat(exchangeRate.data['CZK'].toString()).toFixed(2);

  const currentMonthSpendingsUSD = parseFloat((currentMonthSpendings / exchangeRate.data['CZK']).toString()).toFixed(2);
  const currentDaySpendingsUSD = parseFloat((currentDaySpendings / exchangeRate.data['CZK']).toString()).toFixed(2);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      const exchangeRate = await getExchangeRates();
      setExchangeRate(exchangeRate);
    };

    fetchExchangeRate();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchTransactions = async () => {
        const dailyTransactions = await getDailyTransactions(currentDate);
        const totalDailyTransactions = dailyTransactions.reduce(
          (acc: number, transaction: TransactionType) => acc + transaction.price,
          0
        );

        const monthlyTransactions = await getMonthlyTransactions(currentDate);
        const totalMonthlySpendings = monthlyTransactions.reduce(
          (acc: number, transaction: TransactionType) => acc + transaction.price,
          0
        );

        setCurrentDaySpendings(totalDailyTransactions);
        setCurrentMonthSpendings(totalMonthlySpendings);
      };

      fetchTransactions();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.exchangeRateContainer}>
        <Text style={styles.title}>Aktuální kurz</Text>
        <Text style={styles.exchangeRateText}>CZK:USD</Text>
        <Text style={styles.exchangeRateText}>{usdExchangeRate}:1</Text>
      </View>
      <TouchableOpacity style={styles.currencyButton} onPress={() => setCurrency(currency === 'CZK' ? 'USD' : 'CZK')}>
        <Text style={styles.currencyButtonText}>{currency}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{monthName}</Text>
      <Text style={styles.amount}>
        {currency === 'CZK' ? `${currentMonthSpendings} Kč` : `$${currentMonthSpendingsUSD}`}
      </Text>

      <Text style={styles.title}>Dnes</Text>
      <Text style={styles.amount}>
        {currency === 'CZK' ? `${currentDaySpendings} Kč` : `$${currentDaySpendingsUSD}`}
      </Text>

      <TouchableOpacity style={styles.addTransactionButton}>
        <Link href="../addTransactionModal" asChild>
          <Text style={styles.addTransactionButtonText}>Přidat transakci</Text>
        </Link>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#007EA7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  currencyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginVertical: 12,
  },
  exchangeRateContainer: {
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    marginBottom: 16,
  },
  exchangeRateText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
  },
  amount: {
    fontSize: 20,
    fontWeight: '400',
    color: '#007EA7',
    marginBottom: 16,
  },
  addTransactionButton: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: '#007EA7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addTransactionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
