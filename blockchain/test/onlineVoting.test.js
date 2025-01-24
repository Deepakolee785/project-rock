// const OnlineVoting = artifacts.require("OnlineVoting");

// contract("OnlineVoting", (accounts) => {
//   const [admin, voter1, voter2] = accounts;

//   beforeEach(async () => {
//     this.contract = await OnlineVoting.new({ from: admin });
//   });

//   it("should add candidates correctly", async () => {
//     await this.contract.addCandidate("Candidate 1", { from: admin });
//     const candidate = await this.contract.candidates(1);
//     assert.equal(candidate.name, "Candidate 1", "Candidate name mismatch");
//   });

//   it("should allow voting and tally votes", async () => {
//     await this.contract.addCandidate("Candidate 1", { from: admin });
//     await this.contract.registerVoter(voter1, { from: admin });
//     await this.contract.startElection({ from: admin });

//     await this.contract.vote(1, { from: voter1 });
//     const candidate = await this.contract.candidates(1);
//     assert.equal(candidate.voteCount, 1, "Vote count mismatch");
//   });
// });

const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    // Contracts are deployed using the first signer/account by default
    const [admin, account1, account2] = await ethers.getSigners();

    const OnlineVoting = await ethers.getContractFactory("OnlineVoting");
    const onlineVoting = await OnlineVoting.deploy();

    return { OnlineVoting, onlineVoting, admin, account1, account2 };
  }

  describe("Deployment", function () {
    it("should set the right owner", async function () {
      const { onlineVoting, admin } = await loadFixture(
        deployOneYearLockFixture
      );
      expect(await onlineVoting.admin()).to.equal(admin.address);
    });

    it("should add candidates correctly", async function () {
      const { onlineVoting } = await loadFixture(deployOneYearLockFixture);
      const candidatesCount = await onlineVoting.candidatesCount();
      expect(candidatesCount).to.equal(0);
      await onlineVoting.addCandidate("Candidate 1");
      const candidate = await onlineVoting.candidates(1);
      expect(candidate.name).to.equal("Candidate 1");
    });
  });
});
