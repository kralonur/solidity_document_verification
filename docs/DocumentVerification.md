# Solidity API

## DocumentVerification

### LateToExecute

```solidity
error LateToExecute(uint256 executeTime)
```

### SignerIsNotRequested

```solidity
error SignerIsNotRequested()
```

### SignerAlreadySigned

```solidity
error SignerAlreadySigned()
```

### SignerDidNotSigned

```solidity
error SignerDidNotSigned()
```

### InvalidDocument

```solidity
error InvalidDocument()
```

### CallerIsNotManagement

```solidity
error CallerIsNotManagement()
```

### CallerIsNotDocumentCreator

```solidity
error CallerIsNotDocumentCreator()
```

### DocumentCreatorAllowanceNotEnough

```solidity
error DocumentCreatorAllowanceNotEnough()
```

### DocumentIsAlreadyOnVerification

```solidity
error DocumentIsAlreadyOnVerification()
```

### RequestedSignersAreNotEnough

```solidity
error RequestedSignersAreNotEnough(uint256 sentLength, uint256 requiredLength)
```

### MIN_VOTER_COUNT

```solidity
uint256 MIN_VOTER_COUNT
```

### VerificationType

```solidity
enum VerificationType {
  INVALID,
  MULTISIG,
  VOTING
}

```

### Document

```solidity
struct Document {
  uint128 verificationCreatedAt;
  uint128 verificationDeadline;
  uint128 documentDeadline;
  enum DocumentVerification.VerificationType verificationType;
  address[] requestedSigners;
}
```

### \_documents

```solidity
mapping(bytes32 &#x3D;&gt; struct DocumentVerification.Document) _documents
```

A mapping for storing documents for each hash

### \_signatures

```solidity
mapping(bytes32 &#x3D;&gt; struct SignatureSet.SignSet) _signatures
```

A mapping for storing document signatures for each document

### \_documentCreators

```solidity
mapping(address &#x3D;&gt; bool) _documentCreators
```

A mapping for storing document creator list

### \_documentCreatorAllowance

```solidity
mapping(address &#x3D;&gt; uint256) _documentCreatorAllowance
```

A mapping for storing document creator allowance

### management

```solidity
address management
```

Management contract address

### DocumentPutOnVerification

```solidity
event DocumentPutOnVerification(bytes32 documentHash, address documentCreator)
```

_Emitted when the document put on verification_

| Name            | Type    | Description                                                    |
| --------------- | ------- | -------------------------------------------------------------- |
| documentHash    | bytes32 | The hash of the document                                       |
| documentCreator | address | The document creator address that put document on verification |

### DocumentSigned

```solidity
event DocumentSigned(bytes32 documentHash, address signer)
```

_Emitted when the document signed_

| Name         | Type    | Description                 |
| ------------ | ------- | --------------------------- |
| documentHash | bytes32 | The hash of the document    |
| signer       | address | The document signer address |

### DocumentSignRevoked

```solidity
event DocumentSignRevoked(bytes32 documentHash, address signRevoker)
```

_Emitted when the document signed_

| Name         | Type    | Description                       |
| ------------ | ------- | --------------------------------- |
| documentHash | bytes32 | The hash of the document          |
| signRevoker  | address | The document sign revoker address |

### constructor

```solidity
constructor(address _management) public
```

### onlyDocumentCreator

```solidity
modifier onlyDocumentCreator()
```

### onlyManagement

```solidity
modifier onlyManagement()
```

### validDocument

```solidity
modifier validDocument(bytes32 documentHash)
```

### putDocumentToVerification

```solidity
function putDocumentToVerification(bytes32 documentHash, uint128 verificationDeadline, uint128 documentDeadline, enum DocumentVerification.VerificationType verificationType, address[] requestedSigners) external
```

_Puts document to verification_

| Name                 | Type                                       | Description                                              |
| -------------------- | ------------------------------------------ | -------------------------------------------------------- |
| documentHash         | bytes32                                    | hash of the document to put on verification              |
| verificationDeadline | uint128                                    | deadline for the signing period                          |
| documentDeadline     | uint128                                    | deadline for the document validity                       |
| verificationType     | enum DocumentVerification.VerificationType | see {VerificationType}                                   |
| requestedSigners     | address[]                                  | list of addresses that are allowed to sign this document |

### signDocument

```solidity
function signDocument(bytes32 documentHash) external
```

_Signs the document (approves it&#x27;s validity)_

| Name         | Type    | Description                         |
| ------------ | ------- | ----------------------------------- |
| documentHash | bytes32 | hash of the document to put on sign |

### revokeSign

```solidity
function revokeSign(bytes32 documentHash) external
```

_Revokes the sign from the document (approves it&#x27;s validity)_

| Name         | Type    | Description                              |
| ------------ | ------- | ---------------------------------------- |
| documentHash | bytes32 | hash of the document to revoke sign from |

### configureDocumentCreator

```solidity
function configureDocumentCreator(address documentCreator, uint256 allowedAmount) external
```

_See &#x60;IDocumentVerificationManagement-configureDocumentCreator&#x60;_

### removeDocumentCreator

```solidity
function removeDocumentCreator(address documentCreator) external
```

_See &#x60;IDocumentVerificationManagement-removeDocumentCreator&#x60;_

### isDocumentLegit

```solidity
function isDocumentLegit(bytes32 documentHash) external view returns (bool legit)
```

_Returns if the document is legit (checks the document depending on &#x60;VerificationType&#x60;)_

| Name         | Type    | Description                                |
| ------------ | ------- | ------------------------------------------ |
| documentHash | bytes32 | hash of the document to check legit status |

| Name  | Type | Description                |
| ----- | ---- | -------------------------- |
| legit | bool | the documents legit result |

### documentCreatorAllowance

```solidity
function documentCreatorAllowance(address documentCreator) external view returns (uint256 allowance)
```

_See &#x60;IDocumentVerificationManagement-documentCreatorAllowance&#x60;_

### isDocumentCreator

```solidity
function isDocumentCreator(address documentCreator) external view returns (bool result)
```

_See &#x60;IDocumentVerificationManagement-isDocumentCreator&#x60;_

### getDocument

```solidity
function getDocument(bytes32 documentHash) external view returns (struct DocumentVerification.Document document)
```

_Returns the document from given hash_

| Name         | Type    | Description          |
| ------------ | ------- | -------------------- |
| documentHash | bytes32 | hash of the document |

| Name     | Type                                 | Description  |
| -------- | ------------------------------------ | ------------ |
| document | struct DocumentVerification.Document | the document |

### getSigners

```solidity
function getSigners(bytes32 documentHash) external view returns (struct SignatureSet.Sign[] signers)
```

_Returns the signers that signed the document_

| Name         | Type    | Description          |
| ------------ | ------- | -------------------- |
| documentHash | bytes32 | hash of the document |

| Name    | Type                       | Description             |
| ------- | -------------------------- | ----------------------- |
| signers | struct SignatureSet.Sign[] | see {SignatureSet-Sign} |

### \_isSignerRequestedByDocument

```solidity
function _isSignerRequestedByDocument(bytes32 documentHash, address signer) private view returns (bool requested)
```

_Returns if the given &#x60;signer&#x60; requested by the document_

| Name         | Type    | Description                        |
| ------------ | ------- | ---------------------------------- |
| documentHash | bytes32 | hash of the document               |
| signer       | address | the address of the signer to check |

| Name      | Type | Description             |
| --------- | ---- | ----------------------- |
| requested | bool | the result of the check |

### \_isSignerSignedTheDocument

```solidity
function _isSignerSignedTheDocument(bytes32 documentHash, address signer) private view returns (bool signed)
```

_Returns if the given &#x60;signer&#x60; signed the document_

| Name         | Type    | Description                        |
| ------------ | ------- | ---------------------------------- |
| documentHash | bytes32 | hash of the document               |
| signer       | address | the address of the signer to check |

| Name   | Type | Description             |
| ------ | ---- | ----------------------- |
| signed | bool | the result of the check |

### \_multisigCheck

```solidity
function _multisigCheck(struct DocumentVerification.Document document, struct SignatureSet.SignSet signSet) private view returns (bool legit)
```

_Returns if the document is valid for multi signature standards_

| Name     | Type                                 | Description                |
| -------- | ------------------------------------ | -------------------------- |
| document | struct DocumentVerification.Document | see {Document}             |
| signSet  | struct SignatureSet.SignSet          | see {SignatureSet-SignSet} |

| Name  | Type | Description                |
| ----- | ---- | -------------------------- |
| legit | bool | the documents legit result |

### \_votingCheck

```solidity
function _votingCheck(struct DocumentVerification.Document document, struct SignatureSet.SignSet signSet) private view returns (bool legit)
```

_Returns if the document is valid for voting standards_

| Name     | Type                                 | Description                |
| -------- | ------------------------------------ | -------------------------- |
| document | struct DocumentVerification.Document | see {Document}             |
| signSet  | struct SignatureSet.SignSet          | see {SignatureSet-SignSet} |

| Name  | Type | Description                |
| ----- | ---- | -------------------------- |
| legit | bool | the documents legit result |
