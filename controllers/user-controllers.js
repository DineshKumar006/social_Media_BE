const userModel=require('../models/usermodel')
const {validationResult} =require('express-validator')
const HttpError=require('../models/erroModel')

const fs=require('fs')
const bcrypt=require('bcryptjs');

//--------------------------------------------------------------------------------------------------


const create_NewUser=(async(req,res,next)=>{

    let requireBodydata=["username","email","password","avatar"]
    const body=req.body
    const {username,email,password}=body
    const geterror=validationResult(req)
    const isuserExists=await userModel.validate_UserExistance(email)

    // console.log(isuserExists)
    try {
        if(!geterror.isEmpty()){
            throw new HttpError('username ,password not allowed,it must be >=3 & <=10' ,422)
        }
        const isMatch=Object.keys(body).every((ele)=>{
            return requireBodydata.includes(ele)
        });

            if(!isMatch){
                throw new HttpError('Extra field is not allowed',405)
            }
        try {
            if(!!isuserExists){
                throw new HttpError('user already exists, please login insted!',409)
            }

            let hashpassword
            try {
              hashpassword=await bcrypt.hash(password,12)
            } catch (error) {
                throw new HttpError('Signin failed , plz try again',500) 
            } 
            const userdata={
                username,
                email,
                password:hashpassword,
                avatar:null,
                pic:req.file.path,
                userplaces:[],
            }
            let newuser=new userModel(userdata)
             const result=await newuser.save()
             newuser.generateToken()
            res.status(201).send({ status:"sign_up success!",result:{_id:result._id,id:result._id,username:result.username,email:result.email,token:result.token}  })
        } catch (error) {
            throw new HttpError(error.toString(),409)
         
        }



    } catch (error) {
        if(req.file){
            fs.unlink(req.file.path,(err)=>{
                console.log(err)
            })
        }
            if(error.errorcode){
               return res.status(error.errorcode).json({status:"failed sign up",message:error.msg})
            }
       return res.status(500).json({status:"failed sign up",message:"user exits"})

    }

    
});
//--------------------------------------------------------------------------------------------------


const Login=(async(req,res,next)=>{
    // console.log(req.body)
try {
    const isUser=await userModel.Login_validation(req.body.email,req.body.password)
    if(!!isUser===false){
        throw new HttpError('Use Not Found',404)
    }

    isUser.generateToken()

    const {email,_id,pic,token,username,userplaces}=isUser
    res.status(200).json({status:'Login success!',isUser:{email,id:_id,_id,pic,token,username,userplaces}})

} catch (error) {
    if(error.errorcode){
     return   res.status(error.errorcode).send({status:"Login Failed",message:error.msg})

    }
    res.status(500).send({status:"Login Failed"})

}

});
//--------------------------------------------------------------------------------------------------


const getAllusers=(async(req,res)=>{
try {
    const users=await userModel.find({},['-password','-avatar']).exec()
    res.status(200).json({users:users.map(users=>users.toObject({getters:true}))})

}catch (error) {
    res.status(500).send("failed!,no user found")

}
    
});



const getuserAvatar=(async(req,res)=>{
    try {

        const uid=req.params.uid;
       const data=await userModel.findOne({_id:uid},['-password','-email','-userplaces']).exec()
       console.log(data)
        res.set('Content-type','image/png')
       res.status(200).send(data.avatar)
        
    } catch (error) {
        res.status(500).send("failed")
    }
})






const getAllusers2=(async(req,res)=>{
    let pageNo=parseInt(req.query.pageno); //1
        let itemsperpage=6;
       
        let lastIndex=pageNo*itemsperpage
        let firstIndex=lastIndex-itemsperpage


    try {
        let result={}
        if(firstIndex>1){
            result.prevPage={
                prevpage:pageNo-1,
                limit:itemsperpage

            }
        }else{
            result.prevPage={
                prevpage:null
            }
        }

        // redisClient.hmset("count",{count:await userModel.countDocuments().exec()})
        // redisClient.expire("count",20)
        //  console.log(req.doc_count)
        //  res.set('Content-type','image/png');

        const users=await userModel.find({},['-password','-avatar']).limit(itemsperpage).skip(firstIndex).exec()
        res.status(200).json({totalpages:Math.ceil( await userModel.countDocuments().exec()/itemsperpage) ,
            users:users.map(users=>users.toObject({getters:true})) ,avatar:users.avatar})
    
    }catch (error) {
        console.log(error)
        res.status(500).send("failed!,no user found")
    
    }
        
    });
//--------------------------------------------------------------------------------------------------


const getUserByID=(async(req,res,next)=>{

    try {
    
        const isUser=await userModel.findById(req.params.uid).exec()
        console.log(isUser)
        if(!isUser){
            throw new HttpError('Use Not Found',404)
        }

        res.status(200).json({status:'user found!',isUser:isUser.toObject({getters:true})})
    
    } catch (error) {

        if(error.errorcode){
          return  res.status(error.errorcode).send({status:"Failed",message:error.msg})
        }
        res.status(404).send({status:"internal Failed,user not found"})
    }
    

});



//--------------------------------------------------------------------------------------------------


const DeleteUserById=(async(req,res,next)=>{

    const id=req.params.uid;
    try {
        const dd=await userModel.findOneAndDelete({_id:id}).exec()
        if(!dd){
            throw Error("user not found")
        }
        res.status(200).send({status:"Delete success",Delete_User:dd})
    } catch (error) {
        res.status(404).send({status:"Delete Failed"})
    }

});




//--------------------------------------------------------------------------------------------------

module.exports={getuserAvatar,getAllusers,create_NewUser,Login,getUserByID,DeleteUserById,getAllusers2}


//<link href='https://api.mapbox.com/mapbox-gl-js/v1.11.1/mapbox-gl.css' rel='stylesheet' />
