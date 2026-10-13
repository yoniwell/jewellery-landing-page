import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 5000,
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/abel_gemstone',
  JWT_SECRET: process.env.JWT_SECRET || 'abel_gemstone_luxury_secure_jwt_secret_key_2026!',
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URLS: process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',').map(u => u.trim())
    : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
};
