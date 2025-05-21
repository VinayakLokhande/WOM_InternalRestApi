import { DataTypes } from "sequelize";
import { sequelize } from "../../config/dbConnector.js";


export const User = sequelize.define(
  "user",
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
      validate: {
        isNull: {
          msg: "empId cannot be null"
        },
        notEmpty: {
          msg: "empId cannot be empty"
        }
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNull: {
          msg: "firstName cannot be null"
        },
        notEmpty: {
          msg: "firstName cannot be empty"
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNull: {
          msg: "lastName cannot be null"
        },
        notEmpty: {
          msg: "lastName cannot be empty"
        }
      }
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNull: {
          msg: "department cannot be null"
        },
        notEmpty: {
          msg: "department cannot be empty"
        }
      }
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNull: {
          msg: "company cannot be null"
        },
        notEmpty: {
          msg: "company cannot be empty"
        }
      }
    },
    userType: {
      type: DataTypes.ENUM("ADMIN", "MANAGER", "EMPLOYEE"),
      allowNull: false,
      validate: {
        isNull: {
          msg: "userType cannot be null"
        },
        notEmpty: {
          msg: "userType cannot be empty"
        }
      }
    },
    phone: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNull: {
          msg: "phone cannot be null"
        },
        notEmpty: {
          msg: "phone cannot be empty"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "unique_constraint",
        msg: "email must be unique"
      },
      validate: {
        isNull: {
          msg: "email cannot be null"
        },
        notEmpty: {
          msg: "email cannot be empty"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNull: {
          msg: "password cannot be null"
        },
        notEmpty: {
          msg: "password cannot be empty"
        }
      }
    },
    avatar: {
      type: DataTypes.STRING
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
    refreshToken: {
      type: DataTypes.STRING
    },
    allowedAccount: {
      type: DataTypes.BOOLEAN
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    deletedAt: {
      type: DataTypes.DATE
    }
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: "User"
  }
)

