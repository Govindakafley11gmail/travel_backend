"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize("postgres", "postgres", "postgres", {
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
exports.default = sequelize;
//# sourceMappingURL=db.js.map