import React, {useEffect, useState}from 'react';
import {ethers} from 'ethers';

import {contractABI, contractAddress} from '../utils/constants';

export const TransactionContext = React.createContext();

const {ethereum} = window;

const getEthereumContract = () =>{

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);
    return transactionContract;
}

export const TransactionProvider = ({children}) => {
    const [currentAccount, setcurrentAccount] = useState("")
    const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
    const [isLoading, setisLoading] = useState(false);
    const [transactionCount, settransactionCount] = useState(localStorage.getItem('transactionCount'));
    const handleChange = (e,name) =>{
        setformData((prevState) => ({...prevState,[name]:e.target.value}));
    }

    const checkIfWalletIsConnected = async () => {
        try {
            if(!ethereum) return alert("PLease install metamask");
            const accounts = await ethereum.request({method: 'eth_accounts'});
            if(accounts.length){
                setcurrentAccount(accounts[0]);
                // getAllTransactions();
            }
            else{
                console.log("No accounts found");
            }
            
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object found.");
        }
        
       
    }

    const connectWallet = async () => {
        try {
            if(!ethereum) return alert("PLease install metamask");
            const accounts = await ethereum.request({method: 'eth_requestAccounts'});
            setCurrentAccount(accounts[0]);

        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object found.");
        }
    }

    const sendTransaction = async () =>{
        try {
            if(!ethereum) return alert("PLease install metamask");
            const {addressTo, amount, keyword, message} = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);
            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from : currentAccount,
                    to: addressTo,
                    gas: '0x5208', //21000 gwei
                    value: parsedAmount._hex,
                }]
            });

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword); 
            setisLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            setisLoading(false);
            console.log(`Success - ${transactionHash.hash}`);
            await transactionHash.wait();

            const transactionCount = await transactionContract.getTransactionCount();

            settransactionCount(transactionCount.toNumber());
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object found.");
        }
    }
    useEffect(()=>{
        checkIfWalletIsConnected();
    }, []);
    return(
        <TransactionContext.Provider value = {{connectWallet, currentAccount, formData,setformData,handleChange, sendTransaction}}>
            {children}
        </TransactionContext.Provider>
    ); 
}