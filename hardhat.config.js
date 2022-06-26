require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")

require('dotenv').config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const POLYGON_RPC_URL = process.env.POLYGON_URL;
const POLYGON_API_KEY = process.env.POLYGONSCAN_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  //defaultNetwork: "hardhat",
  networks: {
      hardhat: {
      },      
      mumbai: {
          url: POLYGON_RPC_URL,
          accounts: [PRIVATE_KEY],
          saveDeployments: true,
      },     
  },
  etherscan: {
      // Your API key for Etherscan
      // Obtain one at https://etherscan.io/
      //apiKey: ETHERSCAN_API_KEY
     apiKey: POLYGON_API_KEY
  },
  namedAccounts: {
      deployer: {
          default: 0, // here this will by default take the first account as deployer
          1: 0 // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
      },
      feeCollector: {
          default: 1
      }
  },
  solidity: {
      compilers: [
          {
              version: "0.8.7"
          },
          {
              version: "0.6.6"
          },
          {
              version: "0.4.24"
          }
      ]
  },
  paths: {
      artifacts: './src/artifacts',
    },
  mocha: {
      timeout: 100000
  }
}

