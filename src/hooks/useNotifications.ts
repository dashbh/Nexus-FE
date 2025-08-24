import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  userId: string;
  type: 'order_filled' | 'price_threshold' | 'system';
  message: string;
  meta: Record<string, unknown>;
  sentAt: string;
  isRead: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // For now, use fallback data since API might not be available in development
      // In production, this would call the actual API
      const fallbackNotifications = [
        {
          id: "1",
          userId: "1",
          type: "order_filled" as const,
          message: "Your RELIANCE buy order has been filled at ₹2450.00",
          meta: { orderId: "1", symbol: "RELIANCE", price: 2450 },
          sentAt: "2024-08-01T10:32:00Z",
          isRead: false
        },
        {
          id: "2",
          userId: "1",
          type: "price_threshold" as const,
          message: "INFY has reached your target price of ₹1550.00",
          meta: { symbol: "INFY", targetPrice: 1550, currentPrice: 1545 },
          sentAt: "2024-08-10T12:30:00Z",
          isRead: true
        },
        {
          id: "3",
          userId: "1",
          type: "system" as const,
          message: "Welcome to Nexus Trading Platform!",
          meta: {},
          sentAt: "2024-08-02T00:00:00Z",
          isRead: true
        },
        {
          id: "4",
          userId: "1",
          type: "order_filled" as const,
          message: "Your TCS buy order has been filled at ₹3550.00",
          meta: { orderId: "3", symbol: "TCS", price: 3550 },
          sentAt: "2024-08-12T09:16:00Z",
          isRead: false
        },
        {
          id: "5",
          userId: "1",
          type: "price_threshold" as const,
          message: "HDFCBANK has dropped below your alert price of ₹1500.00",
          meta: { symbol: "HDFCBANK", targetPrice: 1500, currentPrice: 1520 },
          sentAt: "2024-08-15T14:20:00Z",
          isRead: false
        },
        {
          id: "6",
          userId: "1",
          type: "system" as const,
          message: "Market hours extended today due to high volatility",
          meta: {},
          sentAt: "2024-08-20T09:00:00Z",
          isRead: true
        }
      ];
      
      setNotifications(fallbackNotifications);
    } catch (err) {
      console.error('Error loading notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const toggleRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: !notification.isRead }
          : notification
      )
    );
  };

  const markAllRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    loadNotifications();
  }, []);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    toggleRead,
    markAllRead,
    reload: loadNotifications,
  };
}
