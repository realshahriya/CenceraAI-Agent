const { spawn } = require('child_process');
const path = require('path');

class MembaseService {
    constructor() {
        // Path to the python bridge script
        this.bridgeScript = path.join(__dirname, 'membase_bridge.py');
    }

    async uploadMemory(memoryData) {
        console.log(`[Membase] Uploading ${memoryData.type} to Unibase Decentralized Storage using Web3 Wallet Auth...`);

        return new Promise((resolve, reject) => {
            // Prepare Unibase Environment Variables from existing Private Key
            let privateKey = process.env.PRIVATE_KEY || "";
            if (privateKey && !privateKey.startsWith("0x")) {
                privateKey = "0x" + privateKey;
            }
            
            let membaseAccount = "0x0000000000000000000000000000000000000000";
            if (privateKey) {
                try {
                    const { ethers } = require('ethers');
                    const wallet = new ethers.Wallet(privateKey);
                    membaseAccount = wallet.address;
                } catch (e) {
                    console.error("[Membase] Warning: Failed to derive wallet address from PRIVATE_KEY:", e.message);
                }
            }

            const pythonEnv = {
                ...process.env,
                MEMBASE_ID: "cencera-agent",
                MEMBASE_ACCOUNT: membaseAccount,
                MEMBASE_SECRET_KEY: privateKey
            };

            // Spawn the python process with the injected Web3 environment
            const pythonProcess = spawn('python', [this.bridgeScript], { env: pythonEnv });

            let resultData = '';
            let errorData = '';

            // Collect data from standard output
            pythonProcess.stdout.on('data', (data) => {
                resultData += data.toString();
            });

            // Collect data from standard error
            pythonProcess.stderr.on('data', (data) => {
                errorData += data.toString();
            });

            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error(`[Membase] Python bridge exited with code ${code}`);
                    console.error(`[Membase Error]: ${errorData}`);
                    return reject(new Error(`Python process exited with code ${code}`));
                }

                try {
                    // Try parsing the python script's JSON output
                    const jsonResponse = JSON.parse(resultData);

                    if (jsonResponse.status === 'success') {
                        console.log(`[Membase] Success: Memory persisted on Unibase.`);
                        console.log(`[Membase] CID: ${jsonResponse.cid}`);
                        resolve(jsonResponse.cid);
                    } else {
                        console.error(`[Membase] Unibase Upload Failed: ${jsonResponse.message}`);
                        reject(new Error(jsonResponse.message));
                    }
                } catch (e) {
                    console.error(`[Membase] Failed to parse output: ${resultData}`);
                    reject(new Error("Invalid response from Python bridge."));
                }
            });

            // Send the memory payload to the Python script via stdin
            pythonProcess.stdin.write(JSON.stringify(memoryData));
            pythonProcess.stdin.end();
        });
    }
}

module.exports = { membaseService: new MembaseService() };
