// config.js (or config/config.js if using sequelize-cli structure)

require("dotenv").config(); // For local dev if needed

module.exports = {
  production: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT || 5432),
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,           // Enforce SSL
        rejectUnauthorized: false // Accept Railway's self-signed cert
      }
    },
    // Optional: disable logging in production if you don't want verbose output
    logging: false
  }
};