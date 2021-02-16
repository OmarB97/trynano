<template>
  <div>Transaction Time: {{ transactionTime }}</div>
  <div>Transaction Fees: None</div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'NanoTransactionResults',
  setup() {
    console.log('NanoTransactionResults component setup');
    const transactionTime = ref(null);
    return { transactionTime };
  },
};
</script>

<style lang="scss" scoped></style>
