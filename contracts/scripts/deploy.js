const hre = require("hardhat");

async function main() {
    const CenceraAgent = await hre.ethers.getContractFactory("CenceraAgent");
    const agent = await CenceraAgent.deploy();

    await agent.waitForDeployment();

    console.log(`CenceraAgent deployed to ${agent.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
