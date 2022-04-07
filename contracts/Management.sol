// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./Controller.sol";
import "./IDocumentVerificationManagement.sol";
import "./IManagement.sol";

contract Management is Controller, IManagement {
    function configureDocumentCreator(address documentCreator, uint256 allowedAmount) external onlyController {
        address managementAddress = getDocumentVerificationManagement(msg.sender);
        IDocumentVerificationManagement managementInterface = IDocumentVerificationManagement(managementAddress);

        _configureDocumentCreator(managementInterface, documentCreator, allowedAmount);
    }

    function removeDocumentCreator(address documentCreator) external onlyController {
        address managementAddress = getDocumentVerificationManagement(msg.sender);
        IDocumentVerificationManagement managementInterface = IDocumentVerificationManagement(managementAddress);

        managementInterface.removeDocumentCreator(documentCreator);
    }

    function increaseDocumentCreatorAllowance(address documentCreator, uint256 incrementAmount)
        external
        onlyController
    {
        address managementAddress = getDocumentVerificationManagement(msg.sender);
        IDocumentVerificationManagement managementInterface = IDocumentVerificationManagement(managementAddress);

        if (!managementInterface.isDocumentCreator(documentCreator)) revert DocumentCreatorNotFound();

        uint256 currentAllowance = managementInterface.documentCreatorAllowance(documentCreator);
        uint256 newAllowance = currentAllowance + incrementAmount;

        _configureDocumentCreator(managementInterface, documentCreator, newAllowance);
    }

    function decreaseDocumentCreatorAllowance(address documentCreator, uint256 decrementAmount)
        external
        onlyController
    {
        address managementAddress = getDocumentVerificationManagement(msg.sender);
        IDocumentVerificationManagement managementInterface = IDocumentVerificationManagement(managementAddress);

        if (!managementInterface.isDocumentCreator(documentCreator)) revert DocumentCreatorNotFound();

        uint256 currentAllowance = managementInterface.documentCreatorAllowance(documentCreator);
        if (decrementAmount > currentAllowance) revert DecrementAmountExceedsAllowance();

        uint256 newAllowance = currentAllowance - decrementAmount;

        _configureDocumentCreator(managementInterface, documentCreator, newAllowance);
    }

    function _configureDocumentCreator(
        IDocumentVerificationManagement managementInterface,
        address documentCreator,
        uint256 allowedAmount
    ) private {
        managementInterface.configureDocumentCreator(documentCreator, allowedAmount);
    }
}
