"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log('Connecting to database with URL:', process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL);
// Option 1: Use connection string (simpler)
const sequelize = new sequelize_1.Sequelize(process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL || '', {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Railway requires SSL
        }
    },
    logging: false
});
exports.default = sequelize;
//# sourceMappingURL=db.js.map