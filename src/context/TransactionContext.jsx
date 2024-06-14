import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";


export const TransactionContext = React.createContext();


const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionsContract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [transactionCount,setTransactionCount] = useState(localStorage.getItem("transactionCount"))
  const [isLoading,setIsLoading] =useState(false);
  const [transactions,setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTransaction = async()=>{
    try {
      if (!ethereum) return alert("please install metamask");
      const transactionsContract = getEthereumContract();
      const availableTransactions = await transactionsContract.getTransactions();
      const structeredTransaction = availableTransactions.map((transaction)=>({
        addressTo: transaction.to,
        addressFrom: transaction.from,
        amount: parseInt(transaction.amount._hex)/(10**18),
        message: transaction.message,
        timestamp: new Date(transaction.timestamp.toNumber() *1000).toLocaleString(),
        keyword:transaction.keyword
      }));

      setTransactions(structeredTransaction);
      console.log(structeredTransaction) 
    } catch (error) {
      console.log(error)
      throw new Error("No ethereum object");
    }
  }

  const checkIfWalletsConnected = async () => {
    try {
      if (!ethereum) return alert("please install metamask");

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransaction();
      } else {
        console.log("no account");
      }
      console.log(accounts);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const checkIfTransactionsExist = async()=>{
    try {
      const transactionsContract = getEthereumContract();
      const transactionCount = await transactionsContract.getTransactionCount()

      window.localStorage.setItem("transactionCount", transactionCount)

    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  }

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("please install metamask");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const sendToken = async () => {
    try {
      if (!ethereum) return alert("please install metamask");
      const { addressTo, amount, keyword, message } = formData;
      const transactionsContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);
      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208",
            value: parsedAmount._hex,
          },
        ],
      });

      const transactionHash = await transactionsContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );

      setIsLoading(true)
      console.log(`Loading-${transactionHash.hash}`)
      await transactionHash.wait()
      setIsLoading(false)
      console.log(`success-${transactionHash.hash}`)
      await transactionHash.wait()

      const transactionCount = await transactionsContract.getTransactionCount()
      setTransactionCount(transactionCount.toNumber())

      window.reload()
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  useEffect(() => {
    checkIfWalletsConnected()
    checkIfTransactionsExist()
  },[transactionCount]);
  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        setFormData,
        handleChange,
        sendToken,
        transactions,
        isLoading
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
