<template>
  <div class="faucet-info">
    <p>
      First, you'll need to head over to
      <a href="https://www.nano-faucet.org" target="_blank">nano-faucet.org</a> and grab
      yourself a little bit of nano.
    </p>
    <p>
      We've gone ahead and generated a brand new nano wallet for you to use. Click the
      wallet address below to automatically copy it to your clipboard and then paste it
      into the nano faucet input field to recieve a small amount of nano. Once the nano
      has been received, the status below will be updated.
    </p>
    <el-tooltip
      effect="light"
      content="Copied!"
      placement="right"
      :manual="true"
      :offset="15"
      v-model="shopyCopyTooltip"
    >
      <div
        style="display: inline-block; margin: 16px 0px"
        @mouseover="hoverOnCopyAddress = true"
        @mouseleave="hoverOnCopyAddress = false"
        :class="{ pointer: hoverOnCopyAddress }"
        v-clipboard:copy="firstWalletData.address"
        v-clipboard:success="onAddressCopySuccess"
      >
        <b>Generated wallet address</b>:
        <span>{{ firstWalletData.address }}</span>
        <img class="logo" src="../assets/copy.png" />
      </div>
    </el-tooltip>
    <strong style="display: block">
      <div style="display: inline-block">Status:&ensp;</div>
      <div
        style="display: inline-block"
        :class="{ waiting: !nanoRecieved, received: nanoRecieved }"
      >
        {{ depositStatus }}
      </div>
    </strong>
  </div>
  <transition name="fade-out-down">
    <ClickToReveal
      :revealText="'Proceed to Demo'"
      :clickable="nanoRecieved"
      :shouldBoldText="true"
      :sizeFactor="0.95"
      @revealClicked="handleRevealDemoClicked"
    ></ClickToReveal>
  </transition>
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
  setup(props, context) {
    const nanoRecieved = ref(false);
    const depositStatus = ref('Not Received');
    const revealDemoClicked = ref(false);
    const hoverOnCopyAddress = ref(false);
    const shopyCopyTooltip = ref(false);

    watch(props.firstWalletData.amount, (currAmount) => {
      if (currAmount > 0) {
        depositStatus.value = 'Recieved!';
      }
    });

    const handleRevealDemoClicked = () => {
      revealDemoClicked.value = true;
      context.emit('revealDemoClicked');
    };

    const onAddressCopySuccess = () => {
      shopyCopyTooltip.value = true;
      setTimeout(() => {
        shopyCopyTooltip.value = false;
      }, 1500);
      console.log('success');
    };

    return {
      nanoRecieved,
      depositStatus,
      revealDemoClicked,
      handleRevealDemoClicked,
      hoverOnCopyAddress,
      onAddressCopySuccess,
      shopyCopyTooltip,
    };
  },
};
</script>

<style lang="css" scoped>
.faucet-info {
  margin-bottom: 50px;
  max-width: 60%;
  margin-left: auto;
  margin-right: auto;
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
  margin-left: 8px;
}

.fade-out-down-leave-active {
  transition: all 0.4s ease-out;
}

.fade-out-down-leave-to {
  transform: translatey(20px);
  opacity: 0;
}

.pointer {
  cursor: pointer;
}
</style>
