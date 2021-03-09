<template>
  <div
    class="demo"
    :class="{
      'demo-phone': $mq === 'phone',
      'demo-tablet': $mq === 'tablet',
      'demo-other': $mq === 'other',
    }"
  >
    <el-card shadow="always" :body-style="{ width: '80%', margin: '0px auto 10px auto' }">
      <div class="card-content">
        <h3 class="card-title">Transaction Results</h3>
        <div class="no-transaction-placeholder" v-show="!didInitiateFirstTransaction">
          Send Nano between the two wallets to start a transaction!
        </div>
        <div v-show="showTransactionResults">
          <div style="display: block">
            <strong style="display: inline-block">Transaction Time:&ensp;</strong>
            <div style="display: inline-block">{{ transactionTime }}</div>
          </div>
          <div style="display: block">
            <strong style="display: inline-block">Transaction Fees:&ensp;</strong>
            <div style="display: inline-block">None</div>
          </div>
          <div style="display: block">
            <strong style="display: inline-block">Energy Consumption:&ensp;</strong>
            <div style="display: inline-block">~ 0.000112 kWh</div>
          </div>
          <div v-show="confirmationSendHash !== null" style="display: block">
            <strong style="display: inline-block"
              >Link to sent confirmation block&ensp;</strong
            >
            <a
              style="display: inline-block"
              :href="`https://nanocrawler.cc/explorer/block/${confirmationSendHash}`"
              target="_blank"
              >on NanoCrawler</a
            >
          </div>
          <div
            v-show="confirmationSendHash !== null && confirmationReceiveHash !== null"
            style="display: block"
          >
            <strong style="display: inline-block"
              >Link to received confirmation block&ensp;</strong
            >
            <a
              style="display: inline-block"
              :href="`https://nanocrawler.cc/explorer/block/${confirmationReceiveHash}`"
              target="_blank"
              >on NanoCrawler</a
            >
          </div>
        </div>
        <i v-show="transactionInProgress" class="el-icon-loading loading"></i>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'NanoTransactionResults',
  props: {
    didInitiateFirstTransaction: Boolean,
    transactionInProgress: Boolean,
    showTransactionResults: Boolean,
    transactionTime: String,
    confirmationSendHash: String,
    confirmationReceiveHash: String,
  },
};
</script>

<style lang="css" scoped>
.demo {
  margin: 20px auto;
  margin-left: auto;
  margin-right: auto;
}

.demo-phone {
  max-width: 95%;
}

.demo-tablet {
  min-width: 300px;
  max-width: 60%;
}

.demo-other {
  max-width: 50%;
}

.card-content {
  min-height: 150px;
}

.card-title {
  margin: 0 auto 20px auto;
  padding: 0;
  text-decoration: underline;
}

.no-transaction-placeholder {
  color: #aaaaaa;
}

.loading {
  margin: 20px auto;
}
</style>
