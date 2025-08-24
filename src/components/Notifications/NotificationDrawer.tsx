'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Check, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

interface Notification {
  id: string;
  userId: string;
  type: 'order_filled' | 'price_threshold' | 'system';
  message: string;
  meta: Record<string, unknown>;
  sentAt: string;
  isRead: boolean;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onToggleRead: (id: string) => void;
  onMarkAllRead: () => void;
  isLoading?: boolean;
}

export function NotificationDrawer({
  isOpen,
  onClose,
  notifications,
  onToggleRead,
  onMarkAllRead,
  isLoading = false,
}: NotificationDrawerProps) {
  // Debug logging
  console.log('NotificationDrawer - isOpen:', isOpen);
  console.log('NotificationDrawer - notifications:', notifications);
  console.log('NotificationDrawer - notifications length:', notifications?.length);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_filled':
        return '📈';
      case 'price_threshold':
        return '🎯';
      case 'system':
        return '🔔';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order_filled':
        return 'text-green-600';
      case 'price_threshold':
        return 'text-blue-600';
      case 'system':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Notifications</h2>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Actions */}
            {unreadCount > 0 && (
              <div className="p-4 border-b">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onMarkAllRead}
                  className="w-full"
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark all as read
                </Button>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Loading notifications...
                  </h3>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <Bell className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No notifications
                  </h3>
                  <p className="text-gray-500">
                    You&apos;re all caught up! New notifications will appear here.
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`transition-all duration-200 ${
                        !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <Card className={`border-0 shadow-sm ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <span className="text-2xl">
                                {getNotificationIcon(notification.type)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <p className={`text-sm font-medium ${
                                  !notification.isRead ? 'text-gray-900' : 'text-gray-600'
                                }`}>
                                  {notification.message}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onToggleRead(notification.id)}
                                  className="ml-2 flex-shrink-0"
                                >
                                  {notification.isRead ? (
                                    <Check className="h-4 w-4 text-gray-400" />
                                  ) : (
                                    <Check className="h-4 w-4 text-blue-600" />
                                  )}
                                </Button>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getNotificationColor(notification.type)}`}
                                >
                                  {notification.type.replace('_', ' ')}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {formatDate(notification.sentAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
