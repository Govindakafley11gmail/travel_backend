import { Sequelize } from "sequelize";

const sequelize = new Sequelize("postgres", "postgres", "postgres", {
  host: "localhost", // Replace with your DB host
  dialect: "postgres", // Replace with your DB type if different
  logging: false, // Set to true to enable query logging
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000,
  }
});

export default sequelize;
