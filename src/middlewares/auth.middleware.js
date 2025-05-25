import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken"
import User from "../db/models/user.js";
import { Op } from "sequelize";


const verifyJWT = asyncHandler(async (req, res, next) => {
    try {

        const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findOne({
            where: {
                [Op.or]: [{ empId: decodedToken.empId }]
            },
            attributes: {
                exclude: ["password", "deletedAt"]
            }
        })

        if (!user) {
            throw new ApiError(401, "Your session has been expired. Please login again.")
        }

        req.user = user

        next()

    } catch (error) {
        throw new ApiError(401, "Your session has been expired. Please login again.")
    }
})


const isValidAccessor = (...userType) => {
    const checkAccess = (req, res, next) => {
        if (!userType.includes(req.user.userType)) {
            throw new ApiError(400, "You don't have permission to perform this action")
        }
        return next()
    }
    return checkAccess
}


export {
    verifyJWT,
    isValidAccessor,
}