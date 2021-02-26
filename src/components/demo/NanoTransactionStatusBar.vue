<template>
  <el-progress
    width="1000"
    :percentage="currentPercent"
    :status="status"
    :show-text="didStartTransaction"
  ></el-progress>
</template>

<script>
import { ref, getCurrentInstance } from 'vue';

export default {
  name: 'NanoTransactionStatusBar',
  setup() {
    const { emitter } = getCurrentInstance().appContext.config.globalProperties;
    const currentPercent = ref('0');
    const didStartTransaction = ref(false);
    const status = ref(null);

    console.log('NanoTransactionStatusBar component setup');

    emitter.on('transaction-started', () => {
      didStartTransaction.value = true;
      currentPercent.value = '0';
      status.value = null;
      const interval = setInterval(() => {
        if (parseInt(currentPercent.value, 10) < 99) {
          currentPercent.value = (parseInt(currentPercent.value, 10) + 1).toString();
        }
        if (status.value !== null) {
          clearInterval(interval);
        }
      }, 100);
    });

    emitter.on('transaction-finished', () => {
      currentPercent.value = '100';
      status.value = 'success';
    });

    return { didStartTransaction, status, currentPercent };
  },
};
</script>

<style scoped></style>
