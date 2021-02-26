<template>
  <div>Transaction Time: {{ transactionTime }}</div>
  <div>Transaction Fees: None</div>
  <div>Energy Consumption: 0.000112 kWh</div>
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
