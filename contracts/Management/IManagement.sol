// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

interface IManagement {
    error DocumentCreatorNotFound();
    error DecrementAmountExceedsAllowance();

    /**
     * @dev Adds document creator with given `allowedAmount`
     * @param documentCreator document creator address
     * @param allowedAmount allowed document amount for document creator
     */
    function configureDocumentCreator(address documentCreator, uint256 allowedAmount) external;

    /**
     * @dev Removes document creator
     * @param documentCreator document creator address
     */
    function removeDocumentCreator(address documentCreator) external;

    /**
     * @dev Increases document creator allowance with given `incrementAmount`
     * @param documentCreator document creator address
     * @param incrementAmount increment amount for the document creator
     */
    function increaseDocumentCreatorAllowance(address documentCreator, uint256 incrementAmount) external;

    /**
     * @dev Decreases document creator allowance with given `decrementAmount`
     * @param documentCreator document creator address
     * @param decrementAmount decrement amount for the document creator
     */
    function decreaseDocumentCreatorAllowance(address documentCreator, uint256 decrementAmount) external;
}
