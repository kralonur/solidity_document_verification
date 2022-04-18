import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { ManagementMulti__factory } from "../../src/types";

async function main() {
  const [owner] = await ethers.getSigners();
  const contract = await getContract(owner);
  console.log("ManagementMulti deployed to: ", contract.address);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

async function getContract(owner: SignerWithAddress) {
  const factory = new ManagementMulti__factory(owner);
  const contract = await factory.deploy();
  await contract.deployed();

  return contract;
}
