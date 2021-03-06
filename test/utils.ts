import { BigNumber, BigNumberish } from "ethers";
import { ethers } from "hardhat";
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

function errorLateToExecute(executeTime: BigNumberish): string {
  return `LateToExecute(${executeTime})`;
}

function errorSignerIsNotRequested(): string {
  return `SignerIsNotRequested()`;
}

function errorSignerAlreadySigned(): string {
  return `SignerAlreadySigned()`;
}

function errorSignerDidNotSigned(): string {
  return `SignerDidNotSigned()`;
}

function errorInvalidDocument(): string {
  return `InvalidDocument()`;
}

function errorCallerIsNotManagement(): string {
  return `CallerIsNotManagement()`;
}

function errorCallerIsNotDocumentCreator(): string {
  return `CallerIsNotDocumentCreator()`;
}

function errorDocumentCreatorAllowanceNotEnough(): string {
  return `DocumentCreatorAllowanceNotEnough()`;
}

function errorDocumentIsAlreadyOnVerification(): string {
  return `DocumentIsAlreadyOnVerification()`;
}

function errorRequestedSignersAreNotEnough(sentLength: BigNumberish, requiredLength: BigNumberish): string {
  return `RequestedSignersAreNotEnough(${sentLength}, ${requiredLength})`;
}

function errorDocumentCreatorNotFound(): string {
  return `DocumentCreatorNotFound()`;
}

function errorDecrementAmountExceedsAllowance(): string {
  return `DecrementAmountExceedsAllowance()`;
}

function errorCallerIsNotController(): string {
  return `CallerIsNotController()`;
}

export {
  errorLateToExecute,
  errorSignerIsNotRequested,
  errorSignerAlreadySigned,
  errorSignerDidNotSigned,
  errorInvalidDocument,
  errorCallerIsNotManagement,
  errorCallerIsNotDocumentCreator,
  errorDocumentCreatorAllowanceNotEnough,
  errorDocumentIsAlreadyOnVerification,
  errorRequestedSignersAreNotEnough,
  errorDocumentCreatorNotFound,
  errorDecrementAmountExceedsAllowance,
  errorCallerIsNotController,
};

// FUNCTIONS

async function simulateTimePassed(duration: BigNumber) {
  await ethers.provider.send("evm_increaseTime", [duration.toNumber()]);
  await ethers.provider.send("evm_mine", []);
}

async function getCurrentTime() {
  return BigNumber.from((await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp);
}

function daysToSecond(day: BigNumberish) {
  return BigNumber.from(day).mul(24).mul(60).mul(60);
}

export { simulateTimePassed, getCurrentTime, daysToSecond };
