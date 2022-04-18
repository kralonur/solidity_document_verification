// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./Controller.sol";
import "../IDocumentVerificationManagement.sol";
import "./IManagement.sol";

/**
 * @title Management contract for multi document verification contract
 */
contract ManagementMulti is IManagement, Controller {
    /// @dev See {IManagement-configureDocumentCreator}
    function configureDocumentCreator(address documentCreator, uint256 allowedAmount) external override onlyController {
        address managementAddress = getDocumentVerificationManagement(msg.sender);
        IDocumentVerificationManagement managementInterface = IDocumentVerificationManagement(managementAddress);

        _configureDocumentCreator(managementInterface, documentCreator, allowedAmount);
    }

    /// @dev See {IManagement-removeDocumentCreator}
    function removeDocumentCreator(address documentCreator) external override onlyController {
        address managementAddress = getDocumentVerificationManagement(msg.sender);
        IDocumentVerificationManagement managementInterface = IDocumentVerificationManagement(managementAddress);

        managementInterface.removeDocumentCreator(documentCreator);
    }

    /// @dev See {IManagement-increaseDocumentCreatorAllowance}
    function increaseDocumentCreatorAllowance(address documentCreator, uint256 incrementAmount)
        external
        override
        onlyController
    {
        address managementAddress = getDocumentVerificationManagement(msg.sender);
        IDocumentVerificationManagement managementInterface = IDocumentVerificationManagement(managementAddress);

        if (!managementInterface.isDocumentCreator(documentCreator)) revert DocumentCreatorNotFound();

        uint256 currentAllowance = managementInterface.documentCreatorAllowance(documentCreator);
        uint256 newAllowance = currentAllowance + incrementAmount;

        _configureDocumentCreator(managementInterface, documentCreator, newAllowance);
    }

    /// @dev See {IManagement-decreaseDocumentCreatorAllowance}
    function decreaseDocumentCreatorAllowance(address documentCreator, uint256 decrementAmount)
        external
        override
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

    /// @dev Internal configure document creator function
    function _configureDocumentCreator(
        IDocumentVerificationManagement managementInterface,
        address documentCreator,
        uint256 allowedAmount
    ) private {
        managementInterface.configureDocumentCreator(documentCreator, allowedAmount);
    }
}
