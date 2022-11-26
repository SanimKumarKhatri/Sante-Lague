import sainte_lague from "../algorithm/sainte-lague";
import Filtering from "../algorithm/filter";
import {voteresult} from "../public/data";
const seats=110;

function HomePage() {
  //to filter parties with more than 3% vote overall
  const a=Filtering(voteresult);
  //main formula
  const b=sainte_lague(a,seats);
  console.log(a);
  console.log(b);
    return (<>
      <div><h1>Proportional Representation Seat Allocation Simulation</h1></div>
      </>
    )
  }
  
  export default HomePage