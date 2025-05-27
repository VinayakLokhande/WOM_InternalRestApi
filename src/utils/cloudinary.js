import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

// cloudinary configration
cloudinary.config(
    {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
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

        console.log("FILE UPLOADED SUCCESSFULLY ON CLOUDINARY : ", fileUploadResponse.secure_url)

        fs.unlinkSync(localFilePath)
        
        return fileUploadResponse

    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.log("ERROR OCCURED WHILE UPLOADING FILE ON CLOUDINARY : ", error)
        return null
    }
}


const deleteCloudinaryImage = async (publicId) => {
    try {

        if (publicId) {
            const fileDeleteResponse = await cloudinary.uploader.destroy(publicId)
        }

        return fileDeleteResponse

    } catch (error) {
        console.log("ERROR WHILE DELETING COUDINARY RESOURCE : ", error)
    }
}


export {
    uploadOnCloudinary
}