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
        avatarId: {
          type: Sequelize.STRING
        },
        avatar: {
          type: Sequelize.TEXT
        },
        contentEditor: {
          type: Sequelize.BOOLEAN
        },
        active: {
          type: Sequelize.BOOLEAN
        },
        stopAccount: {
          type: Sequelize.BOOLEAN
        },
        lastSeen: {
          type: Sequelize.DATE
        },
        accessToken: {
          type: Sequelize.TEXT
        },
        accountStatus: {
          type: Sequelize.ENUM("PENDING", "APPROVE", "DENY"),
        },
        fcmToken: {
          type: Sequelize.STRING
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
    } catch (error) {
      console.error("migration error : ", error)
      throw error
    }
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }

  // async down(queryInterface, Sequelize) {
  //   await queryInterface.removeColumn("users", "new")
  // }

};