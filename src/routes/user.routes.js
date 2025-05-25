import { Router } from "express"
import { getAllUsers, loginUser, registerUser } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { isValidAccessor, verifyJWT } from "../middlewares/auth.middleware.js"


const userRouter = Router()

userRouter
    .route("/register")
    .post(upload.fields([
        {
            name: "avatar",
            maxCount: 5
        }
    ]), registerUser)


userRouter
    .route("/login")
    .post(loginUser)

userRouter
    .route("/")
    .get(verifyJWT, isValidAccessor("ADMIN"), getAllUsers)

export default userRouter