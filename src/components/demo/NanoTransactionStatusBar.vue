<template>
  <el-progress
    :width="1000"
    :percentage="currentPercent"
    :status="status"
    :show-text="didStartTransaction"
    :text-inside="$mq === 'phone'"
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
  setup(props) {
    const { emitter } = getCurrentInstance().appContext.config.globalProperties;
    const currentPercent = ref(0);
    const didStartTransaction = ref(false);

    emitter.on('transaction-started', () => {
      didStartTransaction.value = true;
      currentPercent.value = 0;
      const interval = setInterval(() => {
        if (currentPercent.value < 99) {
          currentPercent.value += 1;
        }
        if (props.status !== null) {
          clearInterval(interval);
        }
      }, 100);
    });

    emitter.on('transaction-finished', () => {
      currentPercent.value = 100;
    });

    return { didStartTransaction, currentPercent };
  },
};
</script>

<style scoped></style>
