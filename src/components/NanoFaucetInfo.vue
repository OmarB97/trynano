<template>
  <div class="faucet-info">
    <p>
      First, you'll need to head over to
      <a href="https://nano-faucet.org/">https://nano-faucet.org/</a> and grab yourself a
      little bit of nano.
    </p>
    <p>
      We've gone ahead and generated a brand new nano wallet for you to use. Click the
      wallet address below to automatically copy it to your clipboard and then paste it
      into the nano faucet input field to recieve a small amount of nano. Once the nano
      has been received, the status below will be updated.
    </p>
    <p>
      <b>Newly generated wallet address</b>: {{ firstWalletData.address }}
      <img class="logo" src="../assets/copy.png" />
    </p>
    <strong style="display: inline-block">
      <div style="display: inline-block">Status:&ensp;</div>
      <div
        style="display: inline-block"
        :class="{ waiting: !nanoRecieved, received: nanoRecieved }"
      >
        {{ depositStatus }}
      </div>
    </strong>
  </div>
  <ClickToReveal
    :revealText="'Proceed to Demo'"
    :clickable="nanoRecieved"
    :shouldBoldText="true"
    :sizeFactor="0.95"
    @revealClicked="$emit('revealDemoClicked')"
  ></ClickToReveal>
</template>

<script>
import { ref, watch } from 'vue';
import ClickToReveal from './common/ClickToReveal.vue';

export default {
  name: 'NanoFaucetInfo',
  components: { ClickToReveal },
  emits: ['revealDemoClicked'],
  props: {
    firstWalletData: Object,
  },
  setup(props) {
    const nanoRecieved = ref(false);
    const depositStatus = ref('Not Received');

    watch(props.firstWalletData.amount, (currAmount) => {
      if (currAmount > 0) {
        depositStatus.value = 'Recieved!';
      }
    });

    return { nanoRecieved, depositStatus };
  },
};
</script>

<style lang="css" scoped>
.faucet-info {
  margin-bottom: 50px;
}

.waiting {
  color: red;
}

.received {
  color: green;
}

.logo {
  height: auto;
  width: auto;
  max-width: 17px;
  max-height: 17px;
  margin-left: 4px;
}
</style>
