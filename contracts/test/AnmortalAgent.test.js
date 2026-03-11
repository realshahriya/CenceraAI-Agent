const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
require("@nomicfoundation/hardhat-chai-matchers");
const { expect } = require("chai");

describe("CenceraAgent", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployCenceraAgentFixture() {
        const [owner, otherAccount] = await ethers.getSigners();

        const CenceraAgentFactory = await ethers.getContractFactory("CenceraAgent");
        const CenceraAgent = await CenceraAgentFactory.deploy();

        return { CenceraAgent, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("Should start with 0 agents", async function () {
            const { CenceraAgent } = await loadFixture(deployCenceraAgentFixture);
            // We can't easily check private counter, but we can check if getting agent 1 fails
            await expect(CenceraAgent.getAgent(1n)).to.be.revertedWithCustomError(CenceraAgent, "AgentDoesNotExist");
        });
    });

    describe("Agent Creation", function () {
        it("Should create a new agent", async function () {
            const { CenceraAgent, owner } = await loadFixture(deployCenceraAgentFixture);
            await CenceraAgent.createAgent("hash1");

            const agent = await CenceraAgent.getAgent(1n);
            expect(agent.id).to.equal(1n);
            expect(agent.owner).to.equal(owner.address);
            expect(agent.memoryHash).to.equal("hash1");
            expect(agent.innovationScore).to.equal(0n);
        });

        it("Should emit AgentCreated event", async function () {
            const { CenceraAgent, owner } = await loadFixture(deployCenceraAgentFixture);
            await expect(CenceraAgent.createAgent("hash1"))
                .to.emit(CenceraAgent, "AgentCreated")
                .withArgs(1n, owner.address, "hash1");
        });
    });

    describe("Memory Update", function () {
        it("Should update memory hash", async function () {
            const { CenceraAgent, owner } = await loadFixture(deployCenceraAgentFixture);
            await CenceraAgent.createAgent("hash1");

            await CenceraAgent.updateMemory(1n, "hash2");
            const agent = await CenceraAgent.getAgent(1n);
            expect(agent.memoryHash).to.equal("hash2");
        });

        it("Should increment innovation score", async function () {
            const { CenceraAgent, owner } = await loadFixture(deployCenceraAgentFixture);
            await CenceraAgent.createAgent("hash1");

            await CenceraAgent.updateMemory(1n, "hash2");
            const agent = await CenceraAgent.getAgent(1n);
            expect(agent.innovationScore).to.equal(1n);
        });

        it("Should fail if not authorized", async function () {
            const { CenceraAgent, otherAccount } = await loadFixture(deployCenceraAgentFixture);
            await CenceraAgent.createAgent("hash1");

            await expect(CenceraAgent.connect(otherAccount).updateMemory(1n, "hash2"))
                .to.be.revertedWithCustomError(CenceraAgent, "NotAuthorized");
        });
    });
});
