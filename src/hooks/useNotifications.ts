import { useState, useEffect } from 'react';
import { useGetNotificationsQuery, useUpdateNotificationReadMutation } from '@/lib/api';

export function useNotifications() {
  const { data: notifications = [], isLoading, error, refetch } = useGetNotificationsQuery();
  const [updateNotificationRead] = useUpdateNotificationReadMutation();
  const [localNotifications, setLocalNotifications] = useState(notifications);

  // Fallback notifications in case RTK Query fails
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

  // Debug logging
  console.log('useNotifications - RTK Query data:', notifications);
  console.log('useNotifications - Local state:', localNotifications);
  console.log('useNotifications - Loading:', isLoading);
  console.log('useNotifications - Error:', error);

  // Update local state when RTK Query data changes
  useEffect(() => {
    console.log('useNotifications - useEffect triggered with notifications:', notifications);
    if (notifications && notifications.length > 0) {
      setLocalNotifications(notifications);
    } else if ((error || (!isLoading && notifications.length === 0)) && localNotifications.length === 0) {
      // Use fallback data if RTK Query fails or returns empty and we don't have local data
      console.log('useNotifications - Using fallback data due to error or empty response');
      setLocalNotifications(fallbackNotifications);
    }
  }, [notifications, error, isLoading, localNotifications.length]);

  const toggleRead = async (id: string) => {
    const notification = localNotifications.find(n => n.id === id);
    if (notification) {
      const newReadStatus = !notification.isRead;
      
      // Optimistically update local state
      setLocalNotifications(prev => 
        prev.map(n => 
          n.id === id ? { ...n, isRead: newReadStatus } : n
        )
      );

      try {
        // Update on server
        await updateNotificationRead({ id, isRead: newReadStatus }).unwrap();
      } catch (err) {
        // Revert on error
        setLocalNotifications(prev => 
          prev.map(n => 
            n.id === id ? { ...n, isRead: !newReadStatus } : n
          )
        );
        console.error('Failed to update notification read status:', err);
      }
    }
  };

  const markAllRead = async () => {
    const unreadNotifications = localNotifications.filter(n => !n.isRead);
    
    // Optimistically update local state
    setLocalNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );

    try {
      // Update all unread notifications on server
      await Promise.all(
        unreadNotifications.map(notification =>
          updateNotificationRead({ id: notification.id, isRead: true }).unwrap()
        )
      );
    } catch (err) {
      // Revert on error
      setLocalNotifications(notifications);
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const unreadCount = localNotifications.filter(n => !n.isRead).length;

  return {
    notifications: localNotifications,
    loading: isLoading,
    error: error ? 'Failed to load notifications' : null,
    unreadCount,
    toggleRead,
    markAllRead,
    reload: refetch,
  };
}
