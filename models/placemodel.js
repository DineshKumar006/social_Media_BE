const mongoose=require('mongoose')


const placeSchema=new mongoose.Schema({
    placename:{type:String,required:true},
    description:{type:String,required:true},
    address:{type:String,required:true},
    location:{type:Object},
    imageurl:{type:String},
    creatorId:{type:mongoose.Types.ObjectId,required:true, ref:"users"},
    creatorName:{type:String,required:true, ref:'users'}

})




const placeModel=mongoose.model("placedata",placeSchema)

module.exports=placeModel