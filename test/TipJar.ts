import { expect } from "chai";
import { ethers } from "hardhat";
import { TipJar } from "../typechain-types";

describe("TipJar Contract", function () {
  let tipJar: TipJar;
  let owner: any;
  let user: any;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    const TipJarFactory = await ethers.getContractFactory("TipJar");
    tipJar = await TipJarFactory.connect(owner).deploy();
    await tipJar.waitForDeployment();
  });

  it("should deploy and set the owner", async () => {
    const contractOwner = await tipJar.owner();
    expect(contractOwner).to.equal(owner.address);
  });

  it("should accept tips with message and emit event", async () => {
    const tipAmount = ethers.parseEther("0.01");
    const message = "Gracias por el servicio!";

    const tx = await tipJar.connect(user).tip(message, { value: tipAmount });

    await expect(tx)
      .to.emit(tipJar, "NewTip")
      .withArgs(user.address, tipAmount, message);

    const [sender, amount, savedMessage] = await tipJar.getTip(0);
    expect(sender).to.equal(user.address);
    expect(amount).to.equal(tipAmount);
    expect(savedMessage).to.equal(message);
  });

  it("should return all tips correctly", async () => {
    await tipJar.connect(user).tip("Tip 1", { value: ethers.parseEther("0.005") });
    await tipJar.connect(user).tip("Tip 2", { value: ethers.parseEther("0.007") });

    const allTips = await tipJar.getAllTips();
    expect(allTips.length).to.equal(2);
    expect(allTips[0].message).to.equal("Tip 1");
    expect(allTips[1].message).to.equal("Tip 2");
  });

  it("should return correct balance after tips", async () => {
    const value = ethers.parseEther("0.03");
    await tipJar.connect(user).tip("Propina grande", { value });
    const balance = await tipJar.getBalance();
    expect(balance).to.equal(value);
  });

  it("should allow owner to withdraw funds", async () => {
    const value = ethers.parseEther("0.02");
    await tipJar.connect(user).tip("Tip", { value });

    const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
    const tx = await tipJar.connect(owner).withdraw();
    const receipt = await tx.wait();

    const gasCost = receipt ? (receipt.gasUsed * receipt.gasPrice) : (ethers.parseUnits("0", "gwei"));      

    const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
    expect(ownerBalanceAfter).to.be.closeTo(ownerBalanceBefore + value - gasCost, ethers.parseEther("0.001"));

});

  it("should revert withdraw if not owner", async () => {
    await expect(tipJar.connect(user).withdraw()).to.be.revertedWith(
      "No autorizado: no es el propietario"
    );
  });

  it("should revert withdraw if no funds", async () => {
    await expect(tipJar.connect(owner).withdraw()).to.be.revertedWith(
      "No hay fondos para retirar"
    );
  });

  it("should revert tip if value is zero", async () => {
    await expect(tipJar.connect(user).tip("Sin ETH")).to.be.revertedWith(
      "Monto propina no valido"
    );
  });

  it("should revert getTip if index out of range", async () => {
    await expect(tipJar.getTip(99)).to.be.revertedWith("Indice invalido");
  });
});
