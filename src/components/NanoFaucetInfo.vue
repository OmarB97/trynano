<template>
  <div class="faucet-info">
    <p class="maintext">
      First, head over to
      <a href="https://www.nano-faucet.org" target="_blank">nano-faucet.org</a> and grab
      yourself some free Nano.
    </p>
    <p>
      In order to recieve Nano, you'll need to provide a wallet address. We've gone ahead
      and generated a brand new Nano wallet for you to use. Click the wallet address below
      to automatically copy it to your clipboard and then paste it into the Nano Faucet
      input field to recieve a small amount of Nano.
    </p>
    <p class="subtext">
      (<u>Note</u>: If you've received a tip from someone using NanoTipBot and would like
      to use that instead, follow the instructions
      <a href="https://nanotipbot.com/" target="_blank">here</a> and use the generated
      wallet address we've provided below.)
    </p>
    <el-tooltip
      effect="dark"
      content="Copied!"
      placement="right"
      :manual="true"
      :offset="15"
      v-model="showCopyTooltip"
    >
      <div
        style="display: inline-block; margin: 16px 0px"
        @mouseover="hoverOnCopyAddress = true"
        @mouseleave="hoverOnCopyAddress = false"
        :class="{ pointer: hoverOnCopyAddress }"
        v-clipboard:copy="walletAccount.address"
        v-clipboard:success="onAddressCopySuccess"
      >
        <b>Generated wallet address</b>:
        <span>{{ walletAccount.address }}</span>
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
    <div v-show="receivedAmount > 0">
      <div style="display: block">
        <strong style="display: inline-block">Amount:&ensp;</strong>
        <div style="display: inline-block">{{ receivedAmount }} Ñ</div>
      </div>
    </div>
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
import { ref, computed, getCurrentInstance } from 'vue';
import ClickToReveal from './common/ClickToReveal.vue';

export default {
  name: 'NanoFaucetInfo',
  components: { ClickToReveal },
  emits: ['revealDemoClicked'],
  props: {
    firstWalletData: Object,
  },
  setup(props, context) {
    const { emitter } = getCurrentInstance().appContext.config.globalProperties;

    const nanoRecieved = ref(false);
    const depositStatus = ref('Not Received');
    const hoverOnCopyAddress = ref(false);
    const showCopyTooltip = ref(false);
    const receivedAmount = ref(0);
    const walletAccount = computed(() => props.firstWalletData.accounts[0]);

    emitter.on('nano-received', (receiveData) => {
      console.log('emitter on nano-received in NanoFaucetInfo');
      console.log(receiveData);
      if (receiveData.address === walletAccount.value.address) {
        if (!nanoRecieved.value && receiveData.balance > 0) {
          depositStatus.value = 'Recieved!';
          nanoRecieved.value = true;
          receivedAmount.value = receiveData.amount;
        }
      }
    });

    const handleRevealDemoClicked = () => {
      context.emit('revealDemoClicked');
    };

    const onAddressCopySuccess = () => {
      showCopyTooltip.value = true;
      setTimeout(() => {
        showCopyTooltip.value = false;
      }, 1500);
      console.log('success');
    };

    return {
      nanoRecieved,
      depositStatus,
      handleRevealDemoClicked,
      hoverOnCopyAddress,
      onAddressCopySuccess,
      showCopyTooltip,
      receivedAmount,
      walletAccount,
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

.maintext {
  padding: 0;
  margin: 0;
}

.subtext {
  padding: 0;
  margin-top: 0;
  margin-bottom: 30px;
  font-size: 14px;
  font-weight: lighter;
}
</style>
