import React, { useState } from "react";
import { useMoralis } from "react-moralis";
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
  Td,Link,ExternalLinkIcon
} from "@chakra-ui/react";


function Home() {	
	return (
		<>
        <Flex sx={{ margin: 3 }}>				
			<Spacer />				
			</Flex>
			
			<Flex sx={{ margin: 3 }} >				
				<Box p="2">
					<Heading size="md">World Promotional Platform is a fully decentralized promotion platform with proof of personhood using Worldcoin (WorldId).</Heading>
					<h3>This prototype demonstrates</h3> 
					<ol>
						<li>In few simple steps anyone can create a promotion for any social or entertainment purpose.</li> 
						<li>Idea is to upload a questionnaire in JSON format and provide details about the ERC20 token they wish to give-away as part of the promotion</li> 
						<Link color='teal.500' href='sample-promotion-file.json'>Sample JSON </Link>
						<li>Anyone can come to the DApp and learn about the promotions and take a short quiz.</li>
						<li>Once all answers are correct user can claim their rewards ONLY once for a particular promotion.</li>
						<li>With the help of WorldId integration, DApp can validate the proof of personhood claiming the rewards.</li>
						</ol>
				</Box>
			<Spacer />
			</Flex>	    
		</>
	);
}

export default Home;