// scripts/deploy.ts
import { ethers, network } from "hardhat";
import { writeFileSync } from "fs";
import { join } from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy ServareNFT
  const ServareNFT = await ethers.getContractFactory("ServareNFT");
  const servareNFT = await ServareNFT.deploy();
  await servareNFT.deployed();
  console.log("ServareNFT deployed to:", servareNFT.address);

  // Deploy Marketplace
  const ServareMarketplace = await ethers.getContractFactory("ServareMarketplace");
  const marketplace = await ServareMarketplace.deploy(
    servareNFT.address,
    process.env.VET_TOKEN_ADDRESS,
    process.env.FEE_COLLECTOR_ADDRESS
  );
  await marketplace.deployed();
  console.log("ServareMarketplace deployed to:", marketplace.address);

  // Deploy SupplyChainTracking
  const SupplyChainTracking = await ethers.getContractFactory("SupplyChainTracking");
  const supplyChain = await SupplyChainTracking.deploy(servareNFT.address);
  await supplyChain.deployed();
  console.log("SupplyChainTracking deployed to:", supplyChain.address);

  // Grant roles
  const producerRole = await servareNFT.PRODUCER_ROLE();
  const verifierRole = await servareNFT.VERIFIER_ROLE();

  await servareNFT.grantRole(producerRole, process.env.INITIAL_PRODUCER);
  await servareNFT.grantRole(verifierRole, process.env.INITIAL_VERIFIER);

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    servareNFT: servareNFT.address,
    marketplace: marketplace.address,
    supplyChain: supplyChain.address,
    timestamp: new Date().toISOString()
  };

  writeFileSync(
    join(__dirname, `../deployment.${network.name}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });