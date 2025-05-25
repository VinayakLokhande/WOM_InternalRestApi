import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import User from "../db/models/user.js"
import { Op } from "sequelize"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"


const generateAccessRefreshToken = async (empId) => {
    try {

        const user = await User.findOne({
            where: {
                [Op.or]: [{ empId: empId }]
            }
        })

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // console.log("GENERATED ACCESS AND REFRESH TOKEN : ", accessToken, refreshToken)

        user.accessToken = accessToken

        await user.save({ validate: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, `Somehthing went wrong while generating access and refresh token : ${error}`)
    }

}



const registerUser = asyncHandler(async (req, res) => {
    // 1) get user details from frontend
    const { empId, firstName, lastName, department, company, userType, phone, email, password, confirmPassword } = req.body

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
    } else if (!confirmPassword) {
        throw new ApiError(404, "confirmPassword is required")
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
    // let avatarLocalPath
    // if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
    //     avatarLocalPath = req.files.avatar[0].path
    // }

    let avatarUrls = []
    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 3) {
        throw new ApiError(409, "Only 3 images can be uploaded at a time")
    }

    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        const avataruploadPromises = req.files.avatar.map(async (file) => {
            const uploadResult = await uploadOnCloudinary(file.path)
            return uploadResult?.url
        })

        avatarUrls = await Promise.all(avataruploadPromises)
        avatarUrls = avatarUrls.filter(url => url)
    }

    // 5) upload image on cloudinary
    // const avatar = await uploadOnCloudinary(avatarLocalPath)

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
        // avatar: avatar?.url || "",
        avatar: avatarUrls.join(" ~#~ ") || "",
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



const loginUser = asyncHandler(async (req, res) => {
    // 1) get user details
    // 2) validations
    // 3) check user exist or not
    // 4) check password is correct or not
    // 5) generate access and refresh tokens

    const { empId, password } = req.body

    if (!empId) {
        throw new ApiError(401, "empId and password is required")
    } else if (!password) {
        throw new ApiError(401, "empId and password is required")
    }

    const existedUser = await User.findOne({
        where: {
            [Op.or]: [{ empId: empId }]
        }
    })

    if (!existedUser) {
        throw new ApiError(404, "User does not exist with entered credentials")
    }

    const isPasswordCorrect = await existedUser.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        throw new ApiError(404, "User does not exist with entered credentials")
    }

    const { accessToken, refreshToken } = await generateAccessRefreshToken(existedUser.empId)

    const loggedInUser = await User.findOne({
        where: {
            [Op.or]: [{ empId: existedUser.empId }]
        },
        attributes: {
            exclude: ["password", "deletedAt"]
        }
    })

    const options = {
        httpOnly: true,
        secure: true
    }

    // send response
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                "User logged in successfully",
                loggedInUser,
            )
        )

})


const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.findAll({
        attributes: {
            exclude: [""]
        }
    })
    return res.status(200).json(
        new ApiResponse(200, "", users)
    )
})



export {
    registerUser,
    loginUser,
    getAllUsers,
}