// src/models/User.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../config/db";

// Define attributes
export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// For creation, id is optional
export interface UserCreationAttributes extends Optional<UserAttributes, "id" | "status"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  // Declare all fields so TypeScript knows they exist
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: string;
  public status!: string;

  // Timestamps (optional but recommended)
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    sequelize,
    tableName: "Users",
    modelName: "User",
    timestamps: true,
  }
);

export default User;