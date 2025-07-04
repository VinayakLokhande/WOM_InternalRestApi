import { Router } from "express"
import { getAllUsers, getCurrentUserDetails, handleAdminResponseForProfileUpdationRequest, loginUser, logoutUser, registerUser, updateUserDetailsRequest } from "../controllers/user.controller.js"
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
    .route("/registeredUsers")
    .get(verifyJWT, isValidAccessor("ADMIN"), getAllUsers)

userRouter
    .route("/")
    .get(verifyJWT, getCurrentUserDetails)

userRouter
    .route("/logout")
    .post(verifyJWT, logoutUser)

userRouter
    .route("/profile/update")
    .post(upload.fields([
        {
            name: "avatar",
            maxCount: 5
        }
    ]), updateUserDetailsRequest)

userRouter
    .route("/profile/update/response")
    .post(verifyJWT, isValidAccessor("ADMIN"), handleAdminResponseForProfileUpdationRequest)

export default userRouter