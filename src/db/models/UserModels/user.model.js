import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/dbConnector.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const User = sequelize.define(
  "User",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    empId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userType: {
      type: DataTypes.ENUM("ADMIN", "MANAGER", "EMPLOYEE"),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatarId: {
      type: DataTypes.STRING
    },
    avatar: {
      type: DataTypes.TEXT
    },
    contentEditor: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    stopAccount: {
      type: DataTypes.BOOLEAN
    },
    lastSeen: {
      type: DataTypes.DATE
    },
    accessToken: {
      type: DataTypes.TEXT
    },
    accountStatus: {
      type: DataTypes.ENUM("PENDING", "APPROVE", "DENY"),
      defaultValue: "PENDING"
    },
    fcmToken: {
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
    ,
    deletedAt: {
      type: DataTypes.DATE
    }
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: "User",
    tableName: "users"
  }
)


User.beforeSave(async (user, options) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 10)
  }
})


User.prototype.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password)
}


User.prototype.generateAccessToken = function() {
  return jwt.sign(
    {
      id: this.id,
      empId: this.empId,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}


User.prototype.generateRefreshToken = function() {
  return jwt.sign(
    {
      empId: this.empId
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}


export default User