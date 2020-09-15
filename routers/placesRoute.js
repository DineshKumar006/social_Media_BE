const Router=require('express').Router();
const middleWare=require('../middleware/middleware')
const HttpError=require('../models/erroModel')
const {check}=require('express-validator')
const placeController=require('../controllers/place-controllers')
const authMiddleware=require('../middleware/authMiddlewar')
const multer=require('multer')
const {v4:uuid} =require('uuid')
const MIME_TYPE={
    "image/png":"png",
    "image/jpg":"jpg",
    "image/jpeg":"jpeg"
}



const placeImage=multer({
    limits:{
        fileSize:5000000
    },
   storage:multer.diskStorage({
       destination:(req,file,cb)=>{
            cb(null, 'placeimage/images')
       },
       filename:(req,file,cb)=>{
           let ext=MIME_TYPE[file.mimetype]
           cb(null,uuid()+'.'+ext)
       },
   }),

    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
            return cb( new httpError('image format not allowed',409),false)
            // throw httpError('not allowed',409)
        }
        cb(false,true)
    },
    
})
    
    



Router.route('/all_places').get(placeController.getAllPlaces)

Router.route('/:placeid').get(placeController.getPlaceById)


Router.use(authMiddleware)

Router.route('/userplace/:userid').get(middleWare,placeController.getPlacesByuserId);
   
Router.route('/createPlace').post(placeImage.single('placeImage'),middleWare,
    [check("placename").not().isEmpty(), check('description').isLength({min:5,max:500}),check("address").not().isEmpty()]
    ,placeController.createPlace)

Router.route('/update/:pid').patch(middleWare,
    [check("placename").not().isEmpty(), check('description').isLength({min:5,max:500}),check("address").not().isEmpty()]
    ,placeController.updateByid);

Router.route('/deleteplace/:pid').delete(middleWare,placeController.deletePlaceByid)

Router.route('/location/get_coords/:address').get(placeController.getCoordinates)



module.exports=Router