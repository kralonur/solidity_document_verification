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
    this.signers.user2 = signers[2];
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

  describe("Document creator check", function () {
    before(async function () {
      this.managementMulti = await utils.getManagementMultiContract(this.signers);

      const args = utils.getDocumentVerificationContractArgs(this.managementMulti.address);
      this.documentVerification = await utils.getDocumentVerificationContract(this.signers, args);
    });

    describe("Configure document creator check", function () {
      it("Should not configure document creator, if not controller", async function () {
        await expect(
          this.managementMulti.connect(this.signers.user1).configureDocumentCreator(ethers.constants.AddressZero, 100),
        ).to.revertedWith(utils.errorCallerIsNotController());
      });

      it("Should configure document creator", async function () {
        // configure user1 as controller
        const controller = this.signers.user1;
        await this.managementMulti.configureController(controller.address, this.documentVerification.address);

        const documentCreator = this.signers.user2.address;
        const allowedAmount = 3;

        expect(await this.documentVerification.isDocumentCreator(documentCreator)).equal(false);

        await this.managementMulti.connect(controller).configureDocumentCreator(documentCreator, allowedAmount);

        expect(await this.documentVerification.isDocumentCreator(documentCreator)).equal(true);
      });

      it("Should give correct values after configure document creator", async function () {
        const documentCreator = this.signers.user2.address;
        const allowedAmount = 3;

        expect(await this.documentVerification.documentCreatorAllowance(documentCreator)).equal(allowedAmount);
      });
    });

    describe("Remove document creator check", function () {
      it("Should not remove document creator, if not controller", async function () {
        await expect(
          this.managementMulti.connect(this.signers.user2).removeDocumentCreator(ethers.constants.AddressZero),
        ).to.revertedWith(utils.errorCallerIsNotController());
      });

      it("Should remove document creator", async function () {
        const controller = this.signers.user1;
        const documentCreator = this.signers.user2.address;

        expect(await this.documentVerification.isDocumentCreator(documentCreator)).equal(true);

        await this.managementMulti.connect(controller).removeDocumentCreator(documentCreator);

        expect(await this.documentVerification.isDocumentCreator(documentCreator)).equal(false);
      });

      it("Should give correct values after remove document creator", async function () {
        const documentCreator = this.signers.user2.address;
        const allowedAmount = 0;

        expect(await this.documentVerification.documentCreatorAllowance(documentCreator)).equal(allowedAmount);
      });
    });

    describe("Increase document creator allowance check", function () {
      it("Should not increase document creator allowance, if not controller", async function () {
        await expect(
          this.managementMulti
            .connect(this.signers.user2)
            .increaseDocumentCreatorAllowance(ethers.constants.AddressZero, 1),
        ).to.revertedWith(utils.errorCallerIsNotController());
      });

      it("Should not increase document creator allowance, if document creator not found", async function () {
        const controller = this.signers.user1;

        await expect(
          this.managementMulti.connect(controller).increaseDocumentCreatorAllowance(ethers.constants.AddressZero, 1),
        ).to.revertedWith(utils.errorDocumentCreatorNotFound());
      });

      it("Should increase document creator allowance", async function () {
        const controller = this.signers.user1;
        const documentCreator = this.signers.user2.address;
        const initialAllowedAmount = 3;
        const increaseAmount = 2;
        const increasedAllowedAmount = initialAllowedAmount + increaseAmount;
        // first configure document creator in order to increase
        await this.managementMulti.connect(controller).configureDocumentCreator(documentCreator, initialAllowedAmount);

        expect(await this.documentVerification.documentCreatorAllowance(documentCreator)).equal(initialAllowedAmount);

        await this.managementMulti
          .connect(controller)
          .increaseDocumentCreatorAllowance(documentCreator, increaseAmount);

        expect(await this.documentVerification.documentCreatorAllowance(documentCreator)).equal(increasedAllowedAmount);
      });
    });

    describe("Decrease document creator allowance check", function () {
      it("Should not decrease document creator allowance, if not controller", async function () {
        await expect(
          this.managementMulti
            .connect(this.signers.user2)
            .decreaseDocumentCreatorAllowance(ethers.constants.AddressZero, 1),
        ).to.revertedWith(utils.errorCallerIsNotController());
      });

      it("Should not decrease document creator allowance, if document creator not found", async function () {
        const controller = this.signers.user1;

        await expect(
          this.managementMulti.connect(controller).decreaseDocumentCreatorAllowance(ethers.constants.AddressZero, 1),
        ).to.revertedWith(utils.errorDocumentCreatorNotFound());
      });

      it("Should not decrease document creator allowance, if decrement amount exceeds current allowance", async function () {
        const controller = this.signers.user1;
        const documentCreator = this.signers.user2.address;
        const initialAllowedAmount = 3;
        const decreaseAmount = initialAllowedAmount + 1;
        // first configure document creator in order to decrease
        await this.managementMulti.connect(controller).configureDocumentCreator(documentCreator, initialAllowedAmount);

        await expect(
          this.managementMulti.connect(controller).decreaseDocumentCreatorAllowance(documentCreator, decreaseAmount),
        ).to.revertedWith(utils.errorDecrementAmountExceedsAllowance());
      });

      it("Should decrease document creator allowance", async function () {
        const controller = this.signers.user1;
        const documentCreator = this.signers.user2.address;
        const initialAllowedAmount = await this.documentVerification.documentCreatorAllowance(documentCreator);
        const decreaseAmount = 2;
        const decreasedAllowedAmount = initialAllowedAmount.sub(decreaseAmount);

        await this.managementMulti
          .connect(controller)
          .decreaseDocumentCreatorAllowance(documentCreator, decreaseAmount);

        expect(await this.documentVerification.documentCreatorAllowance(documentCreator)).equal(decreasedAllowedAmount);
      });
    });
  });
});
