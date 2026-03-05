// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CenceraAgent {
    // Custom Errors for Gas Optimization
    error NotOwner();
    error NotAuthorized();
    error AgentDoesNotExist();
    error IdentityAlreadyExists();
    error IdentityDoesNotExist();

    struct Agent {
        uint256 id;
        address owner;          // 20 bytes
        uint96 innovationScore; // 12 bytes (Packed with owner: 20+12 = 32 bytes = 1 slot)
        string memoryHash;
    }

    struct UserIdentity {
        string did;               // Decentralized Identifier
        string personalDataHash;  // IPFS/Unibase CID to encrypted preferences
        bool isActive;
    }

    uint256 private _agentIdCounter;
    mapping(uint256 => Agent) public agents;
    mapping(address => uint256[]) public ownerToAgentIds;
    
    // SSI: User Address -> UserIdentity
    mapping(address => UserIdentity) public identities;
    // SSI: User Address -> Delegated Agent Address -> Is Authorized
    mapping(address => mapping(address => bool)) public authorizedAgents;

    event AgentCreated(uint256 indexed agentId, address indexed owner, string memoryHash);
    event MemoryUpdated(uint256 indexed agentId, string newMemoryHash, address updatedBy);
    
    event IdentityRegistered(address indexed user, string did, string personalDataHash);
    event IdentityUpdated(address indexed user, string newPersonalDataHash);
    event AgentAuthorized(address indexed user, address indexed agentAddress);
    event AgentRevoked(address indexed user, address indexed agentAddress);

    constructor() {
        _agentIdCounter = 0;
    }

    modifier onlyAuthorized(address _user) {
        if (msg.sender != _user && !authorizedAgents[_user][msg.sender]) {
            revert NotAuthorized();
        }
        _;
    }

    // --- SELF SOVEREIGN IDENTITY (SSI) FUNCTIONS ---

    function registerIdentity(string calldata _did, string calldata _personalDataHash) external {
        if (identities[msg.sender].isActive) {
            revert IdentityAlreadyExists();
        }

        identities[msg.sender] = UserIdentity({
            did: _did,
            personalDataHash: _personalDataHash,
            isActive: true
        });

        emit IdentityRegistered(msg.sender, _did, _personalDataHash);
    }

    function updatePersonalData(string calldata _newPersonalDataHash) external {
        if (!identities[msg.sender].isActive) {
            revert IdentityDoesNotExist();
        }

        identities[msg.sender].personalDataHash = _newPersonalDataHash;
        emit IdentityUpdated(msg.sender, _newPersonalDataHash);
    }

    function authorizeAgent(address _agentAddress) external {
        if (!identities[msg.sender].isActive) {
            revert IdentityDoesNotExist();
        }
        authorizedAgents[msg.sender][_agentAddress] = true;
        emit AgentAuthorized(msg.sender, _agentAddress);
    }

    function revokeAgent(address _agentAddress) external {
        authorizedAgents[msg.sender][_agentAddress] = false;
        emit AgentRevoked(msg.sender, _agentAddress);
    }

    // --- AGENT FUNCTIONS ---

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

    // Upgraded to support SSI explicit delegation
    function updateMemory(uint256 _agentId, string calldata _newMemoryHash) external onlyAuthorized(agents[_agentId].owner) {
        Agent storage agent = agents[_agentId];
        
        agent.memoryHash = _newMemoryHash;
        
        // Increment score
        unchecked {
            agent.innovationScore++;
        }

        emit MemoryUpdated(_agentId, _newMemoryHash, msg.sender);
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
