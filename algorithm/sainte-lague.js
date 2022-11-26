//code to be added for the sainte lague formula
function sainte_lague(voteresult, seats){
    //main formula
    var s=0;
    while(voteresult>seats){
        voteresult = voteresult/(2*s+1.4);
        s++;
    }
    //algorithm to assign number of seats to be added
    return s;
}

export default sainte_lague;