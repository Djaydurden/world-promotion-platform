import React, { useState, useRef } from "react";
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
  Td,
  Textarea
} from "@chakra-ui/react";


const {abi} = require("/Users/dhana/wpp/frontend/src/WPP.json")

function CreatePromotion() {	
	const {
		Moralis,
		user,
		logout,
		authenticate,
		enableWeb3,
		isInitialized,
		isAuthenticated,
		isWeb3Enabled,
	} = useMoralis();
	const [values, setValues] = useState({ totalToken: "", tokenPerTraining: "", message:"" });		//To-do change to dynamically read
	const [tokenAddress, setTokenAddress] = React.useState("");

	const uploadtoIPFS= async () => {
		const fileInput = document.getElementById("file")
		const data = fileInput.files[0];		
		const uploadfile = new Moralis.File("file.json", data);
		await uploadfile.saveIPFS();
		console.log(uploadfile.hash());
		console.log(uploadfile.ipfs());
		//createPromotion(uploadfile.hash());
		setValues({ ...values, message: "Congratulations! Promotion Added Successfully"})
	  };

	  //const ethers = Moralis.web3Library;

	  const createPromotion= async (val) => {
		
		const ethers = Moralis.web3Library; // get ethers.js library
		const web3Provider = await Moralis.enableWeb3(); // Get ethers.js web3Provider
		const gasPrice = await web3Provider.getGasPrice();

		const signer = web3Provider.getSigner();

		// wMATIC token on Mumbai
		const contract = new ethers.Contract('0xfAe23599D813Df325dA8Dfc29f8cF71569d113A8', abi, signer);

		const transaction = await contract.createPromotion(values.tokenAddress,values.totalToken, values.tokenPerTraining, ethers.utils.asciiToHex(val), {
  			gasLimit: 100000000,
  			gasPrice: gasPrice,
		});
		await transaction.wait();


		/*
		let web3 = await Moralis.enableWeb3();
		let address = "0xfAe23599D813Df325dA8Dfc29f8cF71569d113A8"
		const contract = new web3.Contract(abi, address.toLowerCase() );
	  
		let receipt = await contract.methods
		  .createPromotion(values.tokenAddress,values.totalToken, values.tokenPerTraining, val)   //to-do
		 // .addToken(values.tokenId,web3.utils.asciiToHex(val))
		  .send({ from: user.attributes.ethAddress, value: 0 })
		  .then((response) => {console.log(response)
			setValues({ ...values, message: "Congratulations! Promotion Added Successfully"})})
		  .catch((err) => console.log(err));
		*/
		}; 

	  const inputFile = useRef(null) 
	  const onButtonClick = () => {
		// `current` points to the mounted file input element
	   inputFile.current.click();
	  };

	return (
		<>
		
		<Flex sx={{ margin: 3 }}>				
			<Spacer />				
			</Flex>
			
			<Flex sx={{ margin: 3 }} >				
				<Box p="2">
					<Heading size="md">Create Promotion</Heading>
				</Box>
			<Spacer />
			</Flex>	

			<Table variant="simple">
			<Tr>
	<Td>		<input type='file' id='file' ref={inputFile} style={{display: 'block'}}/></Td></Tr>
	
	<Tr><Td><Box p="2">
					<h4 size="md">Total Number of Tokens</h4></Box></Td>
					
          <Td><Box p="7">
				<NumberInput
						min={0}
						value={values.totalToken}
						onChange={(valueString) =>
							setValues({ ...values, totalToken: valueString })
						}
					>
						<NumberInputField sx={{ borderColor: "1px solid black" }} />
				</NumberInput>
			</Box></Td>		   						
	</Tr>  

	<Tr><Td><Box p="2">
					<h4 size="md">Number of Tokens per Training</h4></Box></Td>
					
          <Td><Box p="7">
				<NumberInput
						min={0}
						value={values.tokenPerTraining}
						onChange={(valueString) =>
							setValues({ ...values, tokenPerTraining: valueString })
						}
					>
						<NumberInputField sx={{ borderColor: "1px solid black" }} />
				</NumberInput>
			</Box></Td>		   						
	</Tr> 

	<Tr><Td><Box p="2">
					<h4 size="md">Token Address</h4></Box></Td>
					
          <Td><Box p="7">
		  <Input
          width="250px"
        value={tokenAddress}
        onChange={event => setTokenAddress(event.target.value)}    
      />		  
	</Box></Td>		   						
	</Tr>
	<Tr>
	<Td><Button style={{backgroundColor: 'black', color:"white", fontFamily:"cursive", width:"300px",height: '30px'}}onClick={uploadtoIPFS}>Upload Questionnaire and Create Promotion</Button></Td></Tr>
    <Box p="2">
					<h4 size="md"> {values.message} </h4>
      </Box>
     
    </Table>
           
		</>
	);
}

export default CreatePromotion;