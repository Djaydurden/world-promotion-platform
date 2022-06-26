
const hre = require("hardhat");

async function main() {
 
  const signer0 = await hre.ethers.provider.getSigner(0);
  const addr0 = await signer0.getAddress();

  const Contract = await hre.ethers.getContractFactory("WPP");
  const contract = await Contract.deploy(addr0);
  await contract.deployed();
  
  console.log("WPP Contract deployed to:", contract.address);

    const initialSupply = await ethers.utils.parseEther("50000");
    const Token = await ethers.getContractFactory("PromoToken");
    const token = await Token.deploy(initialSupply);
    await token.deployed();

    console.log("Token Contract deployed to:", token.address);

}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
