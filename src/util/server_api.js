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
    try {
      const res = await axios.get("/api/createWallets", options);
      return res ? res.data : { error: `Error generating wallets: no response from server` };
    } catch (err) {
      const errorMessage = err.response.data.error ? err.response.data.error : 'no error message provided from server';
      return { error: `Error generating wallets: ${errorMessage}` };
    }
  };

  /* 
    Get current faucet balance + payout perent (decimal format).
  */
  const getFaucetInfo = async (token) => {
    const options = {
      headers: {
        "X-Recaptcha": token,
      },
    };
    try {
      const res = await axios.get("/api/getFaucetInfo", options);
      return res ? res.data : { error: `Error getting NanoFaucet info: no response from server` };
    } catch (err) {
      const errorMessage = err.response.data.error ? err.response.data.error : 'no error message provided from server';
      return { error: `Error getting NanoFaucet info: ${errorMessage}` };
    }
  };

   /* 
    Get a small amount of Nano from the TryNano Faucet.
  */
  const getNanoFromFaucet = async (token, toAddress, privateKey) => {
    const data = {
      toAddress,
      privateKey,
    };

    const options = {
      headers: {
        "X-Recaptcha": token,
      },
    };
    try {
      const res = await axios.post("/api/getFromFaucet", data, options);
      return res ? res.data : { error: `Error getting Nano from Faucet: no response from server` };
    } catch (err) {
      const errorMessage = err.response.data.error ? err.response.data.error : 'no error message provided from server';
      return { error: `Error getting Nano from Faucet: ${errorMessage}` };
    }
  };

  /* 
    Send nano from one wallet to another.
  */
  const sendNano = async (token, fromAddress, privateKey, toAddress, amount = "max") => {
    const data = {
      fromAddress,
      privateKey,
      toAddress,
    };

    // add amount param if it was passed in
    if (amount !== "max") {
      data.amount = amount;
    }

    const options = {
      headers: {
        "X-Recaptcha": token,
      },
    };
    try {
      const res = await axios.post("/api/send", data, options);
      return res ? res.data : { error: `Error sending nano: no response from server` };
    } catch (err) {
      const errorMessage = err.response.data.error ? err.response.data.error : 'no error message provided from server';
      return { error: `Error sending nano: ${errorMessage}` };
    }
  };

  /* 
    Receive any pending nano transactions for a given wallet.
  */
  const receiveNano = async (token, receiveAddress) => {
    const data = {
      receiveAddress,
    };
    const options = {
      headers: {
        "X-Recaptcha": token,
      },
    };
    try {
      const res = await axios.post("/api/receive", data, options);
      return res ? res.data : { error: `Error receiving nano: no response from server` };
    } catch (err) {
      const errorMessage = err.response.data.error ? err.response.data.error : 'no error message provided from server';
      return { error: `Error receiving nano: ${errorMessage}` };
    }
  };

  return {
    generateWallets,
    getFaucetInfo,
    getNanoFromFaucet,
    sendNano,
    receiveNano,
  };
};

export default serverAPI;
