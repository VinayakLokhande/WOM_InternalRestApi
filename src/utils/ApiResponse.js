
class ApiResponse {
    constructor(
        statusCode,
        data
    ) {
        this.statusCode = statusCode,
        this.success = statusCode < 400,
        this.data = data
    }
}

export default ApiResponse