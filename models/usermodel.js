const mongoose=require('mongoose')
const Validator=require('validator')
const HttpError=require('../models/erroModel')
const jwt =require('jsonwebtoken')
const bcrypt=require('bcryptjs')
let userSchema=new mongoose.Schema({
    username:{type:String,trim:true},

    email:{ 
        type:String,
        unique:true,
        lowercase:true,
        required:true,
        trim:true, 
        validate(value){
            if(!Validator.isEmail(value)){
                throw new HttpError('not an valid email address',422)
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            let str=value.toLowerCase().includes('password')
            if(str){
                throw new Error('Password should not be password',422)
            }
            if(value.length<=5){
                throw new Error('Password should be atleast of 5 character',422)
            }
        }
     },
     avatar:{type:Buffer},
     pic:{type:String},
     userplaces:[{type:mongoose.Types.ObjectId, required:true, ref:'placedata'}],
     token:{type:String}
})


userSchema.statics.validate_UserExistance=async(email)=>{
 
        let isuserExists=await userModel.findOne({email:email})
        if(isuserExists){
            return isuserExists
        }else{
            return false
        }
}


userSchema.statics.Login_validation=async(email,password)=>{
    if(!Validator.isEmail(email)){
        throw new Error('not a valid email')
    }

    let isuserExists=await userModel.findOne({email:email})
    if(isuserExists){
        let validPassword=await bcrypt.compare(password,isuserExists.password)
        console.log(validPassword)
        if(validPassword){
            return isuserExists
        }else{
            throw new HttpError('Password Not Match,Plz try again!',404)
        }
        

    }else{
        return false
    }



}



userSchema.methods.generateToken=async function(){
   
    try {
      
        const token=jwt.sign({_id:this._id.toString(),email:this.email},"welcome to home",{expiresIn:'1h'})
        this.token=token
        await this.save()
    } catch (error) {
        throw new HttpError('Signup failed,Plz try again!',404)

    }
}



// userSchema.methods.toJSON=function(){
//     const userObject=this.toObject();
//     delete userObject.password

//     return userObject
// }

let userModel=mongoose.model('users',userSchema)


module.exports=userModel