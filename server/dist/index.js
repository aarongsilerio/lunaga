import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

// Validate required environment variables
if (!PGHOST || !PGDATABASE || !PGUSER || !PGPASSWORD) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const pool = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  max: 10,
  min: 2,
  ssl: { rejectUnauthorized: false }
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT id, email, role, "createdAt", "updatedAt" FROM "User"');
    res.json({ status: "ok", data: result.rows });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ status: "error", message: "Database connection failed" });
  } finally {
    client.release();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  await pool.end();
  process.exit(0);
});

export default app;