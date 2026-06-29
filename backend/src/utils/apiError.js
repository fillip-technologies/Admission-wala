class ApiError extends Error{
    constructor(status, message="Something went wrong", error=[], stack = ""){
        super(message)
        this.status=status
        this.message = message
        this.success=false
        this.data=null
        this.stack=""
        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError};