<template>
  <div
    class="wallet"
    :class="{
      'wallet-phone': $mq === 'phone',
      'wallet-tabletSm': $mq === 'tabletSm',
      'wallet-tablet': $mq === 'tablet',
      'wallet-other': $mq === 'other',
    }"
  >
    <h3 class="wallet-label">{{ t('demo.nanoWallet.walletLabel', { walletLetter }) }}</h3>
    <img
      class="logo"
      :class="{
        'logo-phone': $mq === 'phone',
        'logo-tabletSm': $mq === 'tabletSm',
        'logo-tablet': $mq === 'tablet',
        'logo-other': $mq === 'other',
      }"
      src="../../assets/wallet.png"
    />
    <div style="display: block">
      <strong style="display: inline-block"
        >{{ t('demo.nanoWallet.addressLabel') }}&ensp;</strong
      >
      <div class="overflow" style="display: inline-block">{{ shortenedNanoAddress }}</div>
    </div>
    <div style="display: block">
      <strong style="display: inline-block"
        >{{ t('demo.nanoWallet.walletBalance.label') }}&ensp;</strong
      >
      <div class="overflow" style="display: inline-block">
        {{ t('demo.nanoWallet.walletBalance.amount', { nanoBalance }) }}
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
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
    const { t } = useI18n({ useScope: 'global' });
    const shortenedNanoAddress = computed(
      () => props.walletAddress.slice(0, 5) + props.walletAddress.slice(-7)
    );
    const nanoBalance = computed(() => {
      return removeTrailingZeros(tools.convert(props.walletBalance.raw, 'RAW', 'NANO'));
    });
    return { t, shortenedNanoAddress, nanoBalance };
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

.wallet-tabletSm {
  font-size: 0.85em;
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

.logo-tabletSm {
  max-width: 37.5px;
  max-height: 37.5px;
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
