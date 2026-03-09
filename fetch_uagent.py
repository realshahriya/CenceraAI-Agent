import os
from uagents import Agent, Context, Model
from dotenv import load_dotenv

load_dotenv()

# --- Configuration ---
# This seed ensures the agent has a persistent address on the Fetch.ai Network
AGENT_SEED = os.getenv("FETCH_AGENT_SEED", "cencera_ai_eternal_seed_phrase")

# Initialize the Official Fetch.ai uAgent
cencera_fetch_agent = Agent(
    name="CenceraAI",
    port=8001,
    seed=AGENT_SEED,
    endpoint=["http://127.0.0.1:8001/submit"],
)

class AgentQuery(Model):
    query: str

class AgentResponse(Model):
    text: str

@cencera_fetch_agent.on_event("startup")
async def startup(ctx: Context):
    ctx.logger.info(f"CenceraAI Fetch.ai Gateway started!")
    ctx.logger.info(f"Fetch.ai Address: {cencera_fetch_agent.address}")
    ctx.logger.info("Registering on Agentverse...")

@cencera_fetch_agent.on_message(model=AgentQuery)
async def handle_query(ctx: Context, sender: str, msg: AgentQuery):
    ctx.logger.info(f"Received message from {sender}: {msg.query}")
    
    # Bridge to Node.js Backend for the actual intelligence
    # In a real deployment, this would call the Node.js /chat endpoint
    # For now, we simulate the connection
    response_text = f"Cencera has received your query via the Fetch.ai network. Identity: {cencera_fetch_agent.address}"
    
    await ctx.send(sender, AgentResponse(text=response_text))

if __name__ == "__main__":
    cencera_fetch_agent.run()
