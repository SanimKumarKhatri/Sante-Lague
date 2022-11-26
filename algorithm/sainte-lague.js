
function sum(s){
    var sum=0;
    let len=s.length;
    for(var i=0;i<len;i++){
        sum+=s[i];
    }
    return sum;
}
function max(f){
    var max=-Infinity;
    let len=f.length;
    for(var i=0;i<len;i++){
        if(f[i]>max){
            max=f[i];
        }
    }
    return max;
}
function sainte_lague(x, seats){
    //main formula
    var v= new Array();
    var t=new Array();
    var result=[];
    var s= new Array();
    let len = x.length;
    for(var i =0; i<len;i++){
        t[i]=v[i]=x[i][1];
        s[i]=0;
    }
    console.log(v);
    console.log(s);
    while(sum(s)<seats){
        if(sum(s)==0){
            for(var i=0; i<len;i++){
                v[i]=t[i]/((2*s[i])+1);
            }
        }
        var m=max(v);
        for(var i=0;i<len;i++){
            if(v[i]==m){
                s[i]++;
                v[i]=t[i]/((2*s[i])+1);
            }
        }
        console.log(v);
        console.log(s);
    }

    for(var i=0;i<len;i++){
        result[i]=[x[i][0],x[i][1],s[i]];
    }
    return result;  
}

export default sainte_lague;