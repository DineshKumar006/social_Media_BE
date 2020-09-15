// const userModel=require('../models/usermodel')

const redisMiddlerware=require('../middleware/redisMiddlerware')
 const {check} =require('express-validator')

const Router=require('express').Router()
const userController=require('../controllers/user-controllers')
const multer=require('multer')
const httpError=require('../models/erroModel')
const {v4:uuid}=require('uuid')
// const authMiddleware=require('../middleware/authMiddlewar')

const MIME_TYPE={
    "image/png":"png",
    "image/jpg":"jpg",
    "image/jpeg":"jpeg"
}
const imageUpload=multer({
    limits:{
        fileSize:5000000
    },
    // dest:"upload",
   storage:multer.diskStorage({
       destination:(req,file,cb)=>{
            cb(null, 'avatar/images')
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


Router.route('/newuser').post(imageUpload.single('avatar'),[check('username').isLength({min:4,max:15}),check('password').isLength({min:6})],userController.create_NewUser)

Router.route('/get_all_users').get(userController.getAllusers)

Router.route('/get_all_users2').get(userController.getAllusers2)


Router.route('/get_user_by_id/:uid').get(userController.getUserByID)

Router.route('/login').post(userController.Login)

Router.route('/delete_user/:uid').delete(userController.DeleteUserById)

Router.route("/getuserAvatar/:uid").get(userController.getuserAvatar)
module.exports=Router