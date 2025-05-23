import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

// cloudinary configration
cloudinary.config(
    {
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
)

// upload files on cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        // upload the file on cloudinary
        const fileUploadResponse = await cloudinary.uploader.upload(
            localFilePath,
            {
                resource_type: "auto"
            }
        )
        if (fileUploadResponse) {
            console.log("FILE UPLOADED SUCCESSFULLY ON CLOUDINARY : ", fileUploadResponse)
            fs.unlinkSync(localFilePath)
            return fileUploadResponse
        } else {
            console.log("FILE NOT UPLOADED ON CLOUDINARY : ", fileUploadResponse)
            // fs.unlinkSync(localFilePath)
            return null
        }
    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.log("ERROR OCCURED WHILE UPLOADING FILE ON CLOUDINARY : ", error)
        return null
    }
}


export {
    uploadOnCloudinary
}