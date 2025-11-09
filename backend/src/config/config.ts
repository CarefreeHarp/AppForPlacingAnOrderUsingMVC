export const config = {
  port: process.env.BACKEND_PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/justo-y-bueno',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key'
};