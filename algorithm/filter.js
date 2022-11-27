
export default function Filtering(x){
    console.log(x);
    var len=x.length;
    var s1=0;
    var temp=[];
    for(var i=0;i<len;i++){
        s1+=x[i][1];
    }
    console.log("sum votes:");
    console.log(s1);
    for(var i=0;i<len;i++){
        if(x[i][1]/s1 >=0.03){
            temp.push(x[i]);
        }
    }
    console.log(temp);
    return temp;
}