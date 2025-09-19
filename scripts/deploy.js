const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying BlueLedger contracts...");

  // Get the contract factories
  const Registry = await ethers.getContractFactory("Registry");
  const Credits1155 = await ethers.getContractFactory("Credits1155");
  const Retirement721 = await ethers.getContractFactory("Retirement721");

  // Deploy contracts
  console.log("Deploying Registry...");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("Registry deployed to:", registryAddress);

  console.log("Deploying Credits1155...");
  const credits1155 = await Credits1155.deploy(
    "https://api.blue-ledger.com/metadata/",
    "https://api.blue-ledger.com/contract-metadata.json"
  );
  await credits1155.waitForDeployment();
  const credits1155Address = await credits1155.getAddress();
  console.log("Credits1155 deployed to:", credits1155Address);

  console.log("Deploying Retirement721...");
  const retirement721 = await Retirement721.deploy(
    "BlueLedger Retirement Certificates",
    "BLRC",
    "https://api.blue-ledger.com/certificates/",
    "https://api.blue-ledger.com/retirement-metadata.json"
  );
  await retirement721.waitForDeployment();
  const retirement721Address = await retirement721.getAddress();
  console.log("Retirement721 deployed to:", retirement721Address);

  // Set up roles and permissions
  console.log("Setting up roles and permissions...");
  
  // Grant REGISTRY_ROLE to registry contract
  await credits1155.grantRole(await credits1155.REGISTRY_ROLE(), registryAddress);
  await retirement721.grantRole(await retirement721.REGISTRY_ROLE(), registryAddress);
  
  console.log("Roles configured successfully!");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    timestamp: new Date().toISOString(),
    contracts: {
      Registry: registryAddress,
      Credits1155: credits1155Address,
      Retirement721: retirement721Address
    }
  };

  console.log("\nDeployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Verify contracts on block explorer (if not localhost)
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("\nWaiting for block confirmations before verification...");
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    try {
      await hre.run("verify:verify", {
        address: registryAddress,
        constructorArguments: [],
      });
      console.log("Registry verified on block explorer");
    } catch (error) {
      console.log("Registry verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: credits1155Address,
        constructorArguments: [
          "https://api.blue-ledger.com/metadata/",
          "https://api.blue-ledger.com/contract-metadata.json"
        ],
      });
      console.log("Credits1155 verified on block explorer");
    } catch (error) {
      console.log("Credits1155 verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: retirement721Address,
        constructorArguments: [
          "BlueLedger Retirement Certificates",
          "BLRC",
          "https://api.blue-ledger.com/certificates/",
          "https://api.blue-ledger.com/retirement-metadata.json"
        ],
      });
      console.log("Retirement721 verified on block explorer");
    } catch (error) {
      console.log("Retirement721 verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
