const RedisPORT= process.env.RedisPORT||6379 
const redisClient=require('../redis/redis')

const redisMiddleWare=async(req,res,next)=>{
       redisClient.hgetall("count",(err,object)=>{
    
        if(err) throw Error()

        if(object!==null){
            req.doc_count=parseInt(object.count)
        }else{
            req.doc_count=null
        }

            next()
        
    }) 
}

module.exports=redisMiddleWare