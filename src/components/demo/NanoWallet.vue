<template>
  <div
    class="wallet"
    :class="{
      'wallet-phone': $mq === 'phone',
      'wallet-tablet': $mq === 'tablet',
      'wallet-other': $mq === 'other',
    }"
  >
    <h3 class="wallet-label">Nano Wallet {{ walletLetter }}</h3>
    <img
      class="logo"
      :class="{
        'logo-phone': $mq === 'phone',
        'logo-tablet': $mq === 'tablet',
        'logo-other': $mq === 'other',
      }"
      src="../../assets/wallet.png"
    />
    <div style="display: block">
      <strong style="display: inline-block">Address:&ensp;</strong>
      <div class="overflow" style="display: inline-block">{{ shortenedNanoAddress }}</div>
    </div>
    <div style="display: block">
      <strong style="display: inline-block">Balance:&ensp;</strong>
      <div class="overflow" style="display: inline-block">{{ nanoBalance }} Ñ</div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
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
    const shortenedNanoAddress = computed(
      () => props.walletAddress.slice(0, 5) + props.walletAddress.slice(-7)
    );
    const nanoBalance = computed(() => {
      return removeTrailingZeros(tools.convert(props.walletBalance.raw, 'RAW', 'NANO'));
    });
    return { shortenedNanoAddress, nanoBalance };
  },
};
</script>

<style scoped>
.wallet {
  width: 100%;
  margin: auto;
  text-align: center;
}

.wallet-label {
  margin: 0px 10px;
}

.wallet-phone {
  font-size: 0.8em;
}

.wallet-tablet {
  font-size: 0.9em;
}

.wallet-other {
  font-size: 1em;
}

.logo {
  height: auto;
  width: auto;
  margin: auto;
}

.logo-phone {
  max-width: 35px;
  max-height: 35px;
}

.logo-tablet {
  max-width: 40px;
  max-height: 40px;
}

.logo-other {
  max-width: 50px;
  max-height: 50px;
}

.overflow {
  overflow-wrap: break-word;
  max-width: 100%;
}
</style>
