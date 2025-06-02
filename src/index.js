import dotenv from "dotenv"
import { connectDb } from "./config/dbConnector.js"
import { app } from "./app.js"
import ngrok from "ngrok"

dotenv.config({
    path: './.env'
})

connectDb()

const APP_PORT = process.env.APP_PORT || 8000

app.listen(APP_PORT, async () => {
    console.log("SERVER IS RUNNING AT PORT : ", APP_PORT)
    // const url = await ngrok.connect({ authtoken: process.env.NGROK_AUTH, addr: APP_PORT })
    // console.log("MY NGROK PUBLIC URL : ", url)
})

 