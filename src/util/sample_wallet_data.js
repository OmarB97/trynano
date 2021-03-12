import { ref } from "vue";

const sampleWalletData =  () => {
  const firstSampleWallet = ref({
      address: "",
      privateKey: "",
      balance: { raw: "" },
  }); 
  const secondSampleWallet = ref({
      address: "",
      privateKey: "",
      balance: { raw: "" },
  }); 
  
  return {
    firstSampleWallet,
    secondSampleWallet,
  };
}

export default sampleWalletData;
