
const placeModel=require('../models/placemodel')

const userModel=require('../models/usermodel')

const mongoose=require('mongoose')
const HttpError=require('../models/erroModel')
// const {v4:uuid}=require('uuid')
const getCoordsApi=require('../utils/locations/coordinates')
const {validationResult} =require('express-validator')

const fs=require('fs')


//--------------------------------------------------------------------------------------------------

const createPlace=(async(req,res,next)=>{
  
    const geterror=validationResult(req)
    const body=req.body
    const {placename,address,description}=body
    const file=req.file
    // console.log(file)
    try {
            const requireBodydata=["placename","address","description","creatorId"]
            const isMatch=Object.keys(body).every((ele)=>{
                return requireBodydata.includes(ele)
            })
            if(!isMatch){
                    throw new HttpError('Extra field is not allowed',405)
            }
            
        if(!geterror.isEmpty()){
            throw new HttpError('Not a valid inputs',422)
            
        }
        let isuser;
        try {
         isuser=await userModel.findById(req.validUser._id).exec();
         if(!isuser){
            throw new HttpError("user not found with creatorId!",404)
         }

        } catch (error) {
            throw new HttpError("user not found with creatorId!",404)
        }

        let coordinates
        try {
            coordinates=await getCoordsApi(address)            
        } catch (error) {
        throw new HttpError(error.msg,error.errorcode)
        }
    
        const newPlace={
            placename,
            description,
            address,
            imageurl:req.file.path,
            location:coordinates,
            creatorId:req.validUser._id,
            creatorName:isuser.username
        }

        const placedata=new placeModel(newPlace)
        const session=await mongoose.startSession();
        session.startTransaction()
        const result=await placedata.save({session:session})
        await isuser.userplaces.push(result)
        await isuser.save({session:session})
        await session.commitTransaction()

      return  res.status(201).send({result})
        
    } catch (error ) {
        if(req.file){
            fs.unlink(req.file.path,(err)=>{
                console.log(err)
            })
        }
    //  console.log(error)
    if(error.errorcode){
       return res.status(error.errorcode).send({status:"failed add new place!",message:error.msg})
    }
    res.status(500).send({status:"internal error, failed add new place!"})

    }

});

//--------------------------------------------------------------------------------------------------

 const getAllPlaces=(async(req,res,next)=>{
    try {
        const result=await placeModel.find().exec()
        res.status(200).json({result})
    } catch (error) {
        
    }
});

//--------------------------------------------------------------------------------------------------


 const getPlaceById=(async(req,res,next)=>{
     const id=req.params.placeid
    try {
         const place=await placeModel.findById(id).exec()
         if(!place){
            throw new HttpError("no data found with given place ID",404)
         }
         return  res.status(200).json({place:place.toObject({getters:true})})

    } catch (error) {
        // console.log(error)
        if(error.errorcode){
          return  res.status(error.errorcode).send({status:"Failed Fetch",message:error.msg})
        }
        res.status(500).send({status:"Failed Fetch"})
    }
});


//--------------------------------------------------------------------------------------------------



 const getPlacesByuserId=(async(req,res,next)=>{
     const id=req.params.userid;
    //  console.log(id)
    try {
        const userwithPlaces=await userModel.findById(id).populate("userplaces")
        if(!userwithPlaces || userwithPlaces.userplaces.length==0){
           throw new HttpError("No data found with given user ID!",404)
        }
        return  res.status(200).json({userPlaces:userwithPlaces.userplaces.map(places=>places.toObject({getters:true}))})


    } catch (error) {
        if(error.errorcode){
            return res.status(error.errorcode).json({status:"failed",message:error.msg})

          }
        res.status(500).json({status:"internal failed",message:"something went wrong!!"})

    }
});


//--------------------------------------------------------------------------------------------------


const updateByid=(async(req,res,next)=>{

    const geterror=validationResult(req)
    const id=req.params.pid;
    const {placename,description,address}=req.body
try {

    if(!geterror.isEmpty()){
        throw new HttpError('Not a valid inputs',422)
    }

// const validplaceData=await placeModel.findById(id).exec()
// if(validplaceData.creatorId!==req.validUser._id){
//     throw new HttpError('Not a valid user to perform update!',401)
// }

    const validUserFlag=req.validUser.userplaces.includes(id)
    if(!validUserFlag){
        throw new HttpError('Not a valid user to perform update!',401)
    }

    let coordinates
    try {
        // console.log(address)
        coordinates=await getCoordsApi(address)            
    } catch (error) {
    throw new HttpError(error.msg,error.errorcode)
    }

    
    const newdata=await placeModel.findByIdAndUpdate(id,{address,placename,description,location:coordinates},{new:true})
    if(!newdata){
        throw new HttpError('place not found,check the placeid',422)
    }


    res.status(200).send({status:"success", newplace:newdata.toObject({getters:true})})

} catch (error) {
    if(error.errorcode){
   return res.status(error.errorcode).send({status:"failed to update place!",message:error.msg})
    }

    res.status(500).json({status:"internal failed",message:"something went wrong!!"})

}

});


//--------------------------------------------------------------------------------------------------

const deletePlaceByid=(async(req,res,next)=>{
    // const id=req.params.pid
    // try {
    //     const deletedData=await placeModel.findByIdAndDelete({_id:id});
    //   if(!deletedData){
    //       throw new HttpError("no place found, check the place id!!",404)
    //   }
    //     res.status(200).send({status:"delete success"})
        
    // } catch (error) {
    //     if(error.errorcode){
    //        return res.status(error.errorcode).send({ status:"delete failed",message:error.msg})
    //     }
    //   return  res.status(500).send({error:"something went wrong, delete failed!"})
    // }
    const id=req.params.pid
    try {
        const getplace=await placeModel.findById(id).populate("creatorId");
        if(getplace.creatorId._id.toString().trim(' ')!==req.validUser._id.toString().trim(' ')){
            throw new HttpError('Not a valid user to perform Delete!',401)
        }

      if(!getplace){
          throw new HttpError("no place found, check the place id!!",404)
      }

      const session=await mongoose.startSession()
      session.startTransaction();
      const result= await getplace.remove({session:session})
      await getplace.creatorId.userplaces.pull(result)
      await getplace.creatorId.save({session:session})
      await session.commitTransaction()
                if(getplace.imageurl){
                    fs.unlink(getplace.imageurl,(err)=>{
                        console.log(err)
                    })
                }

    

      res.status(200).send({status:"delete success",getplace})
        
    } catch (error) {
        if(error.errorcode){
           return res.status(error.errorcode).send({ status:"delete failed",message:error.msg})
        }
      return  res.status(500).send({error:"something went wrong, delete failed!"})
    }



});

//--------------------------------------------------------------------------------------------------


const getCoordinates=(async(req,res,next)=>{
    const address=req.params.address
    try {

        const data=await getCoordsApi(address)
        res.status(200).send({data})
        
    } catch (error) {
        res.status(403).send({status:'fetch failed',message:error.msg})
    }

});

//--------------------------------------------------------------------------------------------------


module.exports={getAllPlaces,getPlaceById,getPlacesByuserId,createPlace,updateByid,deletePlaceByid,getCoordinates}