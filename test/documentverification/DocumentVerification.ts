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

        // should not configure document creator, if caller is not management
        await expect(
          this.documentVerification.configureDocumentCreator(documentCreator.address, allowance),
        ).to.revertedWith(utils.errorCallerIsNotManagement());

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

    describe("Sign document check", function () {
      it("Should not sign document, if document is invalid", async function () {
        const documentHash = ethers.utils.id("DOCUMENT-INVALID");

        await expect(this.documentVerification.signDocument(documentHash)).to.revertedWith(
          utils.errorInvalidDocument(),
        );
      });

      it("Should not sign document, if signer is not requested", async function () {
        const documentHash = ethers.utils.id("DOCUMENT-1");

        await expect(this.documentVerification.signDocument(documentHash)).to.revertedWith(
          utils.errorSignerIsNotRequested(),
        );
      });

      it("Should sign document", async function () {
        const documentHash = ethers.utils.id("DOCUMENT-1");
        const signer = this.signers.user2;

        await this.documentVerification.connect(signer).signDocument(documentHash);

        const signers = await this.documentVerification.getSigners(documentHash);

        expect(signers[0].signer).to.equal(signer.address);
        expect(signers.length).to.equal(1);
      });

      it("Should not sign document, if signer already signed", async function () {
        const documentHash = ethers.utils.id("DOCUMENT-1");
        const signer = this.signers.user2;

        await expect(this.documentVerification.connect(signer).signDocument(documentHash)).to.revertedWith(
          utils.errorSignerAlreadySigned(),
        );
      });

      it("Should not sign document, if deadline passed", async function () {
        const documentHash = ethers.utils.id("DOCUMENT-1");
        const signer = this.signers.user1;
        const verificationDeadline = (await this.documentVerification.getDocument(documentHash)).verificationDeadline;
        await utils.simulateTimePassed(utils.daysToSecond(2));

        await expect(this.documentVerification.connect(signer).signDocument(documentHash)).to.revertedWith(
          utils.errorLateToExecute(verificationDeadline),
        );
      });
    });

    describe("Revoke sign check", function () {
      before(async function () {
        const documentCreator = this.signers.user1;

        await this.managementSingle.configureDocumentCreator(documentCreator.address, 1);

        const documentHash = ethers.utils.id("DOCUMENT-2");
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
      });

      it("Should not revoke sign, if document is invalid", async function () {
        const documentHash = ethers.utils.id("DOCUMENT-INVALID");

        await expect(this.documentVerification.revokeSign(documentHash)).to.revertedWith(utils.errorInvalidDocument());
      });

      it("Should not revoke sign, if signer did not signed", async function () {
        const documentHash = ethers.utils.id("DOCUMENT-2");
        const signer = this.signers.user2;

        await expect(this.documentVerification.connect(signer).revokeSign(documentHash)).to.revertedWith(
          utils.errorSignerDidNotSigned(),
        );
      });

      it("Should revoke sign", async function () {
        // first, sign document and check
        const documentHash = ethers.utils.id("DOCUMENT-2");
        const signer = this.signers.user2;

        await this.documentVerification.connect(signer).signDocument(documentHash);

        let signers = await this.documentVerification.getSigners(documentHash);

        expect(signers[0].signer).to.equal(signer.address);
        expect(signers.length).to.equal(1);

        // then, revoke sign and check

        await this.documentVerification.connect(signer).revokeSign(documentHash);

        signers = await this.documentVerification.getSigners(documentHash);

        expect(signers.length).to.equal(0);
      });

      it("Should not revoke sign, if deadline passed", async function () {
        const documentHash = ethers.utils.id("DOCUMENT-2");
        const signer = this.signers.user2;
        const verificationDeadline = (await this.documentVerification.getDocument(documentHash)).verificationDeadline;
        await utils.simulateTimePassed(utils.daysToSecond(2));

        await expect(this.documentVerification.connect(signer).revokeSign(documentHash)).to.revertedWith(
          utils.errorLateToExecute(verificationDeadline),
        );
      });
    });

    describe("Document legit check", function () {
      before(async function () {
        const documentCreator = this.signers.user1;

        await this.managementSingle.configureDocumentCreator(documentCreator.address, 2);

        let documentHash = ethers.utils.id("DOCUMENT-3");
        const verificationDeadline = (await utils.getCurrentTime()).add(utils.daysToSecond(1));
        const documentDeadline = verificationDeadline;
        let verificationType = 1; //VerificationType.MULTISIG
        const requestedSigners = [this.signers.admin.address, this.signers.user1.address, this.signers.user2.address];

        // put document to verification for multisig check
        await this.documentVerification
          .connect(documentCreator)
          .putDocumentToVerification(
            documentHash,
            verificationDeadline,
            documentDeadline,
            verificationType,
            requestedSigners,
          );

        documentHash = ethers.utils.id("DOCUMENT-4");
        verificationType = 2; //VerificationType.VOTING

        // put document to verification for voting check
        await this.documentVerification
          .connect(documentCreator)
          .putDocumentToVerification(
            documentHash,
            verificationDeadline,
            documentDeadline,
            verificationType,
            requestedSigners,
          );
      });

      it("Should not give legit result(multisig), when signer count 0/3", async function () {
        const documentHash = ethers.utils.id("DOCUMENT-3");

        expect(await this.documentVerification.isDocumentLegit(documentHash)).to.equal(false);
      });

      it("Should not give legit result(voting), when signer count 0/3", async function () {
        const documentHash = ethers.utils.id("DOCUMENT-4");

        expect(await this.documentVerification.isDocumentLegit(documentHash)).to.equal(false);
      });

      it("Should not give legit result(multisig), when signer count 1/3", async function () {
        const documentHash = ethers.utils.id("DOCUMENT-3");
        const signer = this.signers.admin;

        await this.documentVerification.connect(signer).signDocument(documentHash);

        expect(await this.documentVerification.isDocumentLegit(documentHash)).to.equal(false);
      });

      it("Should not give legit result(voting), when signer count 1/3", async function () {
        const documentHash = ethers.utils.id("DOCUMENT-4");
        const signer = this.signers.admin;

        await this.documentVerification.connect(signer).signDocument(documentHash);

        expect(await this.documentVerification.isDocumentLegit(documentHash)).to.equal(false);
      });

      it("Should not give legit result(multisig), when signer count 2/3", async function () {
        const documentHash = ethers.utils.id("DOCUMENT-3");
        const signer = this.signers.user1;

        await this.documentVerification.connect(signer).signDocument(documentHash);

        expect(await this.documentVerification.isDocumentLegit(documentHash)).to.equal(false);
      });

      it("Should give legit result(voting), when signer count 2/3", async function () {
        const documentHash = ethers.utils.id("DOCUMENT-4");
        const signer = this.signers.user1;

        await this.documentVerification.connect(signer).signDocument(documentHash);

        expect(await this.documentVerification.isDocumentLegit(documentHash)).to.equal(true);
      });

      it("Should give legit result(multisig), when signer count 3/3", async function () {
        const documentHash = ethers.utils.id("DOCUMENT-3");
        const signer = this.signers.user2;

        await this.documentVerification.connect(signer).signDocument(documentHash);

        expect(await this.documentVerification.isDocumentLegit(documentHash)).to.equal(true);
      });

      it("Should give legit result(voting), when signer count 3/3", async function () {
        const documentHash = ethers.utils.id("DOCUMENT-4");
        const signer = this.signers.user2;

        await this.documentVerification.connect(signer).signDocument(documentHash);

        expect(await this.documentVerification.isDocumentLegit(documentHash)).to.equal(true);
      });

      it("Should not give legit result(multisig), when document deadline is passed", async function () {
        // time passed over document deadline
        await utils.simulateTimePassed(utils.daysToSecond(2));

        const documentHash = ethers.utils.id("DOCUMENT-3");

        expect(await this.documentVerification.isDocumentLegit(documentHash)).to.equal(false);
      });

      it("Should not legit result(voting), when document deadline is passed", async function () {
        const documentHash = ethers.utils.id("DOCUMENT-4");

        expect(await this.documentVerification.isDocumentLegit(documentHash)).to.equal(false);
      });
    });
  });
});
