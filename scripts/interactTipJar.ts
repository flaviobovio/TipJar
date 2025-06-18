import { ethers } from "ethers";
import { vars } from "hardhat/config";
import tipJarABI from "../artifacts/contracts/TipJar.sol/TipJar.json";
import * as readline from "readline";

// command to run this script:
// hh run scripts/interactTipJar.ts


// environment variables required:
// npx hardhhhat vars list
const ALCHEMY_API_KEY = vars.get("ALCHEMY_API_KEY");
const SEPOLIA_PRIVATE_KEY = vars.get("SEPOLIA_PRIVATE_KEY");
//const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY");


// Connect to Ethereum provider
const provider = new ethers.JsonRpcProvider(
  `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
);

// Load wallet from private key 
const wallet = new ethers.Wallet(SEPOLIA_PRIVATE_KEY, provider);

// Replace with the deployed contract address
const tipJarAddress = "0x892d541576E17B426b078666EB642cb748E0B6e5";

// Create a contract instance
const tipJarContract = new ethers.Contract(
  tipJarAddress,
  tipJarABI.abi,
  wallet
);



// Send tip with a message
async function sendTip() {
  console.log("Sending tip...");
  const tipAmount = ethers.parseEther("0.001"); // Tip amount in ETH
  const tipMessage = "Thank you"; // Tip message
  const tipTx = await tipJarContract.tip(tipMessage, {
    value: tipAmount,
  });
  console.log("tipTx", tipTx);
  await tipTx.wait(); // Wait for the transaction to be mined
  console.log(
    `Tip of ${ethers.formatEther(tipAmount)} ETH sent with message: "${tipMessage}"`
  );
}

// Send tip from another account
async function sendTipOtherAccount() {
  const privateKey = await askQuestion("Enter the private key of the sender account: ");

  try {
    const tipperWallet = new ethers.Wallet(privateKey, provider);
    const tipperContract = new ethers.Contract(tipJarAddress, tipJarABI.abi, tipperWallet);

    const tipMessage = await askQuestion("Enter a tip message: ");
    const amountInput = await askQuestion("Enter tip amount in ETH (e.g., 0.001): ");
    const tipAmount = ethers.parseEther(amountInput);

    const tx = await tipperContract.tip(tipMessage, { value: tipAmount });
    console.log("⏳ Sending transaction...");
    await tx.wait();

    console.log(`✅ ${ethers.formatEther(tipAmount)} ETH sent from ${tipperWallet.address} with message: "${tipMessage}"`);
  } catch (err) {
    console.error("❌ Error sending tip:", err);
  }
}



// Get all Tips
async function getAllTips() {
  console.log("Fetching all tips...");
  const tips = await tipJarContract.getAllTips();
  if (tips.length === 0) {
    console.log("No tips found.");
  } else {
    tips.forEach((tip, index) => {
      console.log(`Tip ${index + 1}:`);
      console.log(`  Amount: ${ethers.formatEther(tip.amount)} ETH`);
      console.log(`  Message: ${tip.message}`);
      console.log(`  Sender: ${tip.sender}`);
      console.log("-----------------------------");
    });
  }
}


      

// Check the balance of the contract
async function checkContractBalance() {
  console.log("Checking contract balance...");
  const balance = await tipJarContract.getBalance();
  console.log(`Contract balance: ${ethers.formatEther(balance)} ETH`);
}
// Withdraw funds from the contract
async function withdrawFunds() {
  console.log("Withdrawing funds...");
  const withdrawTx = await tipJarContract.withdraw();
  console.log("withdrawTx", withdrawTx);
  await withdrawTx.wait(); // Wait for the transaction to be mined
  console.log("Funds withdrawn successfully!");
}
// Fetch the contract owner
async function fetchContractOwner() {

  console.log("Fetching contract owner...");
  const owner = await tipJarContract.owner();
  console.log(`Contract Owner: ${owner}`);
}



// Helpers
function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    })
  );
}



// Menu
async function main() {
  while (true) {
    const answer = await askQuestion(
      `\nChoose an action:
1 - Fetch Contract Owner
2 - Check Contract Balance
3 - Send Tip (0.001 ETH)
4 - Send Tip from another account (requires private key) ** Not working yet
5 - Get All Tips
6 - Withdraw Funds
0 - Exit
> `
    );

    switch (answer) {
      case "1":
        await fetchContractOwner();
        break;
      case "2":
        await checkContractBalance();
        break;
      case "3":
        await sendTip();
        break;
      case "4":
        await sendTipOtherAccount();
        break;    
      case "5":
        await getAllTips();
        break;        
      case "6":
        await withdrawFunds();
        break;
      case "0":
        console.log("👋 Exiting...");
        process.exit(0);
      default:
        console.log("❌ Invalid option. Please choose a valid number.");
    }

  }
}




// Run the main function
main();