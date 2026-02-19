const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Account Address:", deployer.address);
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Current Balance:", hre.ethers.formatEther(balance), "BNB");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
