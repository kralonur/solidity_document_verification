// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../IDocumentVerificationManagement.sol";
import "./IManagement.sol";

contract ManagementSingle is IManagement, Ownable {
    IDocumentVerificationManagement public managementInterface;

    function setDocumentManagementInterface(address documentManagementInterface) external onlyOwner {
        managementInterface = IDocumentVerificationManagement(documentManagementInterface);
    }

    function configureDocumentCreator(address documentCreator, uint256 allowedAmount) external override onlyOwner {
        _configureDocumentCreator(documentCreator, allowedAmount);
    }

    function removeDocumentCreator(address documentCreator) external override onlyOwner {
        managementInterface.removeDocumentCreator(documentCreator);
    }

    function increaseDocumentCreatorAllowance(address documentCreator, uint256 incrementAmount)
        external
        override
        onlyOwner
    {
        if (!managementInterface.isDocumentCreator(documentCreator)) revert DocumentCreatorNotFound();

        uint256 currentAllowance = managementInterface.documentCreatorAllowance(documentCreator);
        uint256 newAllowance = currentAllowance + incrementAmount;

        _configureDocumentCreator(documentCreator, newAllowance);
    }

    function decreaseDocumentCreatorAllowance(address documentCreator, uint256 decrementAmount)
        external
        override
        onlyOwner
    {
        if (!managementInterface.isDocumentCreator(documentCreator)) revert DocumentCreatorNotFound();

        uint256 currentAllowance = managementInterface.documentCreatorAllowance(documentCreator);
        if (decrementAmount > currentAllowance) revert DecrementAmountExceedsAllowance();

        uint256 newAllowance = currentAllowance - decrementAmount;

        _configureDocumentCreator(documentCreator, newAllowance);
    }

    function _configureDocumentCreator(address documentCreator, uint256 allowedAmount) private {
        managementInterface.configureDocumentCreator(documentCreator, allowedAmount);
    }
}
