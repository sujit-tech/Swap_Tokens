const { ethers } = require('hardhat');
const main = async () => {
  const Transactions = await ethers.getContractFactory("Transactions");
  const transaction = await Transactions.deploy();
  await transaction.waitForDeployment()

  console.log("Transactions is deployed at:", transaction.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
runMain();
