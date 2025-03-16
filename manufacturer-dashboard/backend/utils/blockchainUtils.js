const Web3 = require("web3");
const abi = require("../config/contractABI.json"); // Smart contract ABI
const { Transaction } = require("@ethereumjs/tx");
const Common = require("@ethereumjs/common").default;

require("dotenv").config();

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_RPC_URL));

// Load contract
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(abi, contractAddress);

// Load wallet (Private key should NEVER be exposed)
const privateKey = Buffer.from(process.env.PRIVATE_KEY, "hex");
const walletAddress = process.env.WALLET_ADDRESS;

// Blockchain function to register company & QR hash
async function registerProductOnBlockchain(companyName, qrHash) {
  try {
    const qrHashBytes32 = "0x" + qrHash.padStart(64, "0"); // Convert hash to Bytes32

    // 🚀 **Check if the product is already registered before proceeding**
    const isRegistered = await contract.methods.registeredProducts(companyName, qrHashBytes32).call();
    if (isRegistered) {
      throw new Error("Product is already registered on blockchain!");
    }

    const txData = contract.methods.registerProduct(companyName, qrHashBytes32).encodeABI();

    const nonce = await web3.eth.getTransactionCount(walletAddress, "latest");
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 200000;

    const txParams = {
      nonce: web3.utils.toHex(nonce),
      gasPrice: web3.utils.toHex(gasPrice),
      gasLimit: web3.utils.toHex(gasLimit),
      to: contractAddress,
      data: txData,
      chainId: 11155111, // Sepolia Testnet Chain ID
    };

    const common = Common.custom({ chainId: 11155111 });
    const tx = Transaction.fromTxData(txParams, { common });
    const signedTx = tx.sign(privateKey);
    const serializedTx = "0x" + signedTx.serialize().toString("hex");

    const receipt = await web3.eth.sendSignedTransaction(serializedTx);
    console.log("Transaction successful:", receipt.transactionHash);
    return receipt.transactionHash;
  } catch (error) {
    console.error("Blockchain Transaction Failed:", error);
    if (error.message.includes("revert") || error.message.includes("already registered")) {
      throw new Error("Product is already registered!");
    }
    throw new Error("Error registering product on blockchain.");
  }
}

module.exports = { registerProductOnBlockchain };
