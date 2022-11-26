import sainte_lague from "../algorithm/sainte-lague";
const voteresult = (
  [
      ['uml',1000],
      ['np',2000],
      ['cpn-maoist',300]
  ])

const seats=175;

function HomePage() {
  const a=sainte_lague(voteresult,seats);
  console.log(a);
    return (<>
      <div>Welcome to the site</div>
      </>
    )
  }
  
  export default HomePage