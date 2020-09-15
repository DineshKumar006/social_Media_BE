const httpError=require('../models/erroModel')
const userModal=require('../models/usermodel')
const jwt=require('jsonwebtoken')
 const authMiddleware=async(req,res,next)=>{
    //   console.log(req.params)
    try {

        const token=req.header('Authorization').replace('Bearer ','')

            if(!token){
                throw new  httpError("Authorization failed",404)
            }

        const isMatch=jwt.verify(token,process.env.JWT_SECRET_KEY)
        const validUser=await userModal.findOne({_id:isMatch._id,email:isMatch.email})
        // const pp=validUser.userplaces.includes()
        if(!validUser){
            throw new  httpError("Authorization failed",404)
        }
         req.validUser=validUser
        //  console.log(validUser)
        //   console.log(isMatch)
        next()
        
    } catch (error) {
        // throw new  httpError("Authorization failed",404)
        res.status(404).send({message:"Authorization failed"})
    }
}

module.exports=authMiddleware