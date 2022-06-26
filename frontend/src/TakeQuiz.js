import React, { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import worldID from "@worldcoin/id";

import {
	Flex,
	Box,
	Spacer,
	Heading,
	Button,
	Stack,
	Input,
	NumberInput,
	NumberInputField,
	Image, 
	UnorderedList,
	ListItem,
  Grid,
  Table,
  Tr,
  Td,
  Radio,
  RadioGroup,Checkbox, CheckboxGroup
} from "@chakra-ui/react";


const {abi} = require("/Users/dhana/wpp/frontend/src/WPP.json")
 
function Takequiz() {	
    const [value, setValue] = React.useState('1')

    const claimRewards= async () => {
		try {

            const result = await worldID.enable(); // <- Send 'result' to your backend or smart contract
        
            console.log("World ID verified successfully!");
        
          } catch (failure) {
        
            console.warn("World ID verification failed:", failure);
        
            // Re-activate here so your end user can try again
        
          }
         // claim();
	  };

      /* Note - THIS NEEDS TO BE WORKED UPON
      const claim= async () => {
		
		const ethers = Moralis.web3Library; // get ethers.js library
		const web3Provider = await Moralis.enableWeb3(); // Get ethers.js web3Provider
		const gasPrice = await web3Provider.getGasPrice();

		const signer = web3Provider.getSigner();

		// WPP contract on Mumbai
		const contract = new ethers.Contract('0xfAe23599D813Df325dA8Dfc29f8cF71569d113A8', abi, signer);

		const transaction = await contract.submitTokenClaim(signer.address,'0xA236F90a2838CA0E5fff94407dD88394EcD00F29', '1', {
  			gasLimit: 100000000,
  			gasPrice: gasPrice,
		});
		await transaction.wait();	
		};
        */
      useEffect(() => {
        try {
          worldID.init("world-id-container", {
            enable_telemetry: true,
            action_id: "your_id",
            signal: "your_action",
          });
        } catch (failure) {
          
        }
      }, []);

	return (
        <>
        <Flex sx={{ margin: 3 }}>				
			<Spacer />				
			</Flex>
			
			<Flex sx={{ margin: 3 }} >				
				<Box p="2">
					<Heading size="md">Worldcoin</Heading>
					<h3>Worldcoin is a digital currency that launches by giving away a piece to every person in the world. Co-founded in 2020 by former Y Combinator chief Sam Altman, Worldcoin aims to photograph the irises of everyone on earth in order to identify them so it can distribute its new digital money fairly. So far, the company has collected images of the eyes of hundreds of thousands of people in about 20 countries.
A biometric system can be used as the foundation for Proof-of-Personhood by ensuring each person can only register once. Similar to biometric identification, the system needs to compare each user's embedding to every other entry in the database.
Proof of personhood (PoP) is a means of resisting malicious attacks on peer to peer networks, particularly, attacks that utilize multiple fake identities, such as a Sybil attack.
 Hubble, a minimal, application-specific rollup. It allows a highly efficient, but also permissionless and non-custodial airdrop at the scale of one billion people.</h3> 
					<h4>Take quiz and claim your Worldcoin</h4>
                    <ol>
                    <Spacer />
						<li>What is worldcoin?</li> 
                        <Stack spacing={5} >
                        <Checkbox >a. Worldcoin is a Non-fungible Token(NFT)</Checkbox>
                        <Checkbox defaultChecked>b. Worldcoin is an Ethereum-based “new, collectively owned global currency that will be distributed fairly to as many people as possible</Checkbox>
                        </Stack>
                        <Spacer />
						<li>What is  Proof-of-Personhood?</li> 
                        <Stack spacing={5} >
                        <Checkbox defaultChecked>a. Proof of personhood (PoP) is a means of resisting malicious attacks on peer to peer networks, particularly, attacks that utilize multiple fake identities, such as a Sybil attack.</Checkbox>
                        <Checkbox >b. Person claiming a token multiple times</Checkbox>
                        </Stack>
                        <Spacer />
						<li>What is Hubble?</li>
                        <Stack spacing={5} >
                        <Checkbox defaultChecked>a. Hubble is an ERC-20 token transfer solution that improves Ethereum throughput from 20 transactions per second to ~2700</Checkbox>
                        <Checkbox >b. Native currency of Polygon</Checkbox>
                        </Stack>
						</ol>
                        <h4>Your score: 3 out of 3</h4>
                        <div id="world-id-container"></div>
                        <Button style={{backgroundColor: 'black', color:"white", fontFamily:"cursive", width:"300px",height: '30px'}}onClick={claimRewards}>Claim Rewards</Button>
				</Box>
			<Spacer />
			</Flex>	    
		</>
	);	
}

export default Takequiz;