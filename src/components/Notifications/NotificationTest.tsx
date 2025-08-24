'use client';

import { useGetNotificationsQuery } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function NotificationTest() {
  const { data: notifications, isLoading, error } = useGetNotificationsQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notifications Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading notifications...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notifications Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Error loading notifications: {JSON.stringify(error)}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications Test (RTK Query)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Total notifications: {notifications?.length || 0}
          </p>
          <p className="text-sm text-gray-600">
            Unread notifications: {notifications?.filter(n => !n.isRead).length || 0}
          </p>
          <div className="mt-4 space-y-2">
            {notifications?.slice(0, 3).map((notification) => (
              <div key={notification.id} className="p-2 border rounded">
                <p className="font-medium">{notification.message}</p>
                <p className="text-xs text-gray-500">
                  Type: {notification.type} | Read: {notification.isRead ? 'Yes' : 'No'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
