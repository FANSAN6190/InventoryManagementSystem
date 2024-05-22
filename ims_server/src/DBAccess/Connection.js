import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const config = process.env.NODE_ENV === 'test' 
  ? {
      host: process.env.TEST_PGHOST,
      user: process.env.TEST_PGUSER,
      password: process.env.TEST_PGPWD,
      database: process.env.TEST_PGDB,
      port: process.env.TEST_PGPORT,
    } 
  : {
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      password: process.env.PGPWD,
      database: process.env.PGDB,
      port: process.env.PGPORT,
    };

const pool = new Pool(config);

pool.on('connect', () => {
  console.log('connected to the db');
});

module.exports = pool;