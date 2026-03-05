const { spawn } = require('child_process');
const path = require('path');

class MembaseService {
    constructor() {
        // Path to the python bridge script
        this.bridgeScript = path.join(__dirname, 'membase_bridge.py');
    }

    async uploadMemory(memoryData) {
        console.log(`[Membase] Uploading ${memoryData.type} to Unibase Decentralized Storage...`);

        return new Promise((resolve, reject) => {
            // Spawn the python process
            const pythonProcess = spawn('python', [this.bridgeScript]);

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

            // Add the JWT token to the memory payload payload
            const payload = {
                ...memoryData,
                jwt: process.env.UNIBASE_JWT || process.env.PINATA_JWT || ""
            };

            // Send the memory payload to the Python script via stdin
            pythonProcess.stdin.write(JSON.stringify(payload));
            pythonProcess.stdin.end();
        });
    }
}

module.exports = { membaseService: new MembaseService() };
