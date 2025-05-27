
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_update_requests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      empId: {
        type: Sequelize.STRING
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      department: {
        type: Sequelize.STRING
      },
      company: {
        type: Sequelize.STRING
      },
      userType: {
        type: Sequelize.ENUM("MANAGER", "EMPLOYEE")
      },
      oldAvatarId: {
        type: Sequelize.STRING
      },
      newAvatarId: {
        type: Sequelize.STRING
      },
      newAvatarUrl: {
        type: Sequelize.STRING
      },
      updateStatus: {
        type: Sequelize.ENUM("PENDING", "APPROVE", "DENY")
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_update_requests');
  }
};