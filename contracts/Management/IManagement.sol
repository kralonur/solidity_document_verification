// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

interface IManagement {
    error DocumentCreatorNotFound();
    error DecrementAmountExceedsAllowance();

    /**
     * @dev Emitted when the document creator configured
     * @param documentCreator The address of the document creator
     * @param allowedAmount The allowed amount for the document creator
     */
    event DocumentCreatorConfigured(address indexed documentCreator, uint256 allowedAmount);
    /**
     * @dev Emitted when the document creator removed
     * @param documentCreator The address of the document creator
     */
    event DocumentCreatorRemoved(address indexed documentCreator);

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
