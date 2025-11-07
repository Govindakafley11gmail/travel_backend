// import { DataTypes, Model, Optional } from "sequelize";
// import sequelize from "../../../config/db";

// export interface TripAttributes {
//   id: number;
//   title: string;
//   subtitle?: string;
//   originalPrice: number;
//   discountPercent?: number;
//   finalPrice: number;
//   durationDays: number;
//   isTrending: boolean;
//   category?: string;
//   image?: string; // store uploaded image path or URL
// }

// export interface TripCreationAttributes extends Optional<TripAttributes, "id"> {}

// class Trip extends Model<TripAttributes, TripCreationAttributes> implements TripAttributes {
//   public id!: number;
//   public title!: string;
//   public subtitle?: string;
//   public originalPrice!: number;
//   public discountPercent?: number;
//   public finalPrice!: number;
//   public durationDays!: number;
//   public isTrending!: boolean;
//   public category?: string;
// }

// Trip.init(
//   {
//     id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
//     title: { type: DataTypes.STRING, allowNull: false },
//     subtitle: { type: DataTypes.STRING },
//     originalPrice: { type: DataTypes.FLOAT, allowNull: false },
//     discountPercent: { type: DataTypes.FLOAT },
//     finalPrice: { type: DataTypes.FLOAT, allowNull: false },
//     durationDays: { type: DataTypes.INTEGER, allowNull: false },
//     isTrending: { type: DataTypes.BOOLEAN, defaultValue: false },
//     category: { type: DataTypes.STRING, defaultValue: "Trending Now" },
//   },
//   {
//     sequelize,
//     tableName: "trips",
//     timestamps: true,
//   }
// );

// export default Trip;
