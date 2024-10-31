// scripts/deploy.ts
import { ethers } from "hardhat";
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

  // Deploy ServareMarketplace
  const ServareMarketplace = await ethers.getContractFactory("ServareMarketplace");
  const marketplace = await ServareMarketplace.deploy(
    servareNFT.address,
    process.env.VET_TOKEN_ADDRESS,
    process.env.FEE_COLLECTOR_ADDRESS
  );
  await marketplace.deployed();
  console.log("ServareMarketplace deployed to:", marketplace.address);

  // Deploy SupplyChainTracking
  const SupplyChainTracking = await ethers.getContractFactory(
    "SupplyChainTracking"
  );
  const tracking = await SupplyChainTracking.deploy(servareNFT.address);
  await tracking.deployed();
  console.log("SupplyChainTracking deployed to:", tracking.address);

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    nft: servareNFT.address,
    marketplace: marketplace.address,
    tracking: tracking.address,
    timestamp: new Date().toISOString(),
  };

  writeFileSync(
    join(__dirname, `../deployments/${network.name}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );

  // Set up roles and permissions
  const producerRole = await servareNFT.PRODUCER_ROLE();
  const verifierRole = await servareNFT.VERIFIER_ROLE();
  const trackerRole = await tracking.TRACKER_ROLE();

  // Grant roles to initial addresses
  if (process.env.INITIAL_PRODUCER) {
    await servareNFT.grantRole(producerRole, process.env.INITIAL_PRODUCER);
    console.log("Granted PRODUCER_ROLE to:", process.env.INITIAL_PRODUCER);
  }

  if (process.env.INITIAL_VERIFIER) {
    await servareNFT.grantRole(verifierRole, process.env.INITIAL_VERIFIER);
    console.log("Granted VERIFIER_ROLE to:", process.env.INITIAL_VERIFIER);
  }

  // Verify contracts
  if (process.env.VERIFY_CONTRACTS === "true") {
    console.log("Verifying contracts...");
    
    await hre.run("verify:verify", {
      address: servareNFT.address,
      constructorArguments: [],
    });

    await hre.run("verify:verify", {
      address: marketplace.address,
      constructorArguments: [
        servareNFT.address,
        process.env.VET_TOKEN_ADDRESS,
        process.env.FEE_COLLECTOR_ADDRESS,
      ],
    });

    await hre.run("verify:verify", {
      address: tracking.address,
      constructorArguments: [servareNFT.address],
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });