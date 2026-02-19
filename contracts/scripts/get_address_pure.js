const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config();

const pk = process.env.PRIVATE_KEY;
if (!pk) {
    console.log("No PRIVATE_KEY found");
    fs.writeFileSync("address.txt", "Error: No PRIVATE_KEY found");
    process.exit(1);
}

try {
    const wallet = pk.includes(" ")
        ? ethers.Wallet.fromPhrase(pk)
        : new ethers.Wallet(pk);
    console.log("Address:", wallet.address);
    fs.writeFileSync("address.txt", wallet.address);
    process.exit(0);
} catch (e) {
    console.error("Error:", e.message);
    fs.writeFileSync("address.txt", "Error: " + e.message);
    process.exit(1);
}
