import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import User from "../db/models/user.js"
import { Op } from "sequelize"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const registerUser = asyncHandler(async (req, res) => {
    // 1) get user details from frontend
    const { empId, firstName, lastName, department, company, userType, phone, email, password, avatar } = req.body

    // console.log("USER REGISTRATION CONTROLLER BODY FIELDS : ", req.body)

    // 2) validations
    if (!empId) {
        throw new ApiError(404, "empId is required")
    } else if (!firstName) {
        throw new ApiError(404, "firstName is required")
    } else if (!lastName) {
        throw new ApiError(404, "lastName is required")
    } else if (!department) {
        throw new ApiError(404, "department is required")
    } else if (!company) {
        throw new ApiError(404, "company is required")
    } else if (!userType) {
        throw new ApiError(404, "userType is required")
    } else if (!phone) {
        throw new ApiError(404, "phone is required")
    } else if (!email) {
        throw new ApiError(404, "email is required")
    } else if (!password) {
        throw new ApiError(404, "password is required")
    } 

    // 3) check if user already exists
    const existedUser = await User.findOne({
        where: {
            [Op.or]: [{ empId: empId }, { email: email }]
        }
    })

    if (existedUser) {
        throw new ApiError(409, "User with empId or email already exists")
    }

    // 4) check for image
    let avatarLocalPath
    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalPath = req.files.avatar[0].path
    }

    // 5) upload image on cloudinary
    if (avatarLocalPath) {
        const avatarUploadRes = await uploadOnCloudinary(avatarLocalPath)
    }

    const avatarUrl = avatar?.url || ""
    // 6) create user object and create entry in db
    const user = await User.create({
        empId: empId,
        firstName: firstName,
        lastName: lastName,
        department: department,
        company: company,
        userType: userType,
        phone: phone,
        email: email,
        password: password,
        avatar: avatarUrl,
    })

    // 7) remove password and refreshToken field from response
    const createdUser = await User.findOne({
        where: {
            [Op.or]: [{ empId: user.empId }, { email: user.email }]
        },
        attributes: {
            exclude: ["password", "refreshToken", "deletedAt"]
        }
    })

    // 8) check for user creation
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    // 9) return response to frontend
    return await res.status(201).json(
        new ApiResponse(200, "User registered successfully", createdUser)
    )
})


export {
    registerUser
}