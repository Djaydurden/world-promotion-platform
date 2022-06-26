import worldID from "@worldcoin/id";
/*
worldID.init('world-id-container', {
    action_id: 'wid_staging_c332a9ead76037f5ee9af8ebd0c822ce', // obtain this from developer.worldcoin.org
    signal: 'hello',
    enableTelemetry: true, // optional, but recommended
  })
*/  

function Claim() {	
    
	return (
	<html>    
    <body>
    <div id="world-id-container"></div>   
      <div class="button" id="deploy">
        
      </div>    
  </body>
  </html>
	);
}

export default Claim;