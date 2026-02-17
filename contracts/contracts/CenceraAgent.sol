// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CenceraAgent {
    // Custom Errors for Gas Optimization
    error NotOwner();
    error AgentDoesNotExist();

    struct Agent {
        uint256 id;
        address owner;          // 20 bytes
        uint96 innovationScore; // 12 bytes (Packed with owner: 20+12 = 32 bytes = 1 slot)
        string memoryHash;
    }

    uint256 private _agentIdCounter;
    mapping(uint256 => Agent) public agents;
    mapping(address => uint256[]) public ownerToAgentIds;

    event AgentCreated(uint256 indexed agentId, address indexed owner, string memoryHash);
    event MemoryUpdated(uint256 indexed agentId, string newMemoryHash);

    constructor() {
        _agentIdCounter = 0;
    }

    function createAgent(string calldata _initialMemoryHash) external returns (uint256) {
        _agentIdCounter++;
        uint256 newAgentId = _agentIdCounter;

        agents[newAgentId] = Agent({
            id: newAgentId,
            owner: msg.sender,
            innovationScore: 0,
            memoryHash: _initialMemoryHash
        });

        ownerToAgentIds[msg.sender].push(newAgentId);

        emit AgentCreated(newAgentId, msg.sender, _initialMemoryHash);

        return newAgentId;
    }

    function updateMemory(uint256 _agentId, string calldata _newMemoryHash) external {
        Agent storage agent = agents[_agentId];
        
        if (agent.owner != msg.sender) {
            revert NotOwner();
        }

        agent.memoryHash = _newMemoryHash;
        
        // Increment score (Safe from overflow on uint96 for realistic use cases)
        unchecked {
            agent.innovationScore++;
        }

        emit MemoryUpdated(_agentId, _newMemoryHash);
    }

    function getAgent(uint256 _agentId) external view returns (Agent memory) {
        if (agents[_agentId].id == 0) {
            revert AgentDoesNotExist();
        }
        return agents[_agentId];
    }

    function getAgentsByOwner(address _owner) external view returns (uint256[] memory) {
        return ownerToAgentIds[_owner];
    }
}
