<template>
  <el-progress
    width="1000"
    percentage="0"
    :format="format"
    :status="status"
    :show-text="didStartTransaction"
  ></el-progress>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'NanoTransactionStatusBar',
  setup() {
    const didStartTransaction = ref(false);
    const status = ref(null);

    console.log('NanoTransactionStatusBar component setup');
    const format = (percentage) => (percentage === 100 ? 'Success!' : `${percentage}%`);

    return { didStartTransaction, format, status };
  },
};
</script>

<style scoped></style>
