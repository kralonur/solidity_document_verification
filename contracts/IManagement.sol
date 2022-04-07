// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

interface IManagement {
    error DocumentCreatorNotFound();
    error DecrementAmountExceedsAllowance();

    function configureDocumentCreator(address documentCreator, uint256 allowedAmount) external;

    function removeDocumentCreator(address documentCreator) external;

    function increaseDocumentCreatorAllowance(address documentCreator, uint256 incrementAmount) external;

    function decreaseDocumentCreatorAllowance(address documentCreator, uint256 decrementAmount) external;
}
