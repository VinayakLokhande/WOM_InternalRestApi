
class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        stack = ""
    ) {
        super(message)

        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith(4) ? "fail" : "error"
        this.message = message
        this.data = null
        this.isOperational = true

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default ApiError