# Solidity API

## IManagement

### DocumentCreatorNotFound

```solidity
error DocumentCreatorNotFound()
```

### DecrementAmountExceedsAllowance

```solidity
error DecrementAmountExceedsAllowance()
```

### DocumentCreatorConfigured

```solidity
event DocumentCreatorConfigured(address documentCreator, uint256 allowedAmount)
```

_Emitted when the document creator configured_

| Name            | Type    | Description                                 |
| --------------- | ------- | ------------------------------------------- |
| documentCreator | address | The address of the document creator         |
| allowedAmount   | uint256 | The allowed amount for the document creator |

### DocumentCreatorRemoved

```solidity
event DocumentCreatorRemoved(address documentCreator)
```

_Emitted when the document creator removed_

| Name            | Type    | Description                         |
| --------------- | ------- | ----------------------------------- |
| documentCreator | address | The address of the document creator |

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

### increaseDocumentCreatorAllowance

```solidity
function increaseDocumentCreatorAllowance(address documentCreator, uint256 incrementAmount) external
```

_Increases document creator allowance with given &#x60;incrementAmount&#x60;_

| Name            | Type    | Description                               |
| --------------- | ------- | ----------------------------------------- |
| documentCreator | address | document creator address                  |
| incrementAmount | uint256 | increment amount for the document creator |

### decreaseDocumentCreatorAllowance

```solidity
function decreaseDocumentCreatorAllowance(address documentCreator, uint256 decrementAmount) external
```

_Decreases document creator allowance with given &#x60;decrementAmount&#x60;_

| Name            | Type    | Description                               |
| --------------- | ------- | ----------------------------------------- |
| documentCreator | address | document creator address                  |
| decrementAmount | uint256 | decrement amount for the document creator |
