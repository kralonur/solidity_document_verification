# Solidity API

## IDocumentVerificationManagement

### configureDocumentCreator

```solidity
function configureDocumentCreator(address documentCreator, uint256 allowedAmount) external
```

_Adds document creator with given &#x60;allowedAmount&#x60;_

| Name            | Type    | Description                                  |
| --------------- | ------- | -------------------------------------------- |
| documentCreator | address | document creator address                     |
| allowedAmount   | uint256 | allowed document amount for document creator |

### removeDocumentCreator

```solidity
function removeDocumentCreator(address documentCreator) external
```

_Removes document creator_

| Name            | Type    | Description              |
| --------------- | ------- | ------------------------ |
| documentCreator | address | document creator address |

### documentCreatorAllowance

```solidity
function documentCreatorAllowance(address documentCreator) external view returns (uint256 allowance)
```

_Returns document creator allowance_

| Name            | Type    | Description              |
| --------------- | ------- | ------------------------ |
| documentCreator | address | document creator address |

| Name      | Type    | Description                |
| --------- | ------- | -------------------------- |
| allowance | uint256 | document creator allowance |

### isDocumentCreator

```solidity
function isDocumentCreator(address documentCreator) external view returns (bool result)
```

_Returns if the given address document creator_

| Name            | Type    | Description              |
| --------------- | ------- | ------------------------ |
| documentCreator | address | document creator address |

| Name   | Type | Description             |
| ------ | ---- | ----------------------- |
| result | bool | document creator result |
