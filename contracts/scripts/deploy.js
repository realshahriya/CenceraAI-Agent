const hre = require("hardhat");

async function main() {
    const currentTimestampInSeconds = Math.round(Date.now() / 1000);
    const unlockTime = currentTimestampInSeconds + 60;

    const lockedAmount = hre.ethers.parseEther("0.001");

    const agent = await hre.ethers.deployContract("CenceraAgent", []);

    await agent.waitForDeployment();

    console.log(
        `CenceraAgent deployed to ${agent.target}`
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
