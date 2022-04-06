// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Controller is Ownable {
    error CallerIsNotController();

    mapping(address => address) private _controllers;

    modifier onlyController() {
        if (_controllers[msg.sender] == address(0)) revert CallerIsNotController();
        _;
    }

    function configureController(address controller, address documentVerificationManagement) external onlyOwner {
        _controllers[controller] = documentVerificationManagement;
    }

    function removeController(address controller) external onlyOwner {
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
