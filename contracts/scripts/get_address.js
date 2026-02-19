const hre = require("hardhat");

async function main() {
    const pk = process.env.PRIVATE_KEY;
    if (!pk) {
        console.log("No PRIVATE_KEY found");
        return;
    }

    try {
        if (pk.includes(" ")) {
            // Mnemonic
            const wallet = hre.ethers.Wallet.fromPhrase(pk);
            console.log("Address:", wallet.address);
        } else {
            // Private Key
            const wallet = new hre.ethers.Wallet(pk);
            console.log("Address:", wallet.address);
        }
    } catch (e) {
        console.error("Error deriving address:", e.message);
    }
}

main();
