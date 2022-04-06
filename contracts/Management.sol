// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./Controller.sol";
import "./IDocumentVerificationManagement.sol";

contract Management is Controller {
    function configureDocumentCreator(address documentCreator, uint256 allowedAmount) external {
        //TODO: get address from controller
        IDocumentVerificationManagement managementInterface = IDocumentVerificationManagement(address(0));

        managementInterface.configureDocumentCreator(documentCreator, allowedAmount);
    }

    function increaseDocumentCreatorAllowance(address documentCreator, uint256 incrementAmount) external {
        //TODO: get address from controller
        IDocumentVerificationManagement managementInterface = IDocumentVerificationManagement(address(0));

        uint256 currentAllowance = managementInterface.documentCreatorAllowance(documentCreator);
        uint256 newAllowance = currentAllowance + incrementAmount;

        managementInterface.configureDocumentCreator(documentCreator, newAllowance);
    }

    function decreaseDocumentCreatorAllowance(address documentCreator, uint256 decrementAmount) external {
        //TODO: get address from controller
        IDocumentVerificationManagement managementInterface = IDocumentVerificationManagement(address(0));

        uint256 currentAllowance = managementInterface.documentCreatorAllowance(documentCreator);
        uint256 newAllowance = currentAllowance - decrementAmount;

        managementInterface.configureDocumentCreator(documentCreator, newAllowance);
    }
}
