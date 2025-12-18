// 
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
const databaseUrl = process.env.DATABASE_URL || 
  'postgresql://postgres:RGUlXcYyOoBSguVVBMRckIQMxxfDdKML@postgres.railway.internal:5432/railway';

// Option 1: Use connection string (simpler)
const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Railway requires SSL
    }
  },
  logging: false
});

export default sequelize;
