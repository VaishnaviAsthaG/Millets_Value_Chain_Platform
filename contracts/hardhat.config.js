require("@nomicfoundation/hardhat-toolbox");

// Try to load .env, but continue if it doesn't exist
try {
  require("dotenv").config();
} catch (e) {
  // dotenv not available or .env doesn't exist, use defaults
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    sepolia: {
      url: process.env.RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/WeoY0of6-2TsKu4Y_Pwc7",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : ["d57436693406454381666da41b7588f82610febb2bd72416a35d09a25143d82b"],
      chainId: 11155111
    },
    hardhat: {
      chainId: 1337
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

