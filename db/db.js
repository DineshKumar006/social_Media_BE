const mongoose=require('mongoose')
let url=`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0-gxjis.gcp.mongodb.net/${process.env.DB_COLLECTION_NAME}?retryWrites=true&w=majority`
// let url=`mongodb+srv://root:root@cluster0-gxjis.gcp.mongodb.net/socialmedia?retryWrites=true&w=majority`
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false}).then(()=>{

    console.log('connection online...')
}).catch((e)=>{
    console.log('something went wrong! check the internet connection!')

    

})
const db=mongoose.connection

db.once('open',()=>{
    msg="true"
    console.log('db connected')
})

