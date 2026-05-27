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

// Get patient profile
router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const profile = await req.prisma.patientProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        user: { select: { email: true } },
      },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Patient profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update patient profile
router.put('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, birthday, weight, height, medicalHistory, profilePicture } = req.body;

    const profile = await req.prisma.patientProfile.upsert({
      where: { userId: req.user.id },
      update: {
        name,
        birthday: birthday ? new Date(birthday) : undefined,
        weight,
        height,
        medicalHistory,
        profilePicture,
      },
      create: {
        userId: req.user.id,
        name: name || 'Patient',
        birthday: birthday ? new Date(birthday) : new Date(),
      },
    });

    res.json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get all doctors
router.get('/doctors', authMiddleware, async (req: Request, res: Response) => {
  try {
    const specialization = req.query.specialization as string | undefined;

    const where = specialization ? { specialization } : {};

    const doctors = await req.prisma.doctorProfile.findMany({
      where,
      include: {
        user: { select: { email: true } },
      },
    });

    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

export default router;
