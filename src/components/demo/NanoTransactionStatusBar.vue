<template>
  <el-progress
    :width="1000"
    :percentage="currentPercent"
    :status="status"
    :show-text="false"
    :indeterminate="isTransactionInProgress"
    :speed="3"
    :stroke-width="$mq === 'phone' ? 16 : 6"
  ></el-progress>
</template>

<script>
import { ref, getCurrentInstance } from 'vue';

export default {
  name: 'NanoTransactionStatusBar',
  props: {
    status: String,
  },
  setup() {
    const { emitter } = getCurrentInstance().appContext.config.globalProperties;
    const currentPercent = ref(0);
    const isTransactionInProgress = ref(false);

    emitter.on('transaction-started', () => {
      isTransactionInProgress.value = true;
      currentPercent.value = 50;
    });

    emitter.on('transaction-finished', () => {
      currentPercent.value = 100;
      isTransactionInProgress.value = false;
    });

    return { currentPercent, isTransactionInProgress };
  },
};
</script>

<style scoped></style>
