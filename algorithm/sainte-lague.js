
function sainte_lague(x, seats){
    //main formula
    let voteresult = x;
    var s=0;
    for(var i=0; i<3;i++){
    while(voteresult[i][1]>seats){
        console.log(voteresult[i][0]);
        console.log(voteresult[i][1]);
        voteresult[i][1] = voteresult[i][1]/(2*s+1.4);
        s++;
    }
    }
    //algorithm to assign number of seats to be added
    return s;
}

export default sainte_lague;