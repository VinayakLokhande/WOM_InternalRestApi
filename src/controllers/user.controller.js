import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import User from "../db/models/UserModels/user.model.js"
import { Op } from "sequelize"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"
import UserUpdateRequests from "../db/models/UserModels/profileUpdateRequests.model.js"
import { startOfMonth, endOfMonth } from "date-fns"


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
    // 2) validations
    // 3) check if user already exists
    // 4) check for image
    // 5) upload image on cloudinary
    // 6) create user object and create entry in db
    // 7) remove password and refreshToken field from response
    // 8) check for user creation
    // 9) return response to frontend

    const { empId, firstName, lastName, department, company, userType, phone, email, password, confirmPassword } = req.body

    if (!empId?.trim()) {
        throw new ApiError(404, "empId is required")
    } else if (!firstName?.trim()) {
        throw new ApiError(404, "firstName is required")
    } else if (!lastName?.trim()) {
        throw new ApiError(404, "lastName is required")
    } else if (!department?.trim()) {
        throw new ApiError(404, "department is required")
    } else if (!company?.trim()) {
        throw new ApiError(404, "company is required")
    } else if (!userType?.trim()) {
        throw new ApiError(404, "userType is required")
    } else if (!phone?.trim()) {
        throw new ApiError(404, "phone is required")
    } else if (!email?.trim()) {
        throw new ApiError(404, "email is required")
    } else if (!password?.trim()) {
        throw new ApiError(404, "password is required")
    } else if (!confirmPassword?.trim()) {
        throw new ApiError(404, "confirmPassword is required")
    }


    const existedUser = await User.findOne({
        where: {
            [Op.or]: [{ empId: empId?.trim() }, { email: email?.trim() }]
        }
    })

    if (existedUser) {
        throw new ApiError(409, "User with empId or email already exists")
    }


    // implementation to upload a single resource on cloudinary
    let avatarLocalPath
    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalPath = req.files.avatar[0].path
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    // // implementation to upload more than one resource on cloudinary
    // let avatarUrls = []
    // if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 3) {
    //     throw new ApiError(409, "Only 3 images can be uploaded at a time")
    // }

    // if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
    //     const avataruploadPromises = req.files.avatar.map(async (file) => {
    //         const uploadResult = await uploadOnCloudinary(file.path)
    //         return uploadResult?.secure_url
    //     })

    //     avatarUrls = await Promise.all(avataruploadPromises)
    //     avatarUrls = avatarUrls.filter(url => secure_url)
    // }



    const user = await User.create({
        empId: empId?.trim(),
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        department: department?.trim(),
        company: company?.trim(),
        userType: userType?.trim(),
        phone: phone?.trim(),
        email: email?.trim(),
        password: password?.trim(),
        avatarId: avatar?.public_id || "", // implementation to get single public id of uploaded resource
        avatar: avatar?.secure_url || "", // implementation to get single url of uploaded resource
        // avatar: avatarUrls.join(" ~#~ ") || "", // implementation to get more than one urls of uploaded resource
    })


    const createdUser = await User.findOne({
        where: {
            [Op.or]: [{ empId: user.empId }, { email: user.email }]
        },
        attributes: {
            exclude: ["password", "refreshToken", "deletedAt"]
        }
    })


    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }


    // TODO : send new account request notification to admin

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

    if (!empId?.trim()) {
        throw new ApiError(401, "empId and password is required")
    } else if (!password?.trim()) {
        throw new ApiError(401, "empId and password is required")
    }

    const existedUser = await User.findOne({
        where: {
            [Op.or]: [{ empId: empId?.trim() }]
        }
    })

    if (!existedUser) {
        throw new ApiError(404, "User does not exist with entered credentials")
    }

    const isPasswordCorrect = await existedUser.isPasswordCorrect(password?.trim())

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


const logoutUser = asyncHandler(async (req, res) => {

    const response = await User.update({
        accessToken: null
    }, {
        where: {
            empId: req.user.empId
        }
    })

    return res.status(200).json(
        new ApiResponse(200, "User logged out successfully", `${response}`)
    )
})


const getCurrentUserDetails = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, "Logged in user details", req.user)
    )
})


const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.findAll({
        where: {
            empId: {
                [Op.ne]: req.user.empId
            }
        }
    })

    const usersCount = await User.count()

    return res.status(200).json(
        new ApiResponse(200, `Total users : ${usersCount}`, users)
    )
})


const updateUserDetailsRequest = asyncHandler(async (req, res) => {

    // 1) check empId is present
    // 2) check requested user has already any updation request pending
    // 3) if pending throw error
    // 4) check how many times before user has requested for updation in the current month
    // 5) if already 3 times then throw error and don't let him update the profile
    // 6) check if avtar present
    // 7) if avatar present then upload it on cloudinary
    // 8) create new request object and save it to db
    // 9) return response

    const { empId, firstName, lastName, department, company, userType } = req.body
    
    if (!empId) {
        throw new ApiError(404, "empId is required")
    }

    const checkRequestedUserHasAlreadyUpdationPending = await UserUpdateRequests.findOne({
        where: {
            empId: empId.trim(),
            updateStatus: "PENDING"
        }
    })

    if (checkRequestedUserHasAlreadyUpdationPending) {
        throw new ApiError(404, "Already you have one pending updation request.")
    }

    const updateRequestCountForTheUserInTheCurrentMonth = await UserUpdateRequests.count({
        where: {
            empId: empId.trim(),
            createdAt: {
                [Op.between]: [startOfMonth(new Date()), endOfMonth(new Date())]
            }
        }
    })

    if (updateRequestCountForTheUserInTheCurrentMonth >= 3) {
        throw new ApiError(400, "Your updation limit for this month has been exhausted. You could update your profile only 3 times a month.")
    }

    let avtarLocalFilePath
    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avtarLocalFilePath = req.files.avatar[0].path
    }

    const avatarUploadResponse = await uploadOnCloudinary(avtarLocalFilePath)

    const user = await User.findOne({
        where: {
            empId: empId
        }
    })

    const savedUserUpdateRequest = await UserUpdateRequests.create({
        empId: empId,
        firstName: firstName,
        lastName: lastName,
        department: department,
        company: company,
        userType: userType,
        oldAvatarId: user.avatarId,
        newAvatarId: avatarUploadResponse?.public_id || "",
        newAvatarUrl: avatarUploadResponse?.secure_url || "",
        updateStatus: "PENDING"
    })

    if (!savedUserUpdateRequest) {
        throw new ApiError(400, "Something went wrong while updating the request")
    }

    // TODO : SEND NOTIFICATION TO ADMIN

    return res.status(200).json(
        new ApiResponse(200, "Record updation request is under review. After review will send a notification.", savedUserUpdateRequest)
    )

})


const handleAdminResponseForProfileUpdationRequest = asyncHandler(async (req, res) => {
    // 1) check if empId and admin response is given from the params or not
    // 2) in admin response param there is should be either approve or deny
    // 3) check if user if present or not with given empId
    // 4) if not send error
    // 5) check is profile updation request is pending for the user or not
    // 6) if not send error
    // 7) if yes first check is there deny in admin response param
    // 8) if yes then update updateStatus to deny in user_update_requests table
    // 9) and send deny notification to requested user
    // 10) otherwise check user has updated his profile picture or not
    // 11) if new avatarId is present then delete old profile from cloudinary
    // 12) update old details with new details
    // 13) also update updateStatus in user_update_requests table
    // 14) return response

    const { empId, adminResStatus } = req.body

    if (!empId) {
        throw new ApiError(400, "empId is required")
    }

    if (!adminResStatus) { 
        throw new ApiError(400, "admin response is required")
    }

    if (adminResStatus !== "APPROVE" && adminResStatus !== "DENY") {
        throw new ApiError(400, "Invalid admin response.")
    }

    const user = await User.findOne({
        where: {
            empId: empId
        }
    })

   
    if (!user) {
        throw new ApiError(400, `no user exists with empId ${empId}`)
    }

    const updationRequestForProvidedEmpId = await UserUpdateRequests.findOne({
        where: {
            empId: user.empId,
            updateStatus: "PENDING"
        }
    })

   
    if (!updationRequestForProvidedEmpId) {
        throw new ApiError(400, "no profile updation request found for the user")
    }

    if (adminResStatus === "DENY") {

        await deleteFromCloudinary(updationRequestForProvidedEmpId.newAvatarId)

        const result = await UserUpdateRequests.update({
            updateStatus: "DENY",
            newAvatarId: "",
            newAvatarUrl: ""
        }, {
            where: {
                empId: user.empId,
                updateStatus: "PENDING"
            }
        })

        if (!result) {
            throw new ApiError(400, "Something went wrong while updating user profile updation status")
        }

        // TODO : send notification to empId about your profile updation request denied

        return res.status(200).json(
            new ApiResponse(200, `Profile updation request has been denied by the admin`)
        )
    }

    let cloudinaryResourceDeleteResponse
    if (updationRequestForProvidedEmpId.newAvatarId) {
        cloudinaryResourceDeleteResponse = await deleteFromCloudinary(updationRequestForProvidedEmpId.oldAvatarId)
    }

    const updatedUser = await User.update({
        firstName: updationRequestForProvidedEmpId.firstName,
        lastName: updationRequestForProvidedEmpId.lastName,
        department: updationRequestForProvidedEmpId.department,
        company: updationRequestForProvidedEmpId.company,
        userType: updationRequestForProvidedEmpId.userType,
        avatarId: updationRequestForProvidedEmpId?.newAvatarId,
        avatar: updationRequestForProvidedEmpId?.newAvatarUrl
    }, {
        where: {
            empId: user.empId
        }
    })

    if (!updatedUser) {
        throw new ApiError(404, "Something went wrong while updating user profile")
    }

    await UserUpdateRequests.update({
        updateStatus: "APPROVE"
    }, {
        where: {
            empId: user.empId,
            updateStatus: "PENDING"
        }
    })

    // TODO : send notifcation to profile updation requested user

    return res.status(200).json(
        new ApiResponse(200, "User profile updated successfully")
    )

})


export {
    registerUser,
    loginUser,
    logoutUser,
    getAllUsers,
    getCurrentUserDetails,
    updateUserDetailsRequest,
    handleAdminResponseForProfileUpdationRequest
}