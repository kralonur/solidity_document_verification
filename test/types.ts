import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { Fixture } from "ethereum-waffle";
import { DocumentVerification, ManagementMulti, ManagementSingle } from "../src/types";
declare module "mocha" {
  export interface Context {
    managementSingle: ManagementSingle;
    managementMulti: ManagementMulti;
    documentVerification: DocumentVerification;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
  user1: SignerWithAddress;
}
