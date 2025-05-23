import { asyncHandler } from "../utils/asyncHandler.js"

const registerUser = 
// asyncHandler( 
    async (req, res) => {
    return await res.status(200).json({
        status: "success"
    })
}
// )

export {
    registerUser
}