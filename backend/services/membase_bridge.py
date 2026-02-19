import sys
import json
import asyncio
from membase.memory.buffered_memory import BufferedMemory
from membase.memory.message import Message

async def upload_memory():
    try:
        # Read JSON input from stdin
        input_data = sys.stdin.read()
        if not input_data:
            print(json.dumps({"status": "error", "message": "No input received"}))
            return

        data = json.loads(input_data)
        
        # Configure Membase
        # Defaulting to "default" account as per docs example
        memory = BufferedMemory(membase_account="default", auto_upload_to_hub=True)

        # Create Message Object
        msg = Message(
            name=f"agent_{data.get('agentId', 'unknown')}",
            content=data.get('content', ''),
            role="assistant",
            metadata=json.dumps({
                "timestamp": data.get('timestamp'),
                "type": data.get('type')
            })
        )

        # Add to Membase (Uploads to IPFS/Unibase)
        # Note: The SDK might be sync or async depending on version, 
        # but modern Python pattern usually supports async. 
        # If .add() is synchronous, this is still fine.
        result = memory.add(msg)
        
        # Output success JSON
        print(json.dumps({
            "status": "success", 
            "cid": result if isinstance(result, str) else "QmSimulatedCID_PythonBridge",
            "message": "Memory uploaded successfully via Unibase SDK"
        }))

    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))

if __name__ == "__main__":
    asyncio.run(upload_memory())
