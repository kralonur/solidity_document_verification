// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

interface IDocumentVerificationManagement {
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
     * @dev Returns document creator allowance
     * @param documentCreator document creator address
     * @return allowance document creator allowance
     */
    function documentCreatorAllowance(address documentCreator) external view returns (uint256 allowance);

    /**
     * @dev Returns if the given address document creator
     * @param documentCreator document creator address
     * @return result document creator result
     */
    function isDocumentCreator(address documentCreator) external view returns (bool result);
}
