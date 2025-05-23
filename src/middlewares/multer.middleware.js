import multer from "multer";

// define uploading destination and file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        const modifiedFileName = Date.now() + "-" + file.originalname
        cb(null, modifiedFileName)
    }
})

// upload file to given destination
export const upload = multer({
    storage: storage
})