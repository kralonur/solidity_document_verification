// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

interface IDocumentVerificationManagement {
    function configureDocumentCreator(address documentCreator, uint256 allowedAmount) external;

    function removeDocumentCreator(address documentCreator) external;

    function documentCreatorAllowance(address documentCreator) external view returns (uint256 allowance);

    function isDocumentCreator(address documentCreator) external view returns (bool result);
}
