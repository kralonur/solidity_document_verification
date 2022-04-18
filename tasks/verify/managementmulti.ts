import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

task("verify:managementmulti", "Verifies the ManagementMulti contract")
  .addParam("address", "The contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    await hre.run("verify:verify", {
      address: taskArguments.address,
      constructorArguments: [],
    });
  });
