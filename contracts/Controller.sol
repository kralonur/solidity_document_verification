// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract Controller {
    mapping(address => address) private _controllers;

    function configureController(address controller, address documentVerificationManagement) external {
        _controllers[controller] = documentVerificationManagement;
    }

    function removeController(address controller) external {
        _controllers[controller] = address(0);
    }

    function getDocumentVerificationManagement(address controller)
        public
        view
        returns (address documentVerificationManagement)
    {
        documentVerificationManagement = _controllers[controller];
    }
}
