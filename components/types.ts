export type TransactionType = {
    name: string;
    category: string;
    price: number;
    description?: string;
    date: Date;
}

export type ExchangeRatesResponseType = {
    data: {
        [key: string]: number;
    };
};