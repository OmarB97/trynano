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
        <h3 class="card-title">{{ t('demo.nanoTransactionResults.title') }}</h3>
        <div class="no-transaction-placeholder" v-show="!didInitiateFirstTransaction">
          {{ t('demo.nanoTransactionResults.placeholder') }}
        </div>
        <div v-show="showTransactionResults">
          <div style="display: block">
            <strong style="display: inline-block"
              >{{ t('demo.nanoTransactionResults.transactionTime.label') }}&ensp;</strong
            >
            <div style="display: inline-block">
              {{
                t('demo.nanoTransactionResults.transactionTime.time', { transactionTime })
              }}
            </div>
          </div>
          <div style="display: block">
            <strong style="display: inline-block"
              >{{ t('demo.nanoTransactionResults.transactionFees.label') }}&ensp;</strong
            >
            <div style="display: inline-block">
              {{ t('demo.nanoTransactionResults.transactionFees.fees') }}
            </div>
          </div>
          <div style="display: block">
            <strong style="display: inline-block"
              >{{
                t('demo.nanoTransactionResults.energyConsumption.label')
              }}&ensp;</strong
            >
            <div style="display: inline-block">
              {{ t('demo.nanoTransactionResults.energyConsumption.usage') }}
            </div>
          </div>
          <div v-show="confirmationSendHash !== null" style="display: block">
            <strong style="display: inline-block"
              >{{ t('demo.nanoTransactionResults.sendConfirmationBlock') }}&ensp;</strong
            >
            <a
              style="display: inline-block"
              :href="`https://nanocrawler.cc/explorer/block/${confirmationSendHash}`"
              target="_blank"
              >{{ t('demo.nanoTransactionResults.nanoCrawlerLink') }}</a
            >
          </div>
          <div
            v-show="confirmationSendHash !== null && confirmationReceiveHash !== null"
            style="display: block"
          >
            <strong style="display: inline-block"
              >{{
                t('demo.nanoTransactionResults.receiveConfirmationBlock')
              }}&ensp;</strong
            >
            <a
              style="display: inline-block"
              :href="`https://nanocrawler.cc/explorer/block/${confirmationReceiveHash}`"
              target="_blank"
              >{{ t('demo.nanoTransactionResults.nanoCrawlerLink') }}</a
            >
          </div>
        </div>
        <i v-show="transactionInProgress" class="el-icon-loading loading"></i>
      </div>
    </el-card>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

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
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    return { t };
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
