import dotenv from "dotenv"
import connectDb from "./config/dbConnector.js"
import app from "./app.js"

dotenv.config({
    path: './.env'
})

connectDb()

const APP_PORT = process.env.APP_PORT || 8000

app.listen(APP_PORT, () => {
    console.log("SERVER IS RUNNING AT PORT : ", APP_PORT)
})

