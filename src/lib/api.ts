import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Types based on the schema
export interface User {
  id: string;
  username: string;
  email: string;
  hashedPassword: string;
  balance: number;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioItem {
  id: string;
  userId: string;
  symbol: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  currentValue: number;
  unrealizedPnl: number;
}

export interface Order {
  id: string;
  userId: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  status: 'pending' | 'executed' | 'cancelled';
  placedAt: string;
  filledAt: string | null;
}

export interface Execution {
  id: string;
  orderId: string;
  symbol: string;
  executedPrice: number;
  executedQuantity: number;
  executedAt: string;
}

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order_filled' | 'price_threshold' | 'system';
  message: string;
  meta: Record<string, any>;
  sentAt: string;
  isRead: boolean;
}

export const nexusApi = createApi({
  reducerPath: 'nexusApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001' }),
  tagTypes: ['Portfolio', 'Orders', 'MarketData', 'Notifications'],
  endpoints: (builder) => ({
    // Portfolio endpoints
    getPortfolio: builder.query<PortfolioItem[], void>({
      query: () => 'portfolio',
      providesTags: ['Portfolio'],
    }),
    
    // Market data endpoints
    getMarketData: builder.query<MarketData[], void>({
      query: () => 'marketdata',
      providesTags: ['MarketData'],
    }),
    
    // Orders endpoints
    getOrders: builder.query<Order[], void>({
      query: () => 'orders',
      providesTags: ['Orders'],
    }),
    
    // Executions endpoints
    getExecutions: builder.query<Execution[], void>({
      query: () => 'executions',
      providesTags: ['Orders'],
    }),
    
    // Notifications endpoints
    getNotifications: builder.query<Notification[], void>({
      query: () => 'notifications',
      providesTags: ['Notifications'],
    }),
    
    // Users endpoints
    getUsers: builder.query<User[], void>({
      query: () => 'users',
    }),

    // Create order mutation
    createOrder: builder.mutation<Order, Partial<Order>>({
      query: (order) => ({
        url: 'orders',
        method: 'POST',
        body: {
          ...order,
          id: Date.now().toString(), // Generate a simple ID
          userId: '1', // Default user ID
        },
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

export const {
  useGetPortfolioQuery,
  useGetMarketDataQuery,
  useGetOrdersQuery,
  useGetExecutionsQuery,
  useGetNotificationsQuery,
  useGetUsersQuery,
  useCreateOrderMutation,
} = nexusApi;
