import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Signers } from "../types";
import * as utils from "../utils";

describe("ManagementSingle tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.user1 = signers[1];
  });

  describe("Global values check", function () {
    before(async function () {
      this.managementSingle = await utils.getManagementSingleContract(this.signers);
    });

    it("Should not set document management interface, if not owner", async function () {
      await expect(
        this.managementSingle.connect(this.signers.user1).setDocumentManagementInterface(ethers.constants.AddressZero),
      ).to.revertedWith("Ownable: caller is not the owner");
    });

    it("Should set document management interface ", async function () {
      const args = utils.getDocumentVerificationContractArgs(this.managementSingle.address);
      this.documentVerification = await utils.getDocumentVerificationContract(this.signers, args);

      await this.managementSingle.setDocumentManagementInterface(this.documentVerification.address);

      expect(await this.managementSingle.managementInterface()).equal(this.documentVerification.address);
    });
  });
});
