const axios=require('axios')
const HttpError=require('../../models/erroModel')
// const apikey="pk.eyJ1IjoiZGluZXNoLWt1bWFyMSIsImEiOiJja2QzMGt1ZmUxaW1mMnltdmZqeG5zemI5In0.SGj2nnU6ywTevXcp16f_Sg"
const apikey=process.env.MAP_API_KEY
const get_coordinates=async(address)=>{
  
//  console.log(encodeURIComponent(address))
try {

    if(!address){
        throw new Error('provide address',422)
        
    }
    const url=`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${apikey}`
        let response=await axios.get(url)
        if(!response.data){
            throw new Error('data not found',403)
        }

        const coords={
            lat:response.data.features[0].center[1],
            lng:response.data.features[0].center[0],
        //   details:response.data,
            
        }
        return coords
    
} catch (error) {

    throw new HttpError('location not found,check the address',403)
}

}


module.exports=get_coordinates

