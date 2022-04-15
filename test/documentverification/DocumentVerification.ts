import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Signers } from "../types";
import * as utils from "../utils";

describe.only("DocumentVerification tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.user1 = signers[1];
    this.signers.user2 = signers[2];
  });

  describe("Document verification check", function () {
    before(async function () {
      this.managementSingle = await utils.getManagementSingleContract(this.signers);
      const args = utils.getDocumentVerificationContractArgs(this.managementSingle.address);
      this.documentVerification = await utils.getDocumentVerificationContract(this.signers, args);
      await this.managementSingle.setDocumentManagementInterface(this.documentVerification.address);
    });

    describe("Put document to verification check", function () {
      it("Should not put document to verification, if not document creator", async function () {
        const documentHash = ethers.utils.id("DOCUMENT-1");
        const verificationDeadline = (await utils.getCurrentTime()).add(utils.daysToSecond(1));
        const documentDeadline = verificationDeadline;
        const verificationType = 1;
        const requestedSigners = [this.signers.user1.address, this.signers.user2.address];

        await expect(
          this.documentVerification.putDocumentToVerification(
            documentHash,
            verificationDeadline,
            documentDeadline,
            verificationType,
            requestedSigners,
          ),
        ).to.revertedWith(utils.errorCallerIsNotDocumentCreator());
      });

      it("Should not put document to verification, if requested signers are not enough", async function () {
        const documentCreator = this.signers.user1;
        const allowance = 1;
        await this.managementSingle.configureDocumentCreator(documentCreator.address, allowance);

        const documentHash = ethers.utils.id("DOCUMENT-1");
        const verificationDeadline = (await utils.getCurrentTime()).add(utils.daysToSecond(1));
        const documentDeadline = verificationDeadline;
        const verificationType = 1;

        await expect(
          this.documentVerification
            .connect(documentCreator)
            .putDocumentToVerification(documentHash, verificationDeadline, documentDeadline, verificationType, []),
        ).to.revertedWith(utils.errorRequestedSignersAreNotEnough(0, 1));
      });

      it("Should put document to verification", async function () {
        const documentCreator = this.signers.user1;

        const documentHash = ethers.utils.id("DOCUMENT-1");
        const verificationDeadline = (await utils.getCurrentTime()).add(utils.daysToSecond(1));
        const documentDeadline = verificationDeadline;
        const verificationType = 1;
        const requestedSigners = [this.signers.user1.address, this.signers.user2.address];

        await this.documentVerification
          .connect(documentCreator)
          .putDocumentToVerification(
            documentHash,
            verificationDeadline,
            documentDeadline,
            verificationType,
            requestedSigners,
          );

        // valid document
        expect((await this.documentVerification.getDocument(documentHash)).verificationCreatedAt.isZero()).to.equal(
          false,
        );
      });

      it("Should give correct values after document verification", async function () {
        const documentHash = ethers.utils.id("DOCUMENT-1");
        const verificationType = 1;
        const requestedSigners = [this.signers.user1.address, this.signers.user2.address];

        const values = await this.documentVerification.getDocument(documentHash);

        expect(values.verificationType).to.equal(verificationType);
        expect(values.requestedSigners.length).to.equal(requestedSigners.length);

        expect(await this.documentVerification.isDocumentLegit(documentHash)).to.equal(false);
      });

      it("Should not put document to verification, if document is already verified", async function () {
        const documentCreator = this.signers.user1;

        const documentHash = ethers.utils.id("DOCUMENT-1");
        const verificationDeadline = (await utils.getCurrentTime()).add(utils.daysToSecond(1));
        const documentDeadline = verificationDeadline;
        const verificationType = 1;
        const requestedSigners = [this.signers.user1.address, this.signers.user2.address];

        await expect(
          this.documentVerification
            .connect(documentCreator)
            .putDocumentToVerification(
              documentHash,
              verificationDeadline,
              documentDeadline,
              verificationType,
              requestedSigners,
            ),
        ).to.revertedWith(utils.errorDocumentIsAlreadyOnVerification());
      });

      it("Should not put document to verification, if allowance not enough", async function () {
        const documentCreator = this.signers.user1;

        const documentHash = ethers.utils.id("DOCUMENT-2");
        const verificationDeadline = (await utils.getCurrentTime()).add(utils.daysToSecond(1));
        const documentDeadline = verificationDeadline;
        const verificationType = 1;
        const requestedSigners = [this.signers.user1.address, this.signers.user2.address];

        await expect(
          this.documentVerification
            .connect(documentCreator)
            .putDocumentToVerification(
              documentHash,
              verificationDeadline,
              documentDeadline,
              verificationType,
              requestedSigners,
            ),
        ).to.revertedWith(utils.errorDocumentCreatorAllowanceNotEnough());
      });
    });
  });
});
