const hre = require("hardhat");

async function main() {
  console.log("Deploying MilletTraceability contract to local network...");

  const MilletTraceability = await hre.ethers.getContractFactory("MilletTraceability");
  const traceability = await MilletTraceability.deploy();

  await traceability.waitForDeployment();

  const address = await traceability.getAddress();
  console.log("MilletTraceability deployed to:", address);
  console.log("Network: localhost (Hardhat)");
  
  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    address: address,
    network: "localhost",
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(
    "./deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment info saved to deployment.json");
  console.log("\nTo use this contract in backend:");
  console.log(`1. Update backend/.env with: CONTRACT_ADDRESS=${address}`);
  console.log("2. Restart the backend server");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


