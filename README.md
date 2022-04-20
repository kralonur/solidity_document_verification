# Document Verification Using Solidity

This project allows verifying documents using their hashes. So as an example documents hash could be generated using keccak256 then this hash would be add to contract and signed by requested addresses.

**NOTES**

Contracts are put on verification only by document creators.
Document creators allowance set on Management contracts.
ManagementSingle contract only for managing single DocumentVerification contract.
ManagementMulti contract for managing multi DocumentVerification contracts.
For managing multiple different DocumentVerification contracts controllers are used in ManagementMulti contract, each controller can only control 1 DocumentVerification contract

## Installation

### Pre Requisites

Before running any command, you need to create a .env file and set a BIP-39 compatible mnemonic as an environment variable. Follow the example in .env.example. If you don't already have a mnemonic, use this [website](https://iancoleman.io/bip39/) to generate one.

1. Install node and npm
2. Install yarn

```bash
npm install --global yarn
```

Check that Yarn is installed by running:

```bash
yarn --version
```

Then, proceed with installing dependencies:

```bash
yarn install
```

## Usage/Examples

### Compile

Compile the smart contracts with Hardhat:

```bash
yarn compile
```

### TypeChain

Compile the smart contracts and generate TypeChain artifacts:

```bash
yarn typechain
```

### Lint Solidity and TypeScript

Lint the Solidity and TypeScript code (then check with prettier):

```bash
yarn lint
```

### Clean

Delete the smart contract artifacts, the coverage reports and the Hardhat cache:

```bash
yarn clean
```

### Docs

Create documentation for the contracts (in "docs" folder):

```bash
yarn docgen
```

### Available Tasks

To see available tasks from Hardhat:

```bash
npx hardhat
```

## Running Tests

### Test

To run tests, run the following command:

```bash
yarn test
```

### Test with gas reportage

To report gas after test, set `REPORT_GAS="true"` on `.env` file. Then run test.

### Coverage

Generate the code coverage report:

```bash
yarn coverage
```

## Deployment

### Deployment

To deploy this project first change those fields on your `.env` file:

`MNEMONIC="your mnemomic"` that should be your REAL mnemonic that you use on chain.

`RUN_OPTIMIZER="true"` that is recommended for gas fees optimization.

Then set your infura or alchemy api key (depending on chain you want to deploy).

**Deployment arguments**

You have to create deploy argument json file, using examples on `deployargs` folder.
So first create a json file using example: `deploy${ContractName}Args.example.json` file, new json file should be exact same name but without `.example` in it's file name. Example: `deploy${ContractName}Args.json`, then fill the fields.

**Deployment commands**

```bash
yarn deploy:${contractname} --network ${networkToDeploy}
```

Example:

```bash
yarn deploy:token --network rinkeby
```

### Verification

To verify the contract first change block explorer api key on your `.env` file, depending on your network.
For example, for ethereum network:
`ETHERSCAN_API_KEY="etherscan_api_key"`.

**Verification commands**

```bash
yarn verify:${contractname} --address ${deployed_contract_address} --network ${network}
```

Example:

```bash
yarn verify:token --address ${deployed_contract_address} --network rinkeby
```

## Contributing

For git linting [commitlint](https://github.com/conventional-changelog/commitlint) is being used. [This website](https://commitlint.io/) can be helpful to write commit messages.
