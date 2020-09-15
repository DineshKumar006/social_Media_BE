class HttpError extends Error{
    constructor(message,errorcode){
        super(message)
        this.msg=message
        this.errorcode=errorcode
       
      
    }
}

module.exports=HttpError