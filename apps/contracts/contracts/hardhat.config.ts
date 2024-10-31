// hardhat.config.ts
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-gas-reporter";
import "solidity-coverage";
import * as dotenv from "dotenv";

dotenv.config();
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    vechain_testnet: {
      url: process.env.VECHAIN_TESTNET_URL || "https://testnet.vechain.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 0x5c,
    },
    vechain_mainnet: {
      url: process.env.VECHAIN_MAINNET_URL || "https://mainnet.vechain.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 0x4a,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      vechain: process.env.VECHAIN_API_KEY || "",
    },
    customChains: [
      {
        network: "vechain",
        chainId: 0x4a,
        urls: {
          apiURL: "https://explore.vechain.org/api",
          browserURL: "https://explore.vechain.org",
        },
      },
      {
        network: "vechain_testnet",
        chainId: 0x5c,
        urls: {
          apiURL: "https://explore-testnet.vechain.org/api",
          browserURL: "https://explore-testnet.vechain.org",
        },
      },
    ],
  },
};

export default config;