import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 
    'Content-Type': 'application/json',
  },
});

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Wallet {
  id: number;
  walletNumber: string;
  balance: number;
  status: string;
  user: User;
}

export interface Transaction {
  id: number;
  transactionId: string;
  fromWallet: Wallet;
  toWallet: Wallet;
  amount: number;
  status: string;
  createdAt: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TransferRequest {
  senderWalletId: number;
  receiverWalletId: number;
  amount: number;
}

export const authAPI = {
  register: (data: RegisterRequest) => api.post('/auth/register', data),
  login: (data: LoginRequest) => api.post('/auth/login', data),
};

export const walletAPI = {
  getUserWallet: (userId: number) => api.get<Wallet>(`/wallets/user/${userId}`),
  getWallet: (walletId: number) => api.get<Wallet>(`/wallets/${walletId}`),
  getAllWallets: () => api.get<Wallet[]>(`/wallets/all`),
};

export const transactionAPI = {
  transfer: (data: TransferRequest) => api.post<Transaction>('/transactions/transfer', data),
  getHistory: (walletId: number) => api.get<Transaction[]>(`/transactions/wallet/${walletId}`),
};

export default api;
