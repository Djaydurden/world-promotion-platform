const hre = require("hardhat");
const { assert } = require("chai");
const { ethers } = require("hardhat");
let contract;
let signer0, addr0, Owner;
let signer1, addr1, signer2, addr2;
let token, tokenAddress, cID, token2, tokenAddress2;

const {abi} = require("/Users/dhana/wpp/src/artifacts/contracts/PromoToken.sol/PromoToken.json")

describe("WPP", function () {
  before(async () => {  
    signer0 = await hre.ethers.provider.getSigner(0);
    addr0 = await signer0.getAddress(); 
    console.log("addr0" + addr0)
    signer1 = await hre.ethers.provider.getSigner(1);
    addr1 = await signer1.getAddress(); 
    console.log("addr1" + addr1) 
    signer2 = await hre.ethers.provider.getSigner(2);
    addr2 = await signer2.getAddress(); 
    console.log("addr2" + addr2)          
    
    const Contract = await ethers.getContractFactory("WPP");
    contract = await Contract.deploy(addr0);
    await contract.deployed();
    console.log("Contract deployed at: "+ contract.address);  
    
  const initialSupply = await ethers.utils.parseEther("50000");
  const PromoToken = await hre.ethers.getContractFactory("PromoToken");
  token = await PromoToken.deploy(initialSupply);
  tokenAddress = token.address;    

  await token.deployed();

  console.log("Token1 deployed to:", token.address);  

  });
  
  
  describe('Uploader 1: CREATES PROMOTION', () => {
    before(async () => {                      
              //address _tokenAddress, uint _totalNumOftokens, uint  _NumOftokensPerTrng,string calldata _cid    
              tokenAddress = token.address;
              cID = "QmUvQuSXngnTCMzUFhLDGsCQaJk53EovxFrZPt3DnEqNW1";
              await contract.connect(signer1).createPromotion(tokenAddress, ethers.utils.parseEther('10000'), 5, cID); 
              console.log("********CREATES Promotion***************");          
    });
  
    it('should have created a new promotiin and ID incremented to 1 ', async () => {
               assert.equal((await contract.promotionId()), 1);   //should be 1 not 0    
    });
    
    it('call upkeep ', async () => {
      var str = "0x657468657265756d000000000000000000000000000000000000000000000000";
      await contract.connect(signer1).checkUpkeep(str); 
      //assert.equal((await contract.campaignId()), 1);   //should be 1 not 0    
    });
  }); 

    
  describe('Uploader 1: STARTS PROMOTION', () => {
    before(async () => {           

    //Add Tokens to Contract
    const to = await contract.address;
    const value = ethers.utils.parseEther('10000');    
    console.log(token.address); 
    const tokenContract = new hre.ethers.Contract(token.address, abi, signer0);
    const transferTx = await tokenContract.transfer(to, value);
    await transferTx.wait();
    
    const x = await tokenContract.balanceOf(contract.address);  
    console.log("Contract's Token Balance: "+ await (ethers.utils.formatEther(x)));
    console.log("****************************************");

              await contract.connect(signer1).startPromotion(tokenAddress); 
              console.log("********START PROMOTION***************");          
    });
  
 
   it('should have set promotion correctly', async () => {    
      let {addrs, totalAmount, amtPerTraining, _IPFSCid, _promotionId, _isActive, _state} = await contract.getPromotionInfo(tokenAddress);  
      console.log("****************************************"); 
      console.log(addrs);
      console.log(totalAmount);
      console.log(amtPerTraining);
      console.log(_IPFSCid);
      console.log(_promotionId);  
      console.log(_isActive); 
      console.log(_state); 
      console.log("****************************************");     
    });
  }); 
  
  describe('User 1: COMPLETES TRAINING', () => {
    before(async () => {                 
    console.log("****************************************");
              await contract.connect(signer0).markTrainingCompleted(addr1, tokenAddress, "1"); 
              await contract.connect(signer1).submitTokenClaim(addr1, tokenAddress, "1");
              console.log("********USER INFO UPDATED***************");          
    }); 

    it('should be able to claim ', async () => {
      console.log("********ABLE TO CLAIM***************"); 
      const tokenContract = new hre.ethers.Contract(tokenAddress, abi, signer0);
      const x = await tokenContract.balanceOf(contract.address);  
      console.log("Contract's Token Balance: "+ await (x)); //await (ethers.utils.formatEther(x)));
      console.log("****************************************"); 
      
      const y = await tokenContract.balanceOf(addr1);  
      console.log("User's Token Balance: "+ await (ethers.utils.formatEther(y)));
      console.log("****************************************");
    }); 
        
  }); 



});