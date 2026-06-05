
const binarySearch =(array,findNumber)=>{
if(!Array.isArray(array))return("fist parameter must be array")
if(array.length===0)return("this array is empty")
let found=false;
let index=Math.ceil(array.length/2);
let prev=0;
let top=array.length;
let low=0;
let countRond=0;
while(!found&&countRond<array.length)
{
    ++countRond;
    if(findNumber===array[index])
    {   
        found=true;
        break;
    }
    
    if(prev===index)break;
    else if(findNumber>array[index])
    {//console.log(`index:${index} top:${top} low:${low} prev:${prev}`)
        if(index>low)    
            low=index
        
        prev=index;
        index=Math.ceil(((top-prev)/2)+index)

        
    }else{
        // console.log(`index:${index} top:${top} low:${low} prev:${prev}`)
        if(index<top){
            top=index;
        }
        prev=index
        index=Math.floor(((index-low)/2))
    }
}
if(!found){
    return(findNumber+"not in array");
}else{
    return(`use${countRond} to fide${findNumber} found at index: ${index}`)
}
}


const testArray=[1,2,3,4,5,6,7,8,9,10,11,12,13,15,16,17,18,19,20]

for(let i=0;i<testArray.length;i++)
{
    console.log(binarySearch(testArray,i));
}