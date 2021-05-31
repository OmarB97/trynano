<template>
  <el-progress
    :width="1000"
    :percentage="currentPercent"
    :status="status"
    :show-text="false"
    :indeterminate="isTransactionInProgress"
    :stroke-width="6"
    :duration="1"
  ></el-progress>
</template>

<script>
import { ref, getCurrentInstance } from 'vue';

export default {
  name: 'NanoTransactionStatusBar',
  setup() {
    const { emitter } = getCurrentInstance().appContext.config.globalProperties;
    const currentPercent = ref(0);
    const isTransactionInProgress = ref(false);
    const status = ref(null);

    emitter.on('transaction-started', () => {
      currentPercent.value = 50;
      isTransactionInProgress.value = true;
      status.value = null;
    });

    emitter.on('transaction-finished', (transactionStatus) => {
      currentPercent.value = 100;
      isTransactionInProgress.value = false;
      status.value = transactionStatus;
    });

    return { status, currentPercent, isTransactionInProgress };
  },
};
</script>

<style scoped></style>
