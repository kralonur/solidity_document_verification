import { task } from "hardhat/config";
import fs from "fs-extra";
import { TaskArguments } from "hardhat/types";

task("verify:documentverification", "Verifies the DocumentVerification contract")
  .addParam("address", "The contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const json = fs.readJSONSync("./deployargs/deployDocumentVerificationArgs.json");
    const management = String(json.management);

    await hre.run("verify:verify", {
      address: taskArguments.address,
      constructorArguments: [management],
    });
  });
