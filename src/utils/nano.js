import { wallet } from 'nanocurrency-web';

const generateNanoWallets = () => {
  const firstNanoWallet = wallet.generate().accounts[0];
  const secondNanoWallet = wallet.generate().accounts[0];
  const firstWalletData = {
    // address: firstNanoWallet.address,
    address: 'nano_17yrgm818r4348g4r61oc7x3w6nd68ji85686d5xo3nt455znb65zafaofrq',
    privateKey: firstNanoWallet.privateKey,
    publicKey: firstNanoWallet.publicKey,
    amount: 0,
  };

  const secondWalletData = {
    address: secondNanoWallet.address,
    privateKey: secondNanoWallet.privateKey,
    publicKey: secondNanoWallet.publicKey,
    amount: 0,
  };

  console.log(firstWalletData);
  console.log(secondWalletData);

  return [firstWalletData, secondWalletData];
};

export default generateNanoWallets;
