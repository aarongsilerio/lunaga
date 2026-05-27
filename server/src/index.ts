/**
 * Lunága Backend Server
 * Express.js HTTP server with Prisma ORM integration
 *
 * Features:
 * - JWT authentication with bcrypt password hashing
 * - Middleware for CORS, body parsing, request logging
 * - Database connection health checks
 * - Graceful shutdown handlers
 * - Centralized error handling
 * - All routes integrated (auth, patients, doctors, appointments, notifications)
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Import routes
import authRoutes from './routes/auth';
import patientRoutes from './routes/patients';
import doctorRoutes from './routes/doctors';
import appointmentRoutes from './routes/appointments';
import notificationRoutes from './routes/notifications';

// Load environment variables
dotenv.config();

// Environment configuration
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN;

// Validate CORS_ORIGIN in production
if (NODE_ENV === 'production' && !CORS_ORIGIN) {
  console.error('[ERROR] CORS_ORIGIN environment variable is required in production');
  process.exit(1);
}

const CORS_ORIGINS = NODE_ENV === 'production' ? CORS_ORIGIN : ['http://localhost:3000', 'http://localhost:3001'];

// Initialize Express app
const app = express();

// ============================================================
// Prisma Client Initialization
// ============================================================
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
  errorFormat: 'pretty',
  log: NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// ============================================================
// Middleware
// ============================================================

/**
 * CORS Configuration
 * Allows frontend to communicate with backend securely
 */
app.use(
  cors({
    origin: CORS_ORIGINS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  })
);

/**
 * Body parsing middleware with size limits
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Request Logging Middleware (Development Only)
 */
if (NODE_ENV === 'development') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method.toUpperCase().padEnd(7)} ${req.path}`);
    next();
  });
}

/**
 * Attach Prisma Client to Request Object
 * Makes database available to all route handlers via req.prisma
 */
declare global {
  namespace Express {
    interface Request {
      prisma: PrismaClient;
      user?: any;
    }
  }
}

app.use((req: Request, res: Response, next: NextFunction) => {
  req.prisma = prisma;
  next();
});

// ============================================================
// Health Check Endpoints
// ============================================================

/**
 * GET /api/health
 * Basic health check - verify server is running
 * Returns: Server status, timestamp, uptime, and environment
 */
app.get('/api/health', (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime()),
      environment: NODE_ENV,
    });
  } catch (error) {
    console.error('[ERROR] Health check error:', error);
    res.status(500).json({
      success: false,
      status: 'ERROR',
      message: 'Failed to retrieve health status',
    });
  }
});

/**
 * GET /api/health/db
 * Database connectivity check - verify database connection is active
 * Returns: Server and database status
 */
app.get('/api/health/db', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      status: 'OK',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[ERROR] Database health check failed:', error);
    res.status(503).json({
      success: false,
      status: 'ERROR',
      database: 'disconnected',
      message: 'Database connection failed',
      error: NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined,
    });
  }
});

// ============================================================
// API Routes
// ============================================================

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);

// ============================================================
// 404 Handler
// ============================================================

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// Global Error Handler Middleware
// ============================================================

/**
 * Centralized error handling middleware
 * Catches all errors from routes and returns consistent error responses
 * Must be last in middleware chain
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();

  console.error(`[${timestamp}] Error caught:`, {
    message: err.message || 'Unknown error',
    code: err.code || 'UNKNOWN',
    path: req.path,
    method: req.method,
    statusCode: err.status || err.statusCode || 500,
  });

  if (NODE_ENV === 'development') {
    console.error('[STACK] ', err.stack);
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    success: false,
    error: message,
    timestamp,
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ============================================================
// Server Initialization & Lifecycle
// ============================================================

let server: any;

/**
 * Initialize and start the Express server
 * - Tests database connection before listening
 * - Starts HTTP server on configured PORT
 * - Sets up graceful shutdown handlers
 */
const startServer = async () => {
  try {
    // Test database connection
    console.log('[INFO] Testing database connection...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('[SUCCESS] Database connection verified');

    server = app.listen(PORT, () => {
      const env = NODE_ENV.toUpperCase().padEnd(11);
      const port = String(PORT).padEnd(6);
      const db = (process.env.PGDATABASE || 'lunaga_database').substring(0, 40);

      console.log(`
╔════════════════════════════════════════════════════════════╗
║              LUNAGA SERVER STARTED                         ║
╠════════════════════════════════════════════════════════════╣
║ Environment:  ${env} ║
║ Port:         ${port}      ║
║ Health:       http://localhost:${String(PORT)}/api/health  ║
║ Database:     ${db.padEnd(40)} ║
╚════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('[ERROR] Failed to start server:', error);
    console.error('[ERROR] Make sure:');
    console.error('[ERROR]   1. DATABASE_URL is set in .env');
    console.error('[ERROR]   2. Database is running and accessible');
    console.error('[ERROR]   3. Prisma has been generated: npx prisma generate');
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Start the server
startServer();

// ============================================================
// Graceful Shutdown Handler
// ============================================================

/**
 * Graceful shutdown function
 * - Closes HTTP server
 * - Disconnects database
 * - Logs shutdown events
 */
async function shutdownServer(signal: string) {
  console.log(`\n[WARNING] ${signal} received, shutting down gracefully...`);

  try {
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => {
          console.log('[INFO] Express server closed');
          resolve();
        });
      });
    }

    console.log('[INFO] Disconnecting from database...');
    await prisma.$disconnect();
    console.log('[SUCCESS] Database disconnected');

    console.log('[SUCCESS] Shutdown completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Error during shutdown:', error);
    process.exit(1);
  }
}

// ============================================================
// Process Signal Handlers
// ============================================================

/**
 * Handle SIGTERM signal (termination from container/pm2)
 */
process.on('SIGTERM', () => shutdownServer('SIGTERM'));

/**
 * Handle SIGINT signal (Ctrl+C from terminal)
 */
process.on('SIGINT', () => shutdownServer('SIGINT'));

/**
 * Handle unhandled promise rejections
 */
process.on('unhandledRejection', (reason: any) => {
  console.error('[ERROR] Unhandled Promise Rejection:', reason);
  shutdownServer('unhandledRejection');
});

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (error: Error) => {
  console.error('[ERROR] Uncaught Exception:', error);
  shutdownServer('uncaughtException');
});

// ============================================================
// Module Exports
// ============================================================

export default app;
