import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import globalErrorHandler from "./utils/ErrorHandler.js"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())

app.use(express.urlencoded({
    extended: true
}))

app.use(express.static("public"))

app.use(cookieParser())

import userRouter from "./routes/user.routes.js" 

app.use("/api/v1/users", userRouter)

app.use(globalErrorHandler)

export { app }