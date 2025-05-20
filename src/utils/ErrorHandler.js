
const sendDevErrorResponse = (error, res) => {
    const statusCode = error.statusCode || 500
    const status = error.status
    const message = error.message
    const data = error.data
    const stack = error.stack

    return res.status(statusCode).json({
        status,
        message,
        data,
        stack
    })
}

const sendProdErrorResponse = (error, res) => {
    const statusCode = error.statusCode
    const status = error.status
    const message = error.message
    const data = error.data

    if (error.isOperational) {
        return res.status(statusCode).json({
            status,
            message,
            data
        })
    }

    return res.status(500).json({
        status: "error",
        message: "Something went very wrong!!!",
    })
}

const globalErrorHandler = (err, req, res, next) => {

    if (process.env.NODE_ENV === "development") {
        return sendDevErrorResponse(err, res)
    }

    sendProdErrorResponse(err, res)

}


export default globalErrorHandler