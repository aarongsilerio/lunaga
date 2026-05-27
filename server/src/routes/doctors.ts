import { Router, Request, Response } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

declare global {
  namespace Express {
    interface Request {
      prisma: any;
    }
  }
}

// Get doctor profile
router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const profile = await req.prisma.doctorProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        user: { select: { email: true } },
      },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Doctor profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update doctor profile
router.put('/profile', authMiddleware, requireRole(['DOCTOR']), async (req: Request, res: Response) => {
  try {
    const { name, specialization, bio, availability } = req.body;

    const profile = await req.prisma.doctorProfile.upsert({
      where: { userId: req.user.id },
      update: {
        name,
        specialization,
        bio,
        availability,
      },
      create: {
        userId: req.user.id,
        name: name || 'Doctor',
        specialization: specialization || 'General',
      },
    });

    res.json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get doctor's appointments
router.get('/appointments', authMiddleware, requireRole(['DOCTOR']), async (req: Request, res: Response) => {
  try {
    const doctorProfile = await req.prisma.doctorProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!doctorProfile) {
      return res.status(404).json({ error: 'Doctor profile not found' });
    }

    const appointments = await req.prisma.appointment.findMany({
      where: { doctorId: doctorProfile.id },
      include: {
        patient: true,
      },
      orderBy: { datetime: 'asc' },
    });

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

export default router;
