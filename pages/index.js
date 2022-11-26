import sainte_lague from "../algorithm/sainte-lague";

const vote=10000;
const seats=175;
function HomePage() {
  const a=sainte_lague(vote,seats);
  console.log(a);
    return (<>
      <div>Welcome to the site</div>
      </>
    )
  }
  
  export default HomePage