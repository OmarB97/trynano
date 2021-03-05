<template>
  <div
    class="faucet-info"
    :class="{
      'faucet-card-width-phone': $mq === 'phone',
      'faucet-card-width-tablet': $mq === 'tablet',
      'faucet-card-width-other': $mq === 'other',
    }"
  >
    <p class="maintext">
      Go to
      <a href="https://www.nano-faucet.org" target="_blank">nano-faucet.org</a> and paste
      the generated wallet address below.
    </p>
    <p class="subtext">
      (<u>Note</u>: If you've received a tip from someone using NanoTipBot and would like
      to use that instead, use the !withdraw command outlined
      <a href="https://nanotipbot.com/" target="_blank">here</a>.)
    </p>
    <div>
      <el-popover
        class="popover"
        :placement="$mq === 'other' ? 'left' : 'top'"
        :width="350"
        trigger="click"
      >
        <template #reference>
          <i class="el-icon-question wallet-tooltip pointer"></i>
        </template>
        <div style="word-break: keep-all">
          A <strong><u>wallet address</u></strong> is a unique identifier that serves as a
          virtual location where cryptocurrency can be sent/received, similar to having an
          email address!
        </div>
      </el-popover>
      <el-tooltip
        effect="dark"
        :content="copyPrompt"
        :placement="$mq === 'other' ? 'right' : 'bottom-end'"
        :offset="15"
      >
        <div
          style="display: inline-block; margin: 16px 0px"
          @mouseenter="copyPrompt = 'Copy Address'"
          @mouseover="hoverOnCopyAddress = true"
          @mouseleave="hoverOnCopyAddress = false"
          :class="{ pointer: hoverOnCopyAddress, 'wallet-info-smaller': $mq !== 'other' }"
          v-clipboard:copy="walletAccount.address"
          v-clipboard:success="onAddressCopySuccess"
        >
          <b>Generated wallet address</b>:
          <span>{{ walletAccount.address }}</span>
          <img class="logo" src="../assets/copy.png" />
        </div>
      </el-tooltip>
    </div>

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
</template>

<script>
import { ref, computed, getCurrentInstance } from 'vue';

export default {
  name: 'NanoFaucetInfo',
  props: {
    firstWalletData: Object,
  },
  setup(props) {
    const { emitter } = getCurrentInstance().appContext.config.globalProperties;

    const nanoRecieved = ref(false);
    const depositStatus = ref('Not Received');
    const hoverOnCopyAddress = ref(false);
    const copyPrompt = ref('Copy Address');
    const receivedAmount = ref(0);
    const walletAccount = computed(() => props.firstWalletData.accounts[0]);

    emitter.on('nano-received', (receiveData) => {
      if (receiveData.address === walletAccount.value.address) {
        if (!nanoRecieved.value && receiveData.balance > 0) {
          depositStatus.value = 'Received!';
          nanoRecieved.value = true;
          receivedAmount.value = receiveData.amount;
          emitter.emit('step-completed', 'first');
        }
      }
    });

    const onAddressCopySuccess = () => {
      copyPrompt.value = 'Copied!';
    };

    return {
      nanoRecieved,
      depositStatus,
      hoverOnCopyAddress,
      onAddressCopySuccess,
      copyPrompt,
      receivedAmount,
      walletAccount,
    };
  },
};
</script>

<style>
.faucet-info {
  margin-bottom: 50px;
  margin-left: auto;
  margin-right: auto;
}

.faucet-card-width-phone {
  width: 100%;
}

.faucet-card-width-tablet {
  width: 100%;
}

.faucet-card-width-other {
  width: 80%;
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
  font-weight: 700;
}

.subtext {
  padding: 0;
  margin-top: 25px;
  margin-bottom: 30px;
  font-size: 14px;
  font-weight: lighter;
}

.wallet-tooltip {
  margin: auto 5px auto 0;
}

.wallet-info-smaller {
  overflow-wrap: break-word;
  max-width: 100%;
}
</style>
