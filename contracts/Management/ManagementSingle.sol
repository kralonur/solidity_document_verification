// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../IDocumentVerificationManagement.sol";
import "./IManagement.sol";

/**
 * @title Management contract for single document verification contract
 */
contract ManagementSingle is IManagement, Ownable {
    /// Document verification management interface
    IDocumentVerificationManagement public managementInterface;

    /**
     * @dev Sets `managementInterface`
     * @param documentManagementInterface document management interface address
     */
    function setDocumentManagementInterface(address documentManagementInterface) external onlyOwner {
        managementInterface = IDocumentVerificationManagement(documentManagementInterface);
    }

    /// @dev See {IManagement-configureDocumentCreator}
    function configureDocumentCreator(address documentCreator, uint256 allowedAmount) external override onlyOwner {
        _configureDocumentCreator(documentCreator, allowedAmount);
    }

    /// @dev See {IManagement-removeDocumentCreator}
    function removeDocumentCreator(address documentCreator) external override onlyOwner {
        managementInterface.removeDocumentCreator(documentCreator);

        emit DocumentCreatorRemoved(documentCreator);
    }

    /// @dev See {IManagement-increaseDocumentCreatorAllowance}
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

    /// @dev See {IManagement-decreaseDocumentCreatorAllowance}
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

    /// @dev Internal configure document creator function
    function _configureDocumentCreator(address documentCreator, uint256 allowedAmount) private {
        managementInterface.configureDocumentCreator(documentCreator, allowedAmount);

        emit DocumentCreatorConfigured(documentCreator, allowedAmount);
    }
}
