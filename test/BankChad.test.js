const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BankChad", function () {
  let bankChad;
  let owner, alice, bob;

  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();
    const BankChad = await ethers.getContractFactory("BankChad");
    bankChad = await BankChad.deploy();
    await bankChad.waitForDeployment();
  });

  describe("Deploiement", function () {
    it("Definit le bon proprietaire", async function () {
      expect(await bankChad.owner()).to.equal(owner.address);
    });

    it("Initialise totalDeposits a 0", async function () {
      expect(await bankChad.totalDeposits()).to.equal(0);
    });

    it("Initialise transactionCount a 0", async function () {
      expect(await bankChad.transactionCount()).to.equal(0);
    });
  });

  describe("deposit()", function () {
    it("Accepte un depot et met a jour le solde", async function () {
      const amount = ethers.parseEther("1.0");
      await bankChad.connect(alice).deposit({ value: amount });
      expect(await bankChad.getBalance(alice.address)).to.equal(amount);
    });

    it("emet l evenement Deposited", async function () {
      const amount = ethers.parseEther("0.5");
      await expect(bankChad.connect(alice).deposit({ value: amount }))
        .to.emit(bankChad, "Deposited")
        .withArgs(alice.address, amount, amount, await getBlockTimestamp());
    });

    it("Refuse un depot de 0 ETH", async function () {
      await expect(
        bankChad.connect(alice).deposit({ value: 0 })
      ).to.be.revertedWith("BankChad: montant nul");
    });

    it("Cumule plusieurs depots correctement", async function () {
      const amount1 = ethers.parseEther("1.0");
      const amount2 = ethers.parseEther("2.0");
      await bankChad.connect(alice).deposit({ value: amount1 });
      await bankChad.connect(alice).deposit({ value: amount2 });
      expect(await bankChad.getBalance(alice.address)).to.equal(amount1 + amount2);
    });
  });

  describe("withdraw()", function () {
    beforeEach(async function () {
      await bankChad.connect(alice).deposit({ value: ethers.parseEther("2.0") });
    });

    it("Permet de retirer son solde", async function () {
      const withdrawAmount = ethers.parseEther("1.0");
      await bankChad.connect(alice).withdraw(withdrawAmount);
      expect(await bankChad.getBalance(alice.address)).to.equal(ethers.parseEther("1.0"));
    });

    it("emet l evenement Withdrawn", async function () {
      const amount = ethers.parseEther("1.0");
      await expect(bankChad.connect(alice).withdraw(amount))
        .to.emit(bankChad, "Withdrawn");
    });

    it("Refuse si solde insuffisant", async function () {
      await expect(
        bankChad.connect(alice).withdraw(ethers.parseEther("5.0"))
      ).to.be.revertedWith("BankChad: solde insuffisant");
    });

    it("Refuse un retrait de 0", async function () {
      await expect(
        bankChad.connect(alice).withdraw(0)
      ).to.be.revertedWith("BankChad: montant nul");
    });
  });

  describe("transfer()", function () {
    beforeEach(async function () {
      await bankChad.connect(alice).deposit({ value: ethers.parseEther("3.0") });
    });

    it("Transfere les fonds correctement", async function () {
      const amount = ethers.parseEther("1.0");
      await bankChad.connect(alice).transfer(bob.address, amount);
      expect(await bankChad.getBalance(alice.address)).to.equal(ethers.parseEther("2.0"));
      expect(await bankChad.getBalance(bob.address)).to.equal(amount);
    });

    it("emet l evenement Transferred", async function () {
      await expect(
        bankChad.connect(alice).transfer(bob.address, ethers.parseEther("1.0"))
      ).to.emit(bankChad, "Transferred")
        .withArgs(alice.address, bob.address, ethers.parseEther("1.0"), await getBlockTimestamp());
    });

    it("Refuse le transfert a soi-meme", async function () {
      await expect(
        bankChad.connect(alice).transfer(alice.address, ethers.parseEther("1.0"))
      ).to.be.revertedWith("BankChad: transfert a soi-meme interdit");
    });

    it("Refuse le transfert a l adresse zero", async function () {
      await expect(
        bankChad.connect(alice).transfer(ethers.ZeroAddress, ethers.parseEther("1.0"))
      ).to.be.revertedWith("BankChad: adresse zero interdite");
    });

    it("Refuse si solde insuffisant", async function () {
      await expect(
        bankChad.connect(alice).transfer(bob.address, ethers.parseEther("10.0"))
      ).to.be.revertedWith("BankChad: solde insuffisant");
    });
  });

  describe("getStats()", function () {
    it("Retourne les bonnes statistiques", async function () {
      await bankChad.connect(alice).deposit({ value: ethers.parseEther("1.0") });
      await bankChad.connect(bob).deposit({ value: ethers.parseEther("2.0") });
      const [total, count, contractBal] = await bankChad.getStats();
      expect(total).to.equal(ethers.parseEther("3.0"));
      expect(count).to.equal(2);
      expect(contractBal).to.equal(ethers.parseEther("3.0"));
    });
  });
});

async function getBlockTimestamp() {
  const block = await ethers.provider.getBlock("latest");
  return block.timestamp + 1;
}
