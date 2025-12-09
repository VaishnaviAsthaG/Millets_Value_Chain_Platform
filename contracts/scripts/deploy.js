const hre = require("hardhat");

async function main() {
  console.log("Deploying MilletTraceability contract...");

  const MilletTraceability = await hre.ethers.getContractFactory("MilletTraceability");
  const traceability = await MilletTraceability.deploy();

  await traceability.waitForDeployment();

  const address = await traceability.getAddress();
  console.log("MilletTraceability deployed to:", address);
  console.log("Network:", hre.network.name);
  
  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    address: address,
    network: hre.network.name,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(
    "./deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment info saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


