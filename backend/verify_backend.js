const { spawn } = require('child_process');
const http = require('http');

console.log("Starting server for verification...");
const serverProcess = spawn('node', ['server.js'], { stdio: 'pipe' });

let serverOutput = '';
let autonomousLoopDetected = false;

serverProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log('[SERVER]', output);
    serverOutput += output;

    if (output.includes('Running Autonomous Loop') || output.includes('Evolved:')) {
        autonomousLoopDetected = true;
        console.log("✅ Autonomous loop detected!");
    }

    if (output.includes('Server is running on port')) {
        console.log("Server started. Running API test...");
        testApi();
    }
});

serverProcess.stderr.on('data', (data) => {
    console.error('[SERVER ERROR]', data.toString());
});

function testApi() {
    const data = JSON.stringify({
        message: 'Who are you?',
        agentId: 1,
        walletAddress: '0x123'
    });

    const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/chat',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => responseData += chunk);
        res.on('end', () => {
            console.log('API Response:', responseData);

            // Cleanup
            serverProcess.kill();

            if (res.statusCode === 200 && autonomousLoopDetected) {
                console.log('🎉 Verification SUCCESS: API works and Autonomous Loop runs.');
                process.exit(0);
            } else {
                console.error('❌ Verification FAILED.');
                if (!autonomousLoopDetected) console.error(' - Autonomous loop NOT detected.');
                if (res.statusCode !== 200) console.error(' - API returned status:', res.statusCode);
                process.exit(1);
            }
        });
    });

    req.on('error', (error) => {
        console.error('API Request Error:', error);
        serverProcess.kill();
        process.exit(1);
    });

    req.write(data);
    req.end();
}

// Timeout
setTimeout(() => {
    console.error('Timeout waiting for verification.');
    serverProcess.kill();
    process.exit(1);
}, 10000);
