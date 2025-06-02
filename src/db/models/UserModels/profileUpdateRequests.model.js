import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/dbConnector.js";

const UserUpdateRequests = sequelize.define(
  "UserUpdateRequests",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    empId: {
      type: DataTypes.STRING
    },
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    department: {
      type: DataTypes.STRING
    },
    company: {
      type: DataTypes.STRING
    },
    userType: {
      type: DataTypes.ENUM("MANAGER", "EMPLOYEE")
    },
    oldAvatarId: {
      type: DataTypes.STRING
    },
    newAvatarId: {
      type: DataTypes.STRING
    },
    newAvatarUrl: {
      type: DataTypes.STRING
    },
    updateStatus: {
      type: DataTypes.ENUM("PENDING", "APPROVE", "DENY")
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  },
  {
    tableName: "user_update_requests",
    modelName: "UserUpdateRequests"
  }
)

export default UserUpdateRequests