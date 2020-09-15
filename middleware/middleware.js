


const authMiddleware=(req,res,next)=>{
    console.log('middleware is running',res.statusCode)

    next()
}


module.exports=authMiddleware
