import axios from "axios";

const serverAPI = () => {
  /* 
    Generate two Nano wallets.
  */
  const generateWallets = async (token) => {
    const options = {
      headers: {
        "X-Recaptcha": token,
      },
    };
    const res = await axios.get("/api/createWallets", options);
    return res ? res.data : {'error': 'Error generating wallets: no response from server'};
  };

  /* 
    Send nano from one wallet to another.
  */
  const sendNano = async (token, fromAddress, privateKey, toAddress) => {
    console.log(fromAddress);
    console.log(privateKey);
    console.log(toAddress);
    const data = {
      'fromAddress': fromAddress,
      'privateKey': privateKey,
      'toAddress': toAddress,
    };
    const options = {
      headers: {
        "X-Recaptcha": token,
      },
    };
    const res = await axios.post("/api/send", data, options);
    return res ? res.data : {'error': 'Error sending nano: no response from server'};

  };

  /* 
    Receive any pending nano transactions for a given wallet.
  */
  const receiveNano = async (token, receiveAddress) => {
    console.log(receiveAddress);
    const data = {
      'receiveAddress': receiveAddress,
    };
    const options = {
      headers: {
        "X-Recaptcha": token,
      },
    };
    const res = await axios.post("/api/receive", data, options);
    return res ? res.data : {'error': 'Error receiving nano: no response from server'};
  };

  /* 
    Get a small amount of Nano from the TryNano Faucet.
  */
  const getNanoFromFaucet = async (token, toAddress, privateKey) => {
    const data = {
      'toAddress': toAddress,
      'privateKey': privateKey,
    };

    const options = {
      headers: {
        "X-Recaptcha": token,
      },
    };
    const res = await axios.post("/api/getFromFaucet", data, options);
    return res ? res.data : {'error': 'Error getting Nano from Faucet: no response from server'};
  };

  return {
    generateWallets,
    getNanoFromFaucet,
    sendNano,
    receiveNano,
  };
};

export default serverAPI;
