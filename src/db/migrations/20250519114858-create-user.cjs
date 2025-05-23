'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      empId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      department: {
        type: Sequelize.STRING,
        allowNull: false
      },
      company: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userType: {
        type: Sequelize.ENUM("ADMIN", "MANAGER", "EMPLOYEE"),
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      avatar: {
        type: Sequelize.STRING
      },
      contentEditor: {
        type: Sequelize.BOOLEAN
      },
      active: {
        type: Sequelize.BOOLEAN
      },
      lastSeen: {
        type: Sequelize.DATE
      },
      refreshToken: {
        type: Sequelize.STRING
      },
      accountStatus: {
        type: Sequelize.ENUM("PENDING", "APPROVE", "DENY"),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });

    // await queryInterface.addConstraint("User", {
    //   fields: ['email'],
    //   type: "unique",
    //   name: "unique_constraint"
    // });
  } catch(error) {
    console.error("migration error : ", error)
    throw error
  }
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};