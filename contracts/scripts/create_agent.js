const hre = require("hardhat");
const path = require("path");
// Explicitly load .env from contracts directory
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

async function main() {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    console.log("Loading environment from:", path.resolve(__dirname, "../.env"));
    console.log("CONTRACT_ADDRESS found:", contractAddress);

    if (!contractAddress) {
        console.error("CONTRACT_ADDRESS not found in .env");
        process.exit(1);
    }

    console.log(`Connecting to CenceraAgent at ${contractAddress}...`);
    const CenceraAgent = await hre.ethers.getContractFactory("CenceraAgent");
    const contract = CenceraAgent.attach(contractAddress);

    console.log("Creating Agent 1...");
    const tx = await contract.createAgent("Genesis Memory: Calculated Start");

    console.log(`Transaction sent: ${tx.hash} `);
    await tx.wait();

    console.log("Agent 1 Created Successfully!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
