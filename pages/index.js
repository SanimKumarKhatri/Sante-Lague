import sainte_lague from "../algorithm/sainte-lague";
import Filtering from "../algorithm/filter";
import {fsuvote} from "../public/data";
const seats=9;

function HomePage() {
  //to filter parties with more than 3% vote overall
  const a=Filtering(fsuvote);
  //main formu
  const b=sainte_lague(a,seats);
  console.log(a);
  console.log(b);
    return (<>
      <div><h1>Proportional Representation Seat Allocation Simulation</h1></div>
      <h2>Just look at the console man, nothing to see here for now</h2>
      <h3>I will try to edit this</h3>
      <h4>but god knows when...</h4>
      </>
    )
  }
  
  export default HomePage