import { DataTypes } from "sequelize";
import { sequelize } from "../../config/dbConnector.js";
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
      // validate: {
      //   isNull: {
      //     msg: "empId cannot be null"
      //   },
      //   notEmpty: {
      //     msg: "empId cannot be empty"
      //   }
      // }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      // validate: {
      //   isNull: {
      //     msg: "firstName cannot be null"
      //   },
      //   notEmpty: {
      //     msg: "firstName cannot be empty"
      //   }
      // }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      // validate: {
      //   isNull: {
      //     msg: "lastName cannot be null"
      //   },
      //   notEmpty: {
      //     msg: "lastName cannot be empty"
      //   }
      // }
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
      // validate: {
      //   isNull: {
      //     msg: "department cannot be null"
      //   },
      //   notEmpty: {
      //     msg: "department cannot be empty"
      //   }
      // }
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
      // validate: {
      //   isNull: {
      //     msg: "company cannot be null"
      //   },
      //   notEmpty: {
      //     msg: "company cannot be empty"
      //   }
      // }
    },
    userType: {
      type: DataTypes.ENUM("ADMIN", "MANAGER", "EMPLOYEE"),
      allowNull: false,
      // validate: {
      //   isNull: {
      //     msg: "userType cannot be null"
      //   },
      //   notEmpty: {
      //     msg: "userType cannot be empty"
      //   }
      // }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      // validate: {
      //   isNull: {
      //     msg: "phone cannot be null"
      //   },
      //   notEmpty: {
      //     msg: "phone cannot be empty"
      //   }
      // }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: {
      //   name: "unique_constraint",
      //   msg: "email must be unique"
      // },
      // validate: {
      //   isNull: {
      //     msg: "email cannot be null"
      //   },
      //   notEmpty: {
      //     msg: "email cannot be empty"
      //   }
      // }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      // validate: {
      //   isNull: {
      //     msg: "password cannot be null"
      //   },
      //   notEmpty: {
      //     msg: "password cannot be empty"
      //   }
      // }
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