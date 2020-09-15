// const redis=require('redis')

//  const redisPORT=process.env.REDISPORT || 6379

//  const redisClient=redis.createClient(redisPORT)

//  redisClient.on("connect",()=>{
//      console.log("Redis is connected")
//  })

//  redisClient.on("error",(error)=>{
//     console.log("Redis is not connected",error.message)
// })


// redisClient.on("ready",()=>{
//     console.log("Redis is connected and ready to use")
// })


// redisClient.on("end",()=>{
//     console.log("Redis is disconnected connected")
// })

// process.on("SIGINT",()=>{
//     redisClient.quit()
// })

// module.exports=redisClient