import pgPromise from "pg-promise";
import dotenv from "dotenv";

dotenv.config();

const pgp = pgPromise();

const db = pgp({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "your_database",
  user: process.env.DB_USER || "your_user",
  password: process.env.DB_PASSWORD || "your_password",
  max: 30, // Connection pool
});

export default db;
