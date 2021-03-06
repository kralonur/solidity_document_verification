# Solidity API

## ManagementSingle

### managementInterface

```solidity
contract IDocumentVerificationManagement managementInterface
```

Document verification management interface

### setDocumentManagementInterface

```solidity
function setDocumentManagementInterface(address documentManagementInterface) external
```

_Sets &#x60;managementInterface&#x60;_

| Name                        | Type    | Description                           |
| --------------------------- | ------- | ------------------------------------- |
| documentManagementInterface | address | document management interface address |

### configureDocumentCreator

```solidity
function configureDocumentCreator(address documentCreator, uint256 allowedAmount) external
```

_See {IManagement-configureDocumentCreator}_

### removeDocumentCreator

```solidity
function removeDocumentCreator(address documentCreator) external
```

_See {IManagement-removeDocumentCreator}_

### increaseDocumentCreatorAllowance

```solidity
function increaseDocumentCreatorAllowance(address documentCreator, uint256 incrementAmount) external
```

_See {IManagement-increaseDocumentCreatorAllowance}_

### decreaseDocumentCreatorAllowance

```solidity
function decreaseDocumentCreatorAllowance(address documentCreator, uint256 decrementAmount) external
```

_See {IManagement-decreaseDocumentCreatorAllowance}_

### \_configureDocumentCreator

```solidity
function _configureDocumentCreator(address documentCreator, uint256 allowedAmount) private
```

_Internal configure document creator function_
