import dotenv from 'dotenv';
dotenv.config();

const required = (key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return process.env[key];
};

const optional = (key, defaultValue = '') => process.env[key] || defaultValue;

export const config = {
  env:       optional('NODE_ENV', 'development'),
  port:      parseInt(optional('PORT', '5000'), 10),

  db: {
    url: optional('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/college_portal'),
  },

  jwt: {
    secret:    optional('JWT_SECRET', 'dev_secret_change_me'),
    expiresIn: optional('JWT_EXPIRES_IN', '7d'),
  },

  storage: {
    provider:  optional('STORAGE_PROVIDER', 'local'),
    localDir:  optional('LOCAL_UPLOAD_DIR', 'uploads'),
    supabase: {
      url:        optional('SUPABASE_URL'),
      serviceKey: optional('SUPABASE_SERVICE_KEY'),
      bucket:     optional('SUPABASE_BUCKET', 'college-resources'),
    },
    cloudinary: {
      cloudName: optional('CLOUDINARY_CLOUD_NAME'),
      apiKey:    optional('CLOUDINARY_API_KEY'),
      apiSecret: optional('CLOUDINARY_API_SECRET'),
    },
  },

  cors: {
    origin: optional('CORS_ORIGIN', 'http://localhost:5173'),
  },

  rateLimit: {
    windowMs: parseInt(optional('RATE_LIMIT_WINDOW_MS', '900000'), 10),
    max:      parseInt(optional('RATE_LIMIT_MAX', '300'), 10),
    authMax:  parseInt(optional('AUTH_RATE_LIMIT_MAX', '20'), 10),
  },

  upload: {
    maxFileSizeMb: parseInt(optional('MAX_FILE_SIZE_MB', '50'), 10),
  },
};
