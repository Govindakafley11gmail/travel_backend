import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,

  // 🔥 THIS IS THE CRITICAL FIX
  define: {
    underscored: true,        // Maps camelCase (JS) → snake_case (DB)
    freezeTableName: false,   // Allows Sequelize to pluralize table names correctly
    timestamps: true,         // Ensures createdAt/updatedAt → created_at/updated_at
  },

  dialectOptions: isProduction
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Required for Railway/Heroku-style Postgres
        },
      }
    : undefined, // No SSL in local development (unless your local DB requires it)
});

export default sequelize;