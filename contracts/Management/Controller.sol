// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Controller contract for the management
 */
contract Controller is Ownable {
    error CallerIsNotController();

    // A mapping for storing document verification management for each controller
    mapping(address => address) private _controllers;

    modifier onlyController() {
        if (_controllers[msg.sender] == address(0)) revert CallerIsNotController();
        _;
    }

    /**
     * @dev Sets document verification management for the controller
     * @param controller Controller address
     * @param documentVerificationManagement documentVerificationManagement address
     */
    function configureController(address controller, address documentVerificationManagement) external onlyOwner {
        _controllers[controller] = documentVerificationManagement;
    }

    /**
     * @dev Removes document verification management from the controller
     * @param controller Controller address
     */
    function removeController(address controller) external onlyOwner {
        _controllers[controller] = address(0);
    }

    /**
     * @dev Returns document verification management for controller
     * @param controller Controller address
     * @return documentVerificationManagement document verification management address
     */
    function getDocumentVerificationManagement(address controller)
        public
        view
        returns (address documentVerificationManagement)
    {
        documentVerificationManagement = _controllers[controller];
    }
}
