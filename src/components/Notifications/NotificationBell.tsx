'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotificationDrawer } from './NotificationDrawer';

interface Notification {
  id: string;
  userId: string;
  type: 'order_filled' | 'price_threshold' | 'system';
  message: string;
  meta: Record<string, unknown>;
  sentAt: string;
  isRead: boolean;
}

interface NotificationBellProps {
  notifications: Notification[];
  onToggleRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export function NotificationBell({
  notifications,
  onToggleRead,
  onMarkAllRead,
}: NotificationBellProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsDrawerOpen(true)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      <NotificationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        notifications={notifications}
        onToggleRead={onToggleRead}
        onMarkAllRead={onMarkAllRead}
      />
    </>
  );
}
