$body = @{
    agentId = "testuser"
    message = "Hello, testing the Membase connection!"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3002/chat" -Method Post -ContentType "application/json" -Body $body
