import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const mockDataPath = path.join(process.cwd(), 'mock-data.json');
    const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));
    
    // Return notifications for user ID "1" (you can modify this based on authentication)
    const userNotifications = mockData.notifications.filter(
      (notification: { userId: string }) => notification.userId === "1"
    );
    
    return NextResponse.json(userNotifications);
  } catch (error) {
    console.error('Error loading notifications:', error);
    return NextResponse.json(
      { error: 'Failed to load notifications' },
      { status: 500 }
    );
  }
}
