import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Signers } from "../types";
import * as utils from "../utils";

describe("ManagementMulti tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.user1 = signers[1];
  });

  describe("Controller check", function () {
    before(async function () {
      this.managementMulti = await utils.getManagementMultiContract(this.signers);
    });

    describe("Configure controller check", function () {
      it("Should not configure controller, if not owner", async function () {
        await expect(
          this.managementMulti
            .connect(this.signers.user1)
            .configureController(ethers.constants.AddressZero, ethers.constants.AddressZero),
        ).to.revertedWith("Ownable: caller is not the owner");
      });

      it("Should configure controller", async function () {
        const controller = this.signers.user1.address;
        const args = utils.getDocumentVerificationContractArgs(this.managementMulti.address);
        this.documentVerification = await utils.getDocumentVerificationContract(this.signers, args);

        await this.managementMulti.configureController(controller, this.documentVerification.address);

        expect(await this.managementMulti.getDocumentVerificationManagement(controller)).equal(
          this.documentVerification.address,
        );
      });
    });

    describe("Remove controller check", function () {
      it("Should not remove controller, if not owner", async function () {
        await expect(
          this.managementMulti.connect(this.signers.user1).removeController(ethers.constants.AddressZero),
        ).to.revertedWith("Ownable: caller is not the owner");
      });

      it("Should remove controller", async function () {
        const controller = this.signers.user1.address;

        await this.managementMulti.removeController(controller);

        expect(await this.managementMulti.getDocumentVerificationManagement(controller)).equal(
          ethers.constants.AddressZero,
        );
      });
    });
  });
});
