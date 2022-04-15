// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./IDocumentVerificationManagement.sol";
import "./SignatureSet.sol";
import "./Search.sol";
import "hardhat/console.sol";

contract DocumentVerification is IDocumentVerificationManagement {
    using SignatureSet for SignatureSet.SignSet;
    using Search for address[];

    error LateToExecute(uint256 executeTime);
    error SignerIsNotRequested();
    error SignerAlreadySigned();
    error SignerDidNotSigned();
    error InvalidDocument();
    error CallerIsNotManagement();
    error CallerIsNotDocumentCreator();
    error DocumentCreatorAllowanceNotEnough();
    error DocumentIsAlreadyOnVerification();
    error RequestedSignersAreNotEnough(uint256 sentLength, uint256 requiredLength);

    uint256 public constant MIN_VOTER_COUNT = 1;

    enum VerificationType {
        INVALID,
        MULTISIG,
        VOTING
    }

    struct Document {
        uint128 verificationCreatedAt;
        uint128 verificationDeadline;
        uint128 documentDeadline;
        VerificationType verificationType;
        address[] requestedSigners;
    }

    mapping(bytes32 => Document) private _documents;
    mapping(bytes32 => SignatureSet.SignSet) private _signatures;

    mapping(address => bool) private _documentCreators;
    mapping(address => uint256) private _documentCreatorAllowance;

    address public immutable management;

    constructor(address _management) {
        management = _management;
    }

    modifier onlyDocumentCreator() {
        if (!_documentCreators[msg.sender]) revert CallerIsNotDocumentCreator();
        _;
    }

    modifier onlyManagement() {
        if (msg.sender != management) revert CallerIsNotManagement();
        _;
    }

    modifier validDocument(bytes32 documentHash) {
        if (_documents[documentHash].verificationCreatedAt == 0) revert InvalidDocument();
        _;
    }

    function putDocumentToVerification(
        bytes32 documentHash,
        uint128 verificationDeadline,
        uint128 documentDeadline,
        VerificationType verificationType,
        address[] calldata requestedSigners
    ) external onlyDocumentCreator {
        if (_documents[documentHash].verificationCreatedAt != 0) revert DocumentIsAlreadyOnVerification();
        if (requestedSigners.length < MIN_VOTER_COUNT)
            revert RequestedSignersAreNotEnough({
                sentLength: requestedSigners.length,
                requiredLength: MIN_VOTER_COUNT
            });
        if (_documentCreatorAllowance[msg.sender] == 0) revert DocumentCreatorAllowanceNotEnough();

        Document storage document = _documents[documentHash];

        document.verificationCreatedAt = uint128(block.timestamp);
        document.verificationDeadline = verificationDeadline;
        document.documentDeadline = documentDeadline;
        document.verificationType = verificationType;
        document.requestedSigners = requestedSigners;

        _documentCreatorAllowance[msg.sender]--;
    }

    function signDocument(bytes32 documentHash) external validDocument(documentHash) {
        Document memory document = _documents[documentHash];
        if (block.timestamp > document.verificationDeadline)
            revert LateToExecute({ executeTime: document.verificationDeadline });
        if (!_isSignerRequestedByDocument(documentHash, msg.sender)) revert SignerIsNotRequested();
        if (_isSignerSignedTheDocument(documentHash, msg.sender)) revert SignerAlreadySigned();

        // add signature to document
        SignatureSet.Sign memory sign = SignatureSet.Sign({ signer: msg.sender, timestamp: block.timestamp });
        _signatures[documentHash].add(sign);

        console.log("Document signed by: %s", msg.sender);
    }

    function revokeSign(bytes32 documentHash) external validDocument(documentHash) {
        Document memory document = _documents[documentHash];
        if (block.timestamp > document.verificationDeadline)
            revert LateToExecute({ executeTime: document.verificationDeadline });
        if (!_isSignerSignedTheDocument(documentHash, msg.sender)) revert SignerDidNotSigned();

        _signatures[documentHash].remove(msg.sender);
    }

    function configureDocumentCreator(address documentCreator, uint256 allowedAmount) external override onlyManagement {
        if (!_documentCreators[documentCreator]) _documentCreators[documentCreator] = true;
        _documentCreatorAllowance[documentCreator] = allowedAmount;
    }

    function removeDocumentCreator(address documentCreator) external override onlyManagement {
        if (_documentCreators[documentCreator]) _documentCreators[documentCreator] = false;
        _documentCreatorAllowance[documentCreator] = 0;
    }

    function isDocumentLegit(bytes32 documentHash) external view returns (bool legit) {
        Document memory document = _documents[documentHash];
        SignatureSet.SignSet storage signSet = _signatures[documentHash];

        console.log("Signer count: %s", signSet.length());
        console.log("Requested count: %s", document.requestedSigners.length);

        if (signSet.length() >= MIN_VOTER_COUNT) {
            if (document.verificationType == VerificationType.MULTISIG) {
                legit = _multisigCheck(document, signSet);
            }
            if (document.verificationType == VerificationType.VOTING) {
                legit = _votingCheck(document, signSet);
            }
        } else legit = false;
    }

    function documentCreatorAllowance(address documentCreator) external view override returns (uint256 allowance) {
        allowance = _documentCreatorAllowance[documentCreator];
    }

    function isDocumentCreator(address documentCreator) external view override returns (bool result) {
        result = _documentCreators[documentCreator];
    }

    function getDocument(bytes32 documentHash) external view returns (Document memory document) {
        document = _documents[documentHash];
    }

    function _isSignerRequestedByDocument(bytes32 documentHash, address signer) private view returns (bool requested) {
        requested = _documents[documentHash].requestedSigners.contains(signer);
    }

    function _isSignerSignedTheDocument(bytes32 documentHash, address signer) private view returns (bool signed) {
        signed = _signatures[documentHash].contains(signer);
    }

    function _multisigCheck(Document memory document, SignatureSet.SignSet storage signSet)
        private
        view
        returns (bool legit)
    {
        legit = document.requestedSigners.length == signSet.length();
    }

    function _votingCheck(Document memory document, SignatureSet.SignSet storage signSet)
        private
        view
        returns (bool legit)
    {
        legit = (signSet.length() * 10e18) / document.requestedSigners.length > 5 * 10e17;
    }
}
