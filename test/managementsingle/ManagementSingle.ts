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

  describe("Document creator check", function () {
    before(async function () {
      this.managementSingle = await utils.getManagementSingleContract(this.signers);

      const args = utils.getDocumentVerificationContractArgs(this.managementSingle.address);
      this.documentVerification = await utils.getDocumentVerificationContract(this.signers, args);
      await this.managementSingle.setDocumentManagementInterface(this.documentVerification.address);
    });

    describe("Configure document creator check", function () {
      it("Should not configure document creator, if not owner", async function () {
        await expect(
          this.managementSingle.connect(this.signers.user1).configureDocumentCreator(ethers.constants.AddressZero, 100),
        ).to.revertedWith("Ownable: caller is not the owner");
      });

      it("Should configure document creator", async function () {
        const documentCreator = this.signers.user1.address;
        const allowedAmount = 3;

        expect(await this.documentVerification.isDocumentCreator(documentCreator)).equal(false);

        await this.managementSingle.configureDocumentCreator(documentCreator, allowedAmount);

        expect(await this.documentVerification.isDocumentCreator(documentCreator)).equal(true);
      });

      it("Should give correct values after configure document creator", async function () {
        const documentCreator = this.signers.user1.address;
        const allowedAmount = 3;

        expect(await this.documentVerification.documentCreatorAllowance(documentCreator)).equal(allowedAmount);
      });
    });

    describe("Remove document creator check", function () {
      it("Should not remove document creator, if not owner", async function () {
        await expect(
          this.managementSingle.connect(this.signers.user1).removeDocumentCreator(ethers.constants.AddressZero),
        ).to.revertedWith("Ownable: caller is not the owner");
      });

      it("Should remove document creator", async function () {
        const documentCreator = this.signers.user1.address;

        expect(await this.documentVerification.isDocumentCreator(documentCreator)).equal(true);

        await this.managementSingle.removeDocumentCreator(documentCreator);

        expect(await this.documentVerification.isDocumentCreator(documentCreator)).equal(false);
      });

      it("Should give correct values after remove document creator", async function () {
        const documentCreator = this.signers.user1.address;
        const allowedAmount = 0;

        expect(await this.documentVerification.documentCreatorAllowance(documentCreator)).equal(allowedAmount);
      });
    });

    describe("Increase document creator allowance check", function () {
      it("Should not increase document creator allowance, if not owner", async function () {
        await expect(
          this.managementSingle
            .connect(this.signers.user1)
            .increaseDocumentCreatorAllowance(ethers.constants.AddressZero, 1),
        ).to.revertedWith("Ownable: caller is not the owner");
      });

      it("Should not increase document creator allowance, if document creator not found", async function () {
        await expect(
          this.managementSingle.increaseDocumentCreatorAllowance(ethers.constants.AddressZero, 1),
        ).to.revertedWith(utils.errorDocumentCreatorNotFound());
      });

      it("Should increase document creator allowance", async function () {
        const documentCreator = this.signers.user1.address;
        const initialAllowedAmount = 3;
        const increaseAmount = 2;
        const increasedAllowedAmount = initialAllowedAmount + increaseAmount;
        // first configure document creator in order to increase
        await this.managementSingle.configureDocumentCreator(documentCreator, initialAllowedAmount);

        expect(await this.documentVerification.documentCreatorAllowance(documentCreator)).equal(initialAllowedAmount);

        await this.managementSingle.increaseDocumentCreatorAllowance(documentCreator, increaseAmount);

        expect(await this.documentVerification.documentCreatorAllowance(documentCreator)).equal(increasedAllowedAmount);
      });
    });

    describe("Decrease document creator allowance check", function () {
      it("Should not decrease document creator allowance, if not owner", async function () {
        await expect(
          this.managementSingle
            .connect(this.signers.user1)
            .decreaseDocumentCreatorAllowance(ethers.constants.AddressZero, 1),
        ).to.revertedWith("Ownable: caller is not the owner");
      });

      it("Should not decrease document creator allowance, if document creator not found", async function () {
        await expect(
          this.managementSingle.decreaseDocumentCreatorAllowance(ethers.constants.AddressZero, 1),
        ).to.revertedWith(utils.errorDocumentCreatorNotFound());
      });

      it("Should not decrease document creator allowance, if decrement amount exceeds current allowance", async function () {
        const documentCreator = this.signers.user1.address;
        const initialAllowedAmount = 3;
        const decreaseAmount = initialAllowedAmount + 1;
        // first configure document creator in order to decrease
        await this.managementSingle.configureDocumentCreator(documentCreator, initialAllowedAmount);

        await expect(
          this.managementSingle.decreaseDocumentCreatorAllowance(documentCreator, decreaseAmount),
        ).to.revertedWith(utils.errorDecrementAmountExceedsAllowance());
      });

      it("Should decrease document creator allowance", async function () {
        const documentCreator = this.signers.user1.address;
        const initialAllowedAmount = await this.documentVerification.documentCreatorAllowance(documentCreator);
        const decreaseAmount = 2;
        const decreasedAllowedAmount = initialAllowedAmount.sub(decreaseAmount);

        await this.managementSingle.decreaseDocumentCreatorAllowance(documentCreator, decreaseAmount);

        expect(await this.documentVerification.documentCreatorAllowance(documentCreator)).equal(decreasedAllowedAmount);
      });
    });
  });
});
