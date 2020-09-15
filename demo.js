

function meanderingArray(unsorted) {
    // Write your code here
    let result=[]

    let arr=unsorted.sort((a,b)=>b-a)
    // console.log(arr)
    for(let i=1;i<=Math.ceil((arr.length))/2;i++){

        if(i==Math.ceil((arr.length))/2){
            if(arr[i-1]==arr[(arr.length-i)]){
                result.push(arr[i-1])
            }else{
                result.push(arr[i-1],arr[(arr.length-i)])

            }
        }else{
            result.push(arr[i-1],arr[(arr.length-i)])
        }
        
    }

   console.log(result)
}





// meanderingArray([7, 5,2,-1,8,-2,25,25])



const arr=[1,2,3,4,5]



// let res=arr.splice(0,1)

console.log("original:",result)
console.log('--------------')
// console.log("result:",res)