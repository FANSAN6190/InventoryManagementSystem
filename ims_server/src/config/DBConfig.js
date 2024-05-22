import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PG_LOCAL_HOST,
  database: process.env.PG_LOCAL_DB,
  password: process.env.PG_LOCAL_PWD,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;