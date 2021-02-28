<template>
  <h3 class="wallet-label">Nano Wallet {{ walletLetter }}</h3>
  <img class="logo" src="../../assets/wallet.png" />
  <div style="display: block">
    <strong style="display: inline-block">Address:&ensp;</strong>
    <div style="display: inline-block">{{ shortenedNanoAddress }}</div>
  </div>
  <div style="display: block">
    <strong style="display: inline-block">Balance:&ensp;</strong>
    <div style="display: inline-block">{{ nanoBalance }} Ñ</div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import removeTrailingZeros from 'remove-trailing-zeros';
import { tools } from 'nanocurrency-web';

export default {
  name: 'NanoWallet',
  props: {
    walletLetter: String,
    walletAddress: String,
    walletBalance: Object,
  },
  setup(props) {
    const shortenedNanoAddress = ref(
      props.walletAddress.slice(0, 5) + props.walletAddress.slice(-7)
    );
    const nanoBalance = computed(() => {
      return removeTrailingZeros(tools.convert(props.walletBalance.raw, 'RAW', 'NANO'));
    });
    return { shortenedNanoAddress, nanoBalance };
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
