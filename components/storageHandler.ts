import AsyncStorage from '@react-native-async-storage/async-storage';
import { TransactionType } from '@/components/types';

export const storeTransaction = async (transaction: TransactionType) => {
  try {
    const transactions = await AsyncStorage.getItem('transactions');
    const parsedTransactions = transactions ? JSON.parse(transactions) : [];
    parsedTransactions.push(transaction);
    await AsyncStorage.setItem('transactions', JSON.stringify(parsedTransactions));
  } catch (error) {
    console.error(error);
  }
};

export const getTransactions = async () => {
  try {
    const transactions = await AsyncStorage.getItem('transactions');
    return transactions ? JSON.parse(transactions) : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getMonthlyTransactions = async (date: Date) => {
  const transactions = await getTransactions();
  const year = date.getFullYear();
  const month = date.getMonth();
  return transactions.filter((transaction: TransactionType) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getFullYear() === year &&
      transactionDate.getMonth() === month;
  });
}

export const getDailyTransactions = async (date: Date) => {
  const transactions = await getTransactions();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDay();
  return transactions.filter((transaction: TransactionType) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getFullYear() === year &&
      transactionDate.getMonth() === month &&
      transactionDate.getDay() === day;
  });
}