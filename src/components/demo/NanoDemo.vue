<template>
  <div>Nano Demo</div>
  <el-row type="flex" class="row-bg" justify="center" align="middle">
    <el-col :span="2">
      <NanoWallet walletLetter="A" walletBalance="0"></NanoWallet>
      <NanoSendTransaction></NanoSendTransaction>
    </el-col>
    <el-col :span="20" class="progress-bar">
      <NanoTransactionStatusBar></NanoTransactionStatusBar>
    </el-col>
    <el-col :span="2">
      <NanoWallet walletLetter="B" walletBalance="0"></NanoWallet>
      <NanoSendTransaction></NanoSendTransaction>
    </el-col>
  </el-row>
  <NanoTransactionResults></NanoTransactionResults>
  <NanoTransactionHistory></NanoTransactionHistory>
</template>

<script>
import NanoWallet from './NanoWallet.vue';
import NanoSendTransaction from './NanoSendTransaction.vue';
import NanoTransactionHistory from './NanoTransactionHistory.vue';
import NanoTransactionResults from './NanoTransactionResults.vue';
import NanoTransactionStatusBar from './NanoTransactionStatusBar.vue';

export default {
  name: 'NanoDemo',
  components: {
    NanoWallet,
    NanoSendTransaction,
    NanoTransactionHistory,
    NanoTransactionResults,
    NanoTransactionStatusBar,
  },
  setup() {
    console.log('NanoDemo component setup');
  },
};
</script>

<style scoped>
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

/* .nano-wallet {
  display: block;
  justify-content: center;
} */
</style>
