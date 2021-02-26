<template>
  <div :style="{ visibility: showTransactionResults ? 'visible' : 'hidden' }">
    <div style="display: block">
      <strong style="display: inline-block">Transaction Settlement Time:&ensp;</strong>
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
    <div
      :style="{ visibility: confirmationSendHash !== null ? 'visible' : 'hidden' }"
      style="display: block"
    >
      <strong style="display: inline-block">Link to sent confirmation block&ensp;</strong>
      <a
        style="display: inline-block"
        :href="`https://nanocrawler.cc/explorer/block/${confirmationSendHash}`"
        target="_blank"
        >on NanoCrawler</a
      >
    </div>
    <div
      :style="{
        visibility:
          confirmationSendHash !== null && confirmationReceiveHash !== null
            ? 'visible'
            : 'hidden',
      }"
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
</template>

<script>
export default {
  name: 'NanoTransactionResults',
  props: {
    showTransactionResults: Boolean,
    transactionTime: String,
    confirmationSendHash: String,
    confirmationReceiveHash: String,
  },
  setup() {
    console.log('NanoTransactionResults component setup');
  },
};
</script>

<style lang="scss" scoped></style>
