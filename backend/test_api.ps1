$body = @{
    agentId = 1
    walletAddress = "0x53Eb00Ac118a8A5E95E40Ee65CA65dB2ba0aDFb4"
    message = "Hello, testing the ASI connection!"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/chat" -Method Post -ContentType "application/json" -Body $body
