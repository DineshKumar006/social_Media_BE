const express=require('express');
const cors=require('cors')
const app=express()
require('dotenv').config()
const bodyParse=require('body-parser')
let dd=require('./db/db')
const path=require('path')
const PORT=process.env.PORT|| 4000
app.use(express.json());
app.use(cors())
app.use(bodyParse.json())

// console.log(process.env.MAP_API_KEY)
//  app.use(bodyParse.urlencoded({extended:true}))
// app.use((req,res,next)=>{
// res.setHeader('Access-Control-Allow-Origin','*')
// res.setHeader(
//     'Access-control-Allow-Headers',
//     'Origin,X-Requested-With,Content-Type,Accept,Authorization'
//     )
// res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE,PUT')

//     next();
// })



const userRoute=require('./routers/usersRoute')
const placeRoute=require('./routers/placesRoute')


app.use('/api/users',userRoute)
app.use('/api/places',placeRoute)

app.use('/avatar/images',express.static(path.join('avatar','images')))

app.use('/placeimage/images',express.static(path.join('placeimage','images')))

app.get("/",(req,res)=>{
    res.send("Social media app")
})

app.use((req,res,next)=>{
    res.status('404').send({error:"url not found!!"})
})



app.listen(PORT,()=>{
    console.log('server is running on port',PORT)
})



// // server.listen(PORT,()=>{
// //     console.log('server is running on port',PORT)
// // })






/*
 * Complete the 'meanderingArray' function below.
 *
 * The function is expected to return an INTEGER_ARRAY.
 * The function accepts INTEGER_ARRAY unsorted as parameter.
 */
