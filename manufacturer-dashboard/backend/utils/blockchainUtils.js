const Web3 = require("web3");
require("dotenv").config();

const abi = require("../config/contractABI.json");
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_RPC_URL));

const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(abi, contractAddress);
const privateKey = process.env.PRIVATE_KEY;
const walletAddress = process.env.WALLET_ADDRESS;

async function registerProductOnBlockchain(companyName, qrHash) {
  try {
    const qrHashBytes32 = "0x" + qrHash.padStart(64, "0");

    const isRegistered = await contract.methods.registeredProducts(companyName, qrHashBytes32).call();
    if (isRegistered) throw new Error("Product is already registered on blockchain!");

    const nonce = await web3.eth.getTransactionCount(walletAddress, "pending");

    const gasPrice = await web3.eth.getGasPrice();
    const increasedGasPrice = BigInt(gasPrice) * 12n / 10n; 

    const txParams = {
      nonce: web3.utils.toHex(nonce),
      gasPrice: web3.utils.toHex(increasedGasPrice.toString()),
      gasLimit: web3.utils.toHex(200000),
      to: contractAddress,
      data: contract.methods.registerProduct(companyName, qrHashBytes32).encodeABI(),
      chainId: 11155111, 
    };

    const signedTx = await web3.eth.accounts.signTransaction(txParams, privateKey);
    
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    
    console.log("Transaction successful:", receipt.transactionHash);
    return receipt.transactionHash;
  } catch (error) {
    console.error("Blockchain Transaction Failed:", error);
    throw new Error(error.message.includes("revert") ? "Product is already registered!" : "Error registering product on blockchain.");
  }
}

module.exports = { registerProductOnBlockchain };
