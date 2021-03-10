<template>
  <div
    class="faucet-info"
    :class="{
      'faucet-card-width-phone': $mq === 'phone',
      'faucet-card-width-tablet': $mq === 'tablet',
      'faucet-card-width-other': $mq === 'other',
    }"
  >
    <div class="faucet-button">
      <el-button
        type="success"
        :size="buttonSize"
        round
        class="faucet-button"
        :loading="nanoFaucetPending || (nanoFaucetCompleted && !nanoRecieved)"
        :disabled="nanoFaucetPending || nanoFaucetCompleted || nanoRecieved"
        :class="{
          'faucet-button-phone': $mq === 'phone',
          'faucet-button-tablet': $mq === 'tablet',
          'faucet-button-other': $mq === 'other',
        }"
        @click="onFaucetButtonClicked"
        ><div class="faucet-button-content">
          <div v-show="!nanoFaucetPending && !nanoFaucetCompleted && !nanoRecieved">
            <span class="faucet-text">Use our TryNano Faucet </span
            ><span class="faucet-emoji">🚰</span>
          </div>
          <div v-show="nanoFaucetPending && !nanoFaucetCompleted && !nanoRecieved">
            <span class="faucet-text">Requesting Nano from Faucet... </span>
          </div>
          <div v-show="!nanoFaucetPending && nanoFaucetCompleted && !nanoRecieved">
            <span class="faucet-text"
              >Faucet Nano sent! Receiving pending Nano from Faucet...
            </span>
          </div>
          <div v-show="!nanoFaucetPending && nanoFaucetCompleted && nanoRecieved">
            <span class="faucet-text">Faucet Nano Received!</span>
          </div>
        </div>
      </el-button>
    </div>
    <el-divider content-position="center"><div>OR</div></el-divider>
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
          class="overflow"
          :class="{ pointer: hoverOnCopyAddress }"
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
    <div v-show="walletBalance > 0">
      <div style="display: block">
        <strong style="display: inline-block">Balance:&ensp;</strong>
        <div class="overflow" style="display: inline-block">{{ walletBalance }} Ñ</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, getCurrentInstance, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import recaptcha from '../util/recaptcha';
import serverAPI from '../util/server_api';

export default {
  name: 'NanoFaucetInfo',
  props: {
    firstWalletData: Object,
    recaptchaLoaded: Function,
    executeRecaptcha: Function,
  },
  computed: {
    buttonSize() {
      switch (this.$mq) {
        case 'phone':
          return 'small';
        case 'tablet':
          return 'medium';
        case 'other':
          return 'default';
        default:
          return 'default';
      }
    },
  },
  setup(props) {
    const { emitter } = getCurrentInstance().appContext.config.globalProperties;
    const { getRecaptchaToken } = recaptcha();
    const { getNanoFromFaucet } = serverAPI();

    onMounted(() => {
      const dividerTextElements = document.getElementsByClassName('el-divider__text');
      if (dividerTextElements) {
        // eslint-disable-next-line no-restricted-syntax
        for (const dividerTextElement of dividerTextElements)
          dividerTextElement.style.background = '#f4fafe';
      }
    });

    const nanoRecieved = ref(false);
    const depositStatus = ref('Not Received');
    const hoverOnCopyAddress = ref(false);
    const copyPrompt = ref('Copy Address');
    const walletBalance = ref(0);
    const walletAccount = computed(() => props.firstWalletData);

    const nanoFaucetPending = ref(false);
    const nanoFaucetCompleted = ref(false);

    const onFaucetButtonClicked = async () => {
      nanoFaucetPending.value = true;

      // Generate recaptcha token
      const token = await getRecaptchaToken(
        props.recaptchaLoaded,
        props.executeRecaptcha,
        'getNanoFromFaucet'
      );

      const res = await getNanoFromFaucet(
        token,
        props.firstWalletData.address,
        props.firstWalletData.privateKey
      );
      nanoFaucetPending.value = false;
      if (res.error) {
        ElMessage({
          message: res.error,
          type: 'error',
        });
      }
      nanoFaucetCompleted.value = true;
    };

    emitter.on('nano-received', (receiveData) => {
      if (receiveData.address === walletAccount.value.address) {
        if (!nanoRecieved.value && receiveData.balance > 0) {
          depositStatus.value = 'Received!';
          nanoRecieved.value = true;
          walletBalance.value = receiveData.balance;
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
      walletBalance,
      walletAccount,
      onFaucetButtonClicked,
      nanoFaucetPending,
      nanoFaucetCompleted,
    };
  },
};
</script>

<style>
.faucet-info {
  margin: 20px auto 50px auto;
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

.faucet-button {
  margin-bottom: 30px;
}

.faucet-button-phone {
  width: auto;
}

.faucet-button-tablet {
  width: 75%;
}

.faucet-button-other {
  width: 70%;
}

.faucet-button-content {
  font-weight: bold;
  display: inline-block;
  white-space: normal;
  font-size: 1.05em;
}

span.faucet-text {
  font-size: 1.15em;
}

span.faucet-emoji {
  font-size: 30px;
  vertical-align: middle;
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

.overflow {
  overflow-wrap: break-word;
  max-width: 100%;
}
</style>
