import { 
  Notification, 
  TournamentNotification, 
  CalendarEvent, 
  CalendarReminder,
  ApiResponse,
  AppError,
  UserSession
} from '../types';

/**
 * Service for managing notifications across different channels
 * Handles push notifications, email, SMS, and in-app notifications
 */
export class NotificationService {
  private static instance: NotificationService;
  private notifications: Map<string, Notification> = new Map();
  private subscribers: Map<string, (notification: Notification) => void> = new Map();
  private pushSubscription: PushSubscription | null = null;

  private constructor() {
    this.initializeServiceWorker();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Initialize service worker for push notifications
   */
  private async initializeServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  /**
   * Request push notification permission and subscribe
   */
  async requestPushPermission(): Promise<ApiResponse<boolean>> {
    try {
      if (!('Notification' in window)) {
        throw new Error('Push notifications not supported');
      }

      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await this.subscribeToPushNotifications();
        return {
          success: true,
          data: true,
          timestamp: new Date().toISOString(),
          requestId: this.generateId(),
        };
      } else {
        throw new Error('Push notification permission denied');
      }
    } catch (error) {
      return this.handleError('Failed to request push permission', error);
    }
  }

  /**
   * Subscribe to push notifications
   */
  private async subscribeToPushNotifications(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.VAPID_PUBLIC_KEY || ''),
      });

      this.pushSubscription = subscription;
      console.log('Push notification subscription:', subscription);
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
    }
  }

  /**
   * Create a new notification
   */
  async createNotification(
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    priority: Notification['priority'] = 'medium',
    data?: any,
    actionUrl?: string,
    expiresAt?: string
  ): Promise<ApiResponse<Notification>> {
    try {
      const notification: Notification = {
        id: this.generateId(),
        userId,
        type,
        title,
        message,
        data,
        isRead: false,
        createdAt: new Date().toISOString(),
        expiresAt,
        actionUrl,
        priority,
      };

      this.notifications.set(notification.id, notification);

      // Send to all channels based on user preferences
      await this.sendToChannels(notification);

      // Notify subscribers
      this.notifySubscribers(notification);

      return {
        success: true,
        data: notification,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to create notification', error);
    }
  }

  /**
   * Create tournament-specific notification
   */
  async createTournamentNotification(
    userId: string,
    tournamentId: string,
    title: string,
    message: string,
    round?: number,
    table?: number,
    actionRequired: boolean = false,
    priority: Notification['priority'] = 'medium'
  ): Promise<ApiResponse<TournamentNotification>> {
    try {
      const notification: TournamentNotification = {
        id: this.generateId(),
        userId,
        type: 'tournament',
        title,
        message,
        tournamentId,
        round,
        table,
        actionRequired,
        isRead: false,
        createdAt: new Date().toISOString(),
        priority,
      };

      this.notifications.set(notification.id, notification);

      // Send to all channels
      await this.sendToChannels(notification);

      // Notify subscribers
      this.notifySubscribers(notification);

      return {
        success: true,
        data: notification,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to create tournament notification', error);
    }
  }

  /**
   * Send notification to all channels
   */
  private async sendToChannels(notification: Notification): Promise<void> {
    // In-app notification (always sent)
    this.sendInAppNotification(notification);

    // Check if this is a tournament notification during phone ban
    const isTournamentDuringPhoneBan = this.isTournamentDuringPhoneBan(notification);

    // Push notification (disabled during phone bans for tournament notifications)
    if (this.pushSubscription && notification.priority !== 'low' && !isTournamentDuringPhoneBan) {
      await this.sendPushNotification(notification);
    }

    // Email notification (for high priority or action required)
    if (notification.priority === 'high' || notification.priority === 'urgent') {
      await this.sendEmailNotification(notification);
    }

    // SMS notification (for urgent only, but not during phone bans)
    if (notification.priority === 'urgent' && !isTournamentDuringPhoneBan) {
      await this.sendSMSNotification(notification);
    }
  }

  /**
   * Check if notification is for a tournament during phone ban
   */
  private isTournamentDuringPhoneBan(notification: Notification): boolean {
    if (notification.type !== 'tournament') return false;
    
    // This would check against the tournament's phone ban status
    // For now, we'll assume all tournament notifications during live play have phone bans
    const tournamentNotification = notification as TournamentNotification;
    return tournamentNotification.actionRequired === true;
  }

  /**
   * Send in-app notification
   */
  private sendInAppNotification(notification: Notification): void {
    // This would trigger a UI update in the app
    console.log('In-app notification:', notification);
  }

  /**
   * Send push notification
   */
  private async sendPushNotification(notification: Notification): Promise<void> {
    try {
      if (this.pushSubscription) {
        const payload = {
          title: notification.title,
          body: notification.message,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          data: {
            notificationId: notification.id,
            actionUrl: notification.actionUrl,
            type: notification.type,
          },
          actions: notification.actionUrl ? [
            {
              action: 'open',
              title: 'Open',
              icon: '/icon-192.png',
            },
            {
              action: 'dismiss',
              title: 'Dismiss',
            },
          ] : undefined,
        };

        // In a real implementation, this would be sent to your server
        // which would then send it to the push service
        console.log('Push notification payload:', payload);
      }
    } catch (error) {
      console.error('Failed to send push notification:', error);
    }
  }

  /**
   * Send email notification
   */
  private async sendEmailNotification(notification: Notification): Promise<void> {
    try {
      // This would integrate with an email service like SendGrid, Mailgun, etc.
      const emailData = {
        to: notification.userId, // This would be the user's email
        subject: notification.title,
        body: notification.message,
        template: this.getEmailTemplate(notification.type),
        data: notification.data,
      };

      console.log('Email notification:', emailData);
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  }

  /**
   * Send SMS notification
   */
  private async sendSMSNotification(notification: Notification): Promise<void> {
    try {
      // This would integrate with an SMS service like Twilio
      const smsData = {
        to: notification.userId, // This would be the user's phone number
        message: `${notification.title}: ${notification.message}`,
      };

      console.log('SMS notification:', smsData);
    } catch (error) {
      console.error('Failed to send SMS notification:', error);
    }
  }

  /**
   * Get email template for notification type
   */
  private getEmailTemplate(type: Notification['type']): string {
    const templates: { [key: string]: string } = {
      'tournament': 'tournament-notification',
      'pairing': 'pairing-notification',
      'social': 'social-notification',
      'system': 'system-notification',
      'achievement': 'achievement-notification',
    };

    return templates[type] || 'default-notification';
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<ApiResponse<boolean>> {
    try {
      const notification = this.notifications.get(notificationId);
      if (!notification) {
        throw new Error('Notification not found');
      }

      notification.isRead = true;
      this.notifications.set(notificationId, notification);

      return {
        success: true,
        data: true,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to mark notification as read', error);
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<ApiResponse<number>> {
    try {
      let count = 0;
      for (const [id, notification] of this.notifications.entries()) {
        if (notification.userId === userId && !notification.isRead) {
          notification.isRead = true;
          this.notifications.set(id, notification);
          count++;
        }
      }

      return {
        success: true,
        data: count,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to mark all notifications as read', error);
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<ApiResponse<boolean>> {
    try {
      const deleted = this.notifications.delete(notificationId);
      if (!deleted) {
        throw new Error('Notification not found');
      }

      return {
        success: true,
        data: true,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to delete notification', error);
    }
  }

  /**
   * Get notifications for a user
   */
  async getUserNotifications(
    userId: string,
    limit: number = 50,
    offset: number = 0,
    unreadOnly: boolean = false
  ): Promise<ApiResponse<Notification[]>> {
    try {
      let notifications = Array.from(this.notifications.values())
        .filter(notification => notification.userId === userId);

      if (unreadOnly) {
        notifications = notifications.filter(notification => !notification.isRead);
      }

      // Sort by creation date (newest first)
      notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Apply pagination
      const paginatedNotifications = notifications.slice(offset, offset + limit);

      return {
        success: true,
        data: paginatedNotifications,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to get user notifications', error);
    }
  }

  /**
   * Get unread notification count for a user
   */
  async getUnreadCount(userId: string): Promise<ApiResponse<number>> {
    try {
      const count = Array.from(this.notifications.values())
        .filter(notification => notification.userId === userId && !notification.isRead)
        .length;

      return {
        success: true,
        data: count,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to get unread count', error);
    }
  }

  /**
   * Subscribe to notification updates
   */
  subscribe(userId: string, callback: (notification: Notification) => void): string {
    const subscriptionId = this.generateId();
    this.subscribers.set(subscriptionId, callback);
    return subscriptionId;
  }

  /**
   * Unsubscribe from notification updates
   */
  unsubscribe(subscriptionId: string): boolean {
    return this.subscribers.delete(subscriptionId);
  }

  /**
   * Notify all subscribers
   */
  private notifySubscribers(notification: Notification): void {
    this.subscribers.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Error in notification subscriber:', error);
      }
    });
  }

  /**
   * Schedule a notification for later
   */
  async scheduleNotification(
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    scheduledFor: string,
    priority: Notification['priority'] = 'medium',
    data?: any
  ): Promise<ApiResponse<Notification>> {
    try {
      const notification: Notification = {
        id: this.generateId(),
        userId,
        type,
        title,
        message,
        data,
        isRead: false,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(new Date(scheduledFor).getTime() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours after scheduled time
        priority,
      };

      this.notifications.set(notification.id, notification);

      // Schedule the actual sending
      const delay = new Date(scheduledFor).getTime() - Date.now();
      if (delay > 0) {
        setTimeout(async () => {
          await this.sendToChannels(notification);
          this.notifySubscribers(notification);
        }, delay);
      } else {
        // Send immediately if scheduled time has passed
        await this.sendToChannels(notification);
        this.notifySubscribers(notification);
      }

      return {
        success: true,
        data: notification,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to schedule notification', error);
    }
  }

  /**
   * Create calendar reminder notification
   */
  async createCalendarReminder(
    userId: string,
    event: CalendarEvent,
    reminder: CalendarReminder
  ): Promise<ApiResponse<Notification>> {
    try {
      const reminderTime = new Date(event.startTime);
      reminderTime.setMinutes(reminderTime.getMinutes() - reminder.timeBeforeEvent);

      const title = `Reminder: ${event.title}`;
      const message = `Your event starts in ${reminder.timeBeforeEvent} minutes`;

      return await this.scheduleNotification(
        userId,
        'system',
        title,
        message,
        reminderTime.toISOString(),
        'medium',
        { eventId: event.id, eventType: event.type }
      );
    } catch (error) {
      return this.handleError('Failed to create calendar reminder', error);
    }
  }

  /**
   * Bulk create notifications
   */
  async bulkCreateNotifications(
    notifications: Array<{
      userId: string;
      type: Notification['type'];
      title: string;
      message: string;
      priority?: Notification['priority'];
      data?: any;
      actionUrl?: string;
    }>
  ): Promise<ApiResponse<Notification[]>> {
    try {
      const createdNotifications: Notification[] = [];

      for (const notificationData of notifications) {
        const result = await this.createNotification(
          notificationData.userId,
          notificationData.type,
          notificationData.title,
          notificationData.message,
          notificationData.priority,
          notificationData.data,
          notificationData.actionUrl
        );

        if (result.success && result.data) {
          createdNotifications.push(result.data);
        }
      }

      return {
        success: true,
        data: createdNotifications,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to bulk create notifications', error);
    }
  }

  /**
   * Clean up expired notifications
   */
  async cleanupExpiredNotifications(): Promise<ApiResponse<number>> {
    try {
      const now = new Date().toISOString();
      let deletedCount = 0;

      for (const [id, notification] of this.notifications.entries()) {
        if (notification.expiresAt && notification.expiresAt < now) {
          this.notifications.delete(id);
          deletedCount++;
        }
      }

      return {
        success: true,
        data: deletedCount,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to cleanup expired notifications', error);
    }
  }

  /**
   * Convert VAPID key to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Handle errors
   */
  private handleError(message: string, error: any): ApiResponse<any> {
    const appError: AppError = {
      code: 'NOTIFICATION_ERROR',
      message,
      details: error.message,
      timestamp: new Date().toISOString(),
    };

    return {
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
      requestId: this.generateId(),
    };
  }
}

export default NotificationService.getInstance(); 