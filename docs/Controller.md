# Solidity API

## Controller

### CallerIsNotController

```solidity
error CallerIsNotController()
```

### \_controllers

```solidity
mapping(address &#x3D;&gt; address) _controllers
```

### ControllerConfigured

```solidity
event ControllerConfigured(address controller, address documentVerificationManagement)
```

_Emitted when the controller configured_

| Name                           | Type    | Description                                         |
| ------------------------------ | ------- | --------------------------------------------------- |
| controller                     | address | The address of the controller                       |
| documentVerificationManagement | address | The address of the document verification management |

### ControllerRemoved

```solidity
event ControllerRemoved(address controller)
```

_Emitted when the controller removed_

| Name       | Type    | Description                   |
| ---------- | ------- | ----------------------------- |
| controller | address | The address of the controller |

### onlyController

```solidity
modifier onlyController()
```

### configureController

```solidity
function configureController(address controller, address documentVerificationManagement) external
```

_Sets document verification management for the controller_

| Name                           | Type    | Description                            |
| ------------------------------ | ------- | -------------------------------------- |
| controller                     | address | Controller address                     |
| documentVerificationManagement | address | documentVerificationManagement address |

### removeController

```solidity
function removeController(address controller) external
```

_Removes document verification management from the controller_

| Name       | Type    | Description        |
| ---------- | ------- | ------------------ |
| controller | address | Controller address |

### getDocumentVerificationManagement

```solidity
function getDocumentVerificationManagement(address controller) public view returns (address documentVerificationManagement)
```

_Returns document verification management for controller_

| Name       | Type    | Description        |
| ---------- | ------- | ------------------ |
| controller | address | Controller address |

| Name                           | Type    | Description                              |
| ------------------------------ | ------- | ---------------------------------------- |
| documentVerificationManagement | address | document verification management address |
