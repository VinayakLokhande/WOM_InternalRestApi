import { Sequelize } from "sequelize";
import config from "./config.js";

const env = process.env.NODE_ENV || "development"

const sequelize = new Sequelize(config[env])

const connectDb = async () => {
    try {
        await sequelize.authenticate()
        console.log(`\nDB CONNECTED SUCCESSFULLY -> DB : ${config[env].database}, HOST : ${config[env].host}`)
    } catch (error) {
        console.error("\nDB CONNECTION ERROR : ", error)
        process.exit(1)        
    }
}

export { 
    sequelize,
    connectDb
}