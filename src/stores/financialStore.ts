import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Transaction {
  id: string;
  date: string;
  type: 'debit' | 'credit';
  amount: number;
  currency: string;
  description: string;
  category: string;
  reference: string;
  status: 'pending' | 'completed' | 'cancelled';
}

interface Account {
  id: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  balance: number;
  currency: string;
  description: string;
}

interface FinancialState {
  transactions: Transaction[];
  accounts: Account[];
  baseCurrency: string;
  supportedCurrencies: string[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (id: string, account: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  getBalance: (accountId: string) => number;
  getCashFlow: (startDate: string, endDate: string) => number;
}

const useFinancialStore = create<FinancialState>()(
  persist(
    (set, get) => ({
      transactions: [],
      accounts: [],
      baseCurrency: 'USD',
      supportedCurrencies: ['USD', 'EUR', 'SAR', 'AED', 'KWD'],

      addTransaction: (transaction) => {
        const newTransaction = {
          ...transaction,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          transactions: [...state.transactions, newTransaction],
        }));
      },

      updateTransaction: (id, transaction) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...transaction } : t
          ),
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },

      addAccount: (account) => {
        const newAccount = {
          ...account,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          accounts: [...state.accounts, newAccount],
        }));
      },

      updateAccount: (id, account) => {
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === id ? { ...a, ...account } : a
          ),
        }));
      },

      deleteAccount: (id) => {
        set((state) => ({
          accounts: state.accounts.filter((a) => a.id !== id),
        }));
      },

      getBalance: (accountId) => {
        const { transactions } = get();
        return transactions
          .filter((t) => t.status === 'completed')
          .reduce((balance, t) => {
            if (t.type === 'credit') {
              return balance + t.amount;
            }
            return balance - t.amount;
          }, 0);
      },

      getCashFlow: (startDate, endDate) => {
        const { transactions } = get();
        return transactions
          .filter(
            (t) =>
              t.status === 'completed' &&
              t.date >= startDate &&
              t.date <= endDate
          )
          .reduce((total, t) => {
            if (t.type === 'credit') {
              return total + t.amount;
            }
            return total - t.amount;
          }, 0);
      },
    }),
    {
      name: 'financial-store',
    }
  )
);

export default useFinancialStore;