class ApiResponse {
    constructor(status, message, data){
        this.status=status
        this.message=message
        this.data=data
        this.success=this.statusCode < 400
    }
}

export {ApiResponse};