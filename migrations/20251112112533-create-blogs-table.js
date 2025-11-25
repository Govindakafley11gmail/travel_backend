'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Table: blogs
     */
    await queryInterface.createTable('blogs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      is_published: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      published_at: {
        type: Sequelize.DATEONLY, // stores as 'YYYY-MM-DD'
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    /**
     * Table: blog_items
     */
    await queryInterface.createTable('blog_items', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      blog_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'blogs',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING(500),
        allowNull: true, // now nullable — matches your real data
      },
      link: {
        type: Sequelize.STRING(1000),
        allowNull: true,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true, // was falsely set to false before
      },
      subcontents: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: '[]', // safe default as JSON string
      },
      images: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: '[]',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    // Add useful indexes
    await queryInterface.addIndex('blogs', ['published_at']);
    await queryInterface.addIndex('blogs', ['is_published']);
    await queryInterface.addIndex('blog_items', ['blog_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('blog_items');
    await queryInterface.dropTable('blogs');
  },
};