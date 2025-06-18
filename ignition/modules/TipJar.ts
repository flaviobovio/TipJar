// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";



const TipJarModule = buildModule("TipJarModule", (m) => {
  const tipJar = m.contract("TipJar");

  return { tipJar };
});

export default TipJarModule;