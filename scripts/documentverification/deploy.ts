import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import fs from "fs-extra";
import { ethers } from "hardhat";
import { DocumentVerification__factory } from "../../src/types";

async function main() {
  const [owner] = await ethers.getSigners();
  const args = contractArgs();
  const contract = await getContract(owner, args);
  console.log("DocumentVerification deployed to: ", contract.address);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

async function getContract(owner: SignerWithAddress, args: any[]) {
  const factory = new DocumentVerification__factory(owner);
  const contract = await factory.deploy(args[0]);
  await contract.deployed();

  return contract;
}

function contractArgs() {
  const json = fs.readJSONSync("./deployargs/deployDocumentVerificationArgs.json");

  const management = String(json.management);

  return contractArgsArray(management);
}

function contractArgsArray(management: string) {
  return [management];
}
