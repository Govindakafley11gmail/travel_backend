"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bookings", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
        country: {
        type: Sequelize.STRING, // ✅ Added country field
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bookingDate: {
        type: Sequelize.DATEONLY, // ✅ Only date (no time)
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_DATE"), // ✅ current date only
      },
      travelStartDate: {
        type: Sequelize.DATEONLY, // ✅ Only date (no time)
        allowNull: false,
      },
      travelEndDate: {
        type: Sequelize.DATEONLY, // ✅ Only date (no time)
        allowNull: false,
      },
      adultNum: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      childNum: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      numTravelers: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      totalAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "pending",
      },
      paymentStatus: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "pending",
      },
      specialRequest: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      travelType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mobileNo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("bookings");
  },
};
