import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = Router();

declare global {
  namespace Express {
    interface Request {
      prisma: any;
    }
  }
}

/**
 * GET /api/notifications
 * Fetch all notifications for the authenticated user
 * @requires authMiddleware
 * @returns Array of notifications ordered by most recent
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const notifications = await req.prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: notifications,
      count: notifications.length,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notifications',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * PUT /api/notifications/:notificationId
 * Mark a specific notification as read
 * @requires authMiddleware
 * @param notificationId - ID of the notification to update
 * @body isRead - Boolean flag to mark notification as read
 */
router.put('/:notificationId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const { isRead } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Handle array case and validate ID
    const id = Array.isArray(notificationId) ? notificationId[0] : notificationId;

    if (!id || isNaN(parseInt(id, 10))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid notification ID',
      });
    }

    if (typeof isRead !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'isRead field must be a boolean',
      });
    }

    // Verify notification belongs to user
    const notification = await req.prisma.notification.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found',
      });
    }

    if (notification.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized to update this notification',
      });
    }

    const updatedNotification = await req.prisma.notification.update({
      where: { id: parseInt(id, 10) },
      data: { read: isRead },
    });

    res.status(200).json({
      success: true,
      message: 'Notification updated successfully',
      data: updatedNotification,
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update notification',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/notifications
 * Create a new notification (internal use - typically called by backend services)
 * @body userId - ID of the user receiving notification
 * @body message - Notification message content
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, message } = req.body;

    // Validation
    if (!userId || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['userId', 'message'],
      });
    }

    if (typeof userId !== 'number' || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid field types',
        details: 'userId must be a number, message must be a string',
      });
    }

    // Verify user exists
    const userExists = await req.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const notification = await req.prisma.notification.create({
      data: {
        userId,
        message,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification,
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create notification',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
