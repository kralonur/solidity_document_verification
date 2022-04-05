// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "hardhat/console.sol";

contract DocumentVerification {
    uint256 public constant INVALID_INDEX = 2**256 - 1;

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

    struct Sign {
        address signer;
        uint256 timestamp;
    }

    mapping(bytes32 => Document) private _documents;
    mapping(bytes32 => Sign[]) private _signatures;

    function putDocumentToVerification(
        bytes32 documentHash,
        uint128 verificationDeadline,
        uint128 documentDeadline,
        VerificationType verificationType,
        address[] calldata requestedSigners
    ) external {
        Document storage document = _documents[documentHash];

        document.verificationCreatedAt = uint128(block.timestamp);
        document.verificationDeadline = verificationDeadline;
        document.documentDeadline = documentDeadline;
        document.verificationType = verificationType;
        document.requestedSigners = requestedSigners;
    }

    function signDocument(bytes32 documentHash) external {
        Document memory document = _documents[documentHash];
        require(document.verificationDeadline > block.timestamp, "DocumentVerification: deadline is over to sign");
        require(
            _isSignerRequestedByDocument(documentHash, msg.sender),
            "DocumentVerification: signer is not requested by document"
        );
        require(
            !_isSignerSignedTheDocument(documentHash, msg.sender),
            "DocumentVerification: signer already signed the document"
        );

        // add signature to document
        Sign memory sign = Sign({ signer: msg.sender, timestamp: block.timestamp });
        _signatures[documentHash].push(sign);

        console.log("Document signed by: %s", msg.sender);
    }

    function revokeSign(bytes32 documentHash) external {
        Document memory document = _documents[documentHash];
        require(document.verificationDeadline > block.timestamp, "DocumentVerification: deadline is over to revoke");
        require(
            _isSignerSignedTheDocument(documentHash, msg.sender),
            "DocumentVerification: signer did not sign the document yet"
        );

        Sign[] memory signatures = _signatures[documentHash];
        uint256 signerIndex = _getSignedSignerIndex(signatures, msg.sender);

        console.log("Before pop");
        for (uint256 i = 0; i < _signatures[documentHash].length; i++) {
            console.log(_signatures[documentHash][i].signer);
        }

        // assign latest sign to slot which is going to be delated
        uint256 latestItemIndex = _signatures[documentHash].length - 1;
        _signatures[documentHash][signerIndex] = _signatures[documentHash][latestItemIndex];

        // then delete latest sign
        _signatures[documentHash].pop();
        console.log("Document sign revoked by: %s", msg.sender);

        console.log("After pop");
        for (uint256 i = 0; i < _signatures[documentHash].length; i++) {
            console.log(_signatures[documentHash][i].signer);
        }
    }

    function _isSignerRequestedByDocument(bytes32 documentHash, address signer) private view returns (bool requested) {
        address[] memory requestedSigners = _documents[documentHash].requestedSigners;
        requested = _getRequestedSignerIndex(requestedSigners, signer) != INVALID_INDEX;
    }

    function _isSignerSignedTheDocument(bytes32 documentHash, address signer) private view returns (bool signed) {
        Sign[] memory signatures = _signatures[documentHash];
        signed = _getSignedSignerIndex(signatures, signer) != INVALID_INDEX;
    }

    function _getRequestedSignerIndex(address[] memory requestedSigners, address signer)
        private
        pure
        returns (uint256 index)
    {
        index = INVALID_INDEX;

        for (uint256 i = 0; i < requestedSigners.length; i++) {
            if (requestedSigners[i] == signer) {
                index = i;
                break;
            }
        }
    }

    function _getSignedSignerIndex(Sign[] memory signatures, address signer) private pure returns (uint256 index) {
        index = INVALID_INDEX;

        for (uint256 i = 0; i < signatures.length; i++) {
            if (signatures[i].signer == signer) {
                index = i;
                break;
            }
        }
    }
}
