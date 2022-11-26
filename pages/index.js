import sainte_lague from "../algorithm/sainte-lague";
import {voteresult} from "../public/data";
const seats=8;

function HomePage() {

  const a=sainte_lague(voteresult,seats);
  console.log(a);
    return (<>
      <div><h1>Proportional Representation Seat Allocation Simulation</h1></div>
      </>
    )
  }
  
  export default HomePage