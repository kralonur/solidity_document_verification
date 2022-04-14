import { DocumentVerification__factory, ManagementMulti__factory, ManagementSingle__factory } from "../src/types";
import { Signers } from "./types";

// CONTRACTS

async function getManagementSingleContract(signers: Signers) {
  const factory = new ManagementSingle__factory(signers.admin);
  const contract = await factory.deploy();
  await contract.deployed();

  return contract;
}

async function getManagementMultiContract(signers: Signers) {
  const factory = new ManagementMulti__factory(signers.admin);
  const contract = await factory.deploy();
  await contract.deployed();

  return contract;
}

async function getDocumentVerificationContract(signers: Signers, args: string[]) {
  const factory = new DocumentVerification__factory(signers.admin);
  const contract = await factory.deploy(args[0]);
  await contract.deployed();

  return contract;
}

function getDocumentVerificationContractArgs(management: string) {
  return getDocumentVerificationContractArgsArray(management);
}

function getDocumentVerificationContractArgsArray(management: string) {
  return [management];
}

export {
  getManagementSingleContract,
  getManagementMultiContract,
  getDocumentVerificationContract,
  getDocumentVerificationContractArgs,
};

// ERRORS

function errorDocumentCreatorNotFound(): string {
  return `DocumentCreatorNotFound()`;
}

function errorDecrementAmountExceedsAllowance(): string {
  return `DecrementAmountExceedsAllowance()`;
}

export { errorDocumentCreatorNotFound, errorDecrementAmountExceedsAllowance };
