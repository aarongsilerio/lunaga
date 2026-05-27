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

// Book appointment
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { doctorId, datetime, notes } = req.body;

    if (!doctorId || !datetime) {
      return res.status(400).json({ error: 'doctorId and datetime are required' });
    }

    // Get patient profile
    const patientProfile = await req.prisma.patientProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!patientProfile) {
      return res.status(404).json({ error: 'Patient profile not found' });
    }

    // Check if doctor exists
    const doctor = await req.prisma.doctorProfile.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Create appointment
    const appointment = await req.prisma.appointment.create({
      data: {
        patientId: patientProfile.id,
        doctorId,
        datetime: new Date(datetime),
        notes,
      },
    });

    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

// Get user's appointments
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const patientProfile = await req.prisma.patientProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!patientProfile) {
      return res.status(404).json({ error: 'Patient profile not found' });
    }

    const appointments = await req.prisma.appointment.findMany({
      where: { patientId: patientProfile.id },
      include: {
        doctor: true,
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

// Update appointment
router.put('/:appointmentId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;
    const { status, prescription, notes } = req.body;

    const appointment = await req.prisma.appointment.update({
      where: { id: parseInt(appointmentId) },
      data: {
        status,
        prescription,
        notes,
      },
    });

    res.json({ message: 'Appointment updated successfully', appointment });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Cancel appointment
router.delete('/:appointmentId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;

    await req.prisma.appointment.delete({
      where: { id: parseInt(appointmentId) },
    });

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
});

export default router;
