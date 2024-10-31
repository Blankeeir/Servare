import { ethers, network } from 'hardhat';
import { getABI } from '../utils/abi';

import { writeFileSync } from "fs";
import { join } from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // Deploy ServareNFT
  const ServareNFT = await ethers.getContractFactory("ServareNFT");
  const servareNFT = await ServareNFT.deploy();
  await servareNFT.deployed();

  // Deploy ServareMarketplace
  const ServareMarketplace = await ethers.getContractFactory("ServareMarketplace");
  const marketplace = await ServareMarketplace.deploy(
    servareNFT.address,
    process.env.VET_TOKEN_ADDRESS,
    process.env.FEE_COLLECTOR_ADDRESS
  );
  await marketplace.deployed();

  // Deploy SupplyChainTracking
  const SupplyChainTracking = await ethers.getContractFactory("SupplyChainTracking");
  const tracking = await SupplyChainTracking.deploy(servareNFT.address);
  await tracking.deployed();

  // Grant roles
  const producerRole = await servareNFT.PRODUCER_ROLE();
  const verifierRole = await servareNFT.VERIFIER_ROLE();
  const trackerRole = await tracking.TRACKER_ROLE();

  await servareNFT.grantRole(producerRole, process.env.INITIAL_PRODUCER);
  await servareNFT.grantRole(verifierRole, process.env.INITIAL_VERIFIER);
  await tracking.grantRole(trackerRole, process.env.INITIAL_TRACKER);

  // Write deployment info
  const deployment = {
    network: network.name,
    nft: servareNFT.address,
    marketplace: marketplace.address,
    tracking: tracking.address,
    timestamp: new Date().toISOString()
  };

  writeFileSync(
    join(__dirname, `../deployment.${network.name}.json`),
    JSON.stringify(deployment, null, 2)
  );
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});