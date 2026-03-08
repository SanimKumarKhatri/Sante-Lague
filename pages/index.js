import { useState, useEffect } from 'react';
import sainte_lague from "../algorithm/sainte-lague";
import Filtering from "../algorithm/filter";
import { getLiveElectionData } from "../public/data";

const seats=110;

function HomePage() {
  const [partyData, setPartyData] = useState([]);
  const [allocatedSeats, setAllocatedSeats] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalVotes, setTotalVotes] = useState(0);
  const [threshold, setThreshold] = useState(0);

  useEffect(() => {
    async function loadData() {
      // 1. Fetch the data from your JSON/API
      const pr_votes = await getLiveElectionData();

      // 2. Get FPTP Data (Won/Leading)
      const fptpRes = await fetch('/fptp_results.json');
      const fptpData = await fptpRes.json();
      
      if (pr_votes && pr_votes.length > 0) {
        // 2. Apply your 3% Threshold Filter
        // Note: Assuming Filtering expects the 2D array [["Party", votes], ...]
        const totalVotes = pr_votes.reduce((sum, party) => sum + party[1], 0);
        const threshold = Math.ceil(totalVotes * 0.03);
        const qualifiedParties = Filtering(pr_votes); 
        console.log("qualified",qualifiedParties);
        // 3. Run Sainte-Laguë Algorithm
        const prSeatsArray = sainte_lague(qualifiedParties, seats);
        const prSeatsMap = Object.fromEntries(
            prSeatsArray.map(item => [item[0], item[2]]) // Mapping Party Name to Seats Won
          );

        const finalTable = fptpData.map(party => {
  const name = party.Party;
  
  // Use 'fptpWon' here so it matches the return object below
  const fptpWon = party.Won || 0; 
  const leading = party.Leading || 0;
  
  // Ensure prSeatsMap lookup is working
  const prWon = prSeatsMap[name] || 0;
  const isIndependent = (name === "स्वतन्त्र");
  const isNational = !isIndependent && fptpWon >= 1 && prWon >= 1;
  const metThreshold = (prWon > 0);

  return {
    name,
    fptpWon, // This matches the variable defined above
    leading,
    prWon,
    projected: fptpWon + prWon + leading,
    isNational,
    metThreshold
  };
});
        setTotalVotes(totalVotes);
        setThreshold(threshold);
        setPartyData(pr_votes);
        setAllocatedSeats(prSeatsArray);
        setCombinedData(finalTable.sort((a, b) => b.projected - a.projected));
      }
      setLoading(false);
    }

    loadData();
  }, []);

  const getMajorityBadge = (projected) => {
  if (projected >= 184) {
    return <span style={{ marginLeft: '10px', fontSize: '0.8em', padding: '2px 6px', backgroundColor: '#e74c3c', color: 'white', borderRadius: '4px' }}>2/3 Majority</span>;
  }
  if (projected >= 138) {
    return <span style={{ marginLeft: '10px', fontSize: '0.8em', padding: '2px 6px', backgroundColor: '#3498db', color: 'white', borderRadius: '4px' }}>Majority</span>;
  }
  return null;
};

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}><h2>Loading Live Election Data...</h2></div>;

  return (
    <div style={{ padding: '30px', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f9f9f9' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>House of Representatives Seat Projection</h1>
      
      {/* Summary Table: Combined FPTP + PR */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>Final Projected Standings (275 Total)</h2>
        <table border="1" cellPadding="12" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <thead style={{ backgroundColor: '#34495e', color: 'white' }}>
            <tr>
              <th>Political Party</th>
              <th style={{ backgroundColor: '#32ae27' }}>FPTP Won</th>
              <th >FPTP Leading</th>
              <th>PR Projected</th>
              <th style={{ backgroundColor: '#aea027' }}>Projected Total</th>
            </tr>
          </thead>
          <tbody>
            {combinedData.map((party, index) => (
              <tr key={index} style={{ textAlign: 'center' }}>
                <td style={{ textAlign: 'left', fontWeight: 'bold' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap'}}><span>{party.name}</span>
                  {party.isNational && ( <span style={{ color: '#27ae60', 
                                                        fontSize: '0.75em', 
                                                        border: '1px solid #27ae60', 
                                                        padding: '2px 6px', 
                                                        borderRadius: '4px',
                                                        backgroundColor: 'rgba(39, 174, 96, 0.1)',
                                                        whiteSpace: 'nowrap' }}>National Party</span>)}
                {getMajorityBadge(party.projected)}</div></td>
                <td style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#32ae27' }}>{party.fptpWon}</td>
                <td>{party.leading}</td>                
                <td>{party.prWon}</td>
                <td style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#aea027' }}>{party.projected}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Table: PR Seats Breakdown */}
        <section style={{ flex: 1, minWidth: '400px' }}>
          <h3>PR Projected (Sainte-Laguë)</h3>
          <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#f0f9ff' }}>
            <thead>
              <tr>
                <th>Party</th>
                <th>Seats</th>
              </tr>
            </thead>
            <tbody>
              {allocatedSeats.map((item, index) => (
                <tr key={index}>
                  <td>{item[0]}</td>
                  <td style={{ fontWeight: 'bold', textAlign: 'center' }}>{item[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Table: Live PR Votes */}
        <section style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ marginBottom: '10px' }}>
          <h3 style={{ margin: 0 }}>Current PR Vote Tally</h3>
          
          {/* Simple Text Variable Display */}
          <p style={{ fontSize: '0.9rem', color: '#555', marginTop: '5px' }}>
            Total PR Votes: <strong>{totalVotes.toLocaleString()}</strong> | 
            3% Threshold: <span style={{ color: '#e67e22', fontWeight: 'bold' }}>{threshold.toLocaleString()}</span>
          </p>
        </div>
          <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
            <thead>
              <tr>
                <th>Party</th>
                <th>Votes</th>
              </tr>
            </thead>
            <tbody>
              {partyData.slice(0, 10).map((item, index) => ( // Only showing top 10 for clarity
                <tr key={index}>
                  <td>{item[0]}</td>
                  <td>{item[1].toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p><i>Showing top 10 parties by vote count...</i></p>
        </section>
      </div>
    </div>
  );
}
  
  export default HomePage