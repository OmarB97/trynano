<template>
  <h3 class="wallet-label">Nano Wallet {{ walletLetter }}</h3>
  <img class="logo" src="../../assets/wallet.png" />
  <div>Balance: {{ walletBalance }} Ñ</div>
</template>

<script>
export default {
  name: 'NanoWallet',
  props: {
    walletLetter: String,
    walletBalance: Number,
  },
  setup() {
    console.log('NanoWallet component setup');
  },
};
</script>

<style scoped>
.wallet-label {
  margin: 0px 10px;
}

.logo {
  height: auto;
  width: auto;
  max-width: 50px;
  max-height: 50px;
}
</style>
