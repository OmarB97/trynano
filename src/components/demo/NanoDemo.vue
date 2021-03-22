<template>
  <div class="demo">
    <p>
      {{ t('demo.nanoDemo.firstSentence') }}
    </p>
    <el-row type="flex" class="row-bg" justify="center" align="middle">
      <el-col :span="walletSpan">
        <NanoWallet
          class="wallet"
          :walletLetter="t('demo.nanoDemo.firstWalletLetter')"
          :walletAddress="firstWallet.address"
          :walletBalance="firstWallet.balance"
        ></NanoWallet>
        <el-button
          type="primary"
          :size="buttonSize"
          plain
          @click="sendNanoClicked(t('demo.nanoDemo.secondWalletLetter'))"
          :loading="sendingNanoA || waitingForReceiveNanoA"
          :disabled="disableNanoA"
          ><div
            class="nano-button"
            v-show="
              !waitingForReceiveNanoA &&
              (isInitialNanoA ||
                lastWalletClicked === t('demo.nanoDemo.secondWalletLetter') ||
                (!disableNanoA && !sendingNanoA))
            "
          >
            {{
              t('demo.nanoDemo.sendToWallet', {
                walletLetter: t('demo.nanoDemo.secondWalletLetter'),
              })
            }}
            <span class="arrow"> →</span>
          </div>
          <div class="nano-button" v-show="disableNanoA && sendingNanoA">
            {{ t('demo.nanoDemo.sending') }}
          </div>
          <div
            v-show="
              !isInitialNanoA &&
              lastWalletClicked !== t('demo.nanoDemo.secondWalletLetter') &&
              disableNanoA &&
              !sendingNanoA
            "
          >
            {{ t('demo.nanoDemo.sent') }}
          </div>
          <div class="nano-button" v-show="waitingForReceiveNanoA">
            {{ t('demo.nanoDemo.confirmingReceivedNano') }}
          </div></el-button
        >
      </el-col>
      <el-col :span="barSpan">
        <NanoTransactionStatusBar :status="transactionStatus"></NanoTransactionStatusBar>
      </el-col>
      <el-col :span="walletSpan">
        <NanoWallet
          class="wallet"
          :walletLetter="t('demo.nanoDemo.secondWalletLetter')"
          :walletAddress="secondWallet.address"
          :walletBalance="secondWallet.balance"
        ></NanoWallet>
        <el-button
          type="primary"
          plain
          :size="buttonSize"
          @click="sendNanoClicked(t('demo.nanoDemo.firstWalletLetter'))"
          :loading="sendingNanoB || waitingForReceiveNanoB"
          :disabled="disableNanoB"
          ><div
            class="nano-button"
            v-show="
              !waitingForReceiveNanoB &&
              (isInitialNanoB ||
                lastWalletClicked === t('demo.nanoDemo.firstWalletLetter') ||
                (!disableNanoB && !sendingNanoB))
            "
          >
            <span class="arrow">← </span>
            {{
              t('demo.nanoDemo.sendToWallet', {
                walletLetter: t('demo.nanoDemo.firstWalletLetter'),
              })
            }}
          </div>
          <div class="nano-button" v-show="disableNanoB && sendingNanoB">
            {{ t('demo.nanoDemo.sending') }}
          </div>
          <div
            v-show="
              !isInitialNanoB &&
              lastWalletClicked !== t('demo.nanoDemo.firstWalletLetter') &&
              disableNanoB &&
              !sendingNanoB
            "
          >
            {{ t('demo.nanoDemo.sent') }}
          </div>
          <div class="nano-button" v-show="waitingForReceiveNanoB">
            {{ t('demo.nanoDemo.confirmingReceivedNano') }}
          </div></el-button
        >
      </el-col>
    </el-row>
    <NanoTransactionResults
      class="results"
      :didInitiateFirstTransaction="lastWalletClicked !== ''"
      :transactionInProgress="
        sendingNanoA || sendingNanoB || waitingForReceiveNanoA || waitingForReceiveNanoB
      "
      :showTransactionResults="showTransactionResults"
      :transactionTime="transactionTime"
      :confirmationSendHash="confirmationSendHash"
      :confirmationReceiveHash="confirmationReceiveHash"
    ></NanoTransactionResults>
  </div>
</template>

<script>
import { computed, ref, getCurrentInstance } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import NanoWallet from './NanoWallet.vue';
import NanoTransactionResults from './NanoTransactionResults.vue';
import NanoTransactionStatusBar from './NanoTransactionStatusBar.vue';
import recaptcha from '../../util/recaptcha';
import serverAPI from '../../util/server_api';

export default {
  name: 'NanoDemo',
  components: {
    NanoWallet,
    NanoTransactionResults,
    NanoTransactionStatusBar,
  },
  props: {
    firstWallet: Object,
    secondWallet: Object,
    recaptchaLoaded: Function,
    executeRecaptcha: Function,
  },
  computed: {
    buttonSize() {
      switch (this.$mq) {
        case 'phone':
          return 'mini';
        case 'tablet':
          return 'medium';
        case 'other':
          return 'default';
        default:
          return 'default';
      }
    },
    walletSpan() {
      switch (this.$mq) {
        case 'phone':
          return 8;
        case 'tablet':
          return 6;
        case 'other':
          return 4;
        default:
          return 4;
      }
    },
    barSpan() {
      switch (this.$mq) {
        case 'phone':
          return 8;
        case 'tablet':
          return 12;
        case 'other':
          return 16;
        default:
          return 16;
      }
    },
  },
  setup(props) {
    const { t } = useI18n({ useScope: 'global' });
    const { emitter } = getCurrentInstance().appContext.config.globalProperties;

    const { getRecaptchaToken } = recaptcha();
    const { sendNano } = serverAPI();
    const isInitialNanoA = ref(true);
    const isInitialNanoB = ref(true);
    const lastWalletClicked = ref('');
    const sendingNanoA = ref(false);
    const sendingNanoB = ref(false);
    const waitingForReceiveNanoA = ref(false);
    const waitingForReceiveNanoB = ref(false);

    const showTransactionResults = ref(false);
    const transactionStartTimeMs = ref(0);
    const transactionEndTimeMs = ref(0);
    const confirmationSendHash = ref(null);
    const confirmationReceiveHash = ref(null);
    const hasCompletedAtLeastOneTransaction = ref(false);

    const transactionTime = computed(() => {
      if (
        !transactionStartTimeMs.value ||
        transactionStartTimeMs.value === 0 ||
        !transactionEndTimeMs.value ||
        transactionEndTimeMs.value === 0
      ) {
        return t('demo.nanoDemo.transactionTime.default');
      }

      const res = t('demo.nanoDemo.transactionTime.time', {
        time: Math.abs(
          (transactionEndTimeMs.value - transactionStartTimeMs.value) / 1000.0
        ).toString(),
      });
      return res;
    });

    const transactionStatus = ref(null);

    const disableNanoA = computed(() => {
      return props.firstWallet.balance.raw === '0' || sendingNanoA.value;
    });
    const disableNanoB = computed(() => {
      return props.secondWallet.balance.raw === '0' || sendingNanoB.value;
    });

    const sendNanoClicked = async (receivingWalletLetter) => {
      emitter.emit('transaction-started');
      showTransactionResults.value = false;
      confirmationSendHash.value = null;
      confirmationReceiveHash.value = null;
      transactionStatus.value = null;

      // Generate recaptcha token
      const token = await getRecaptchaToken(
        props.recaptchaLoaded,
        props.executeRecaptcha,
        'sendNano'
      );

      transactionStartTimeMs.value = Date.now();
      if (receivingWalletLetter === t('demo.nanoDemo.secondWalletLetter')) {
        // send from Wallet A to Wallet B
        isInitialNanoA.value = false;
        sendingNanoA.value = true;
        lastWalletClicked.value = t('demo.nanoDemo.firstWalletLetter');

        const res = await sendNano(
          token,
          props.firstWallet.address,
          props.firstWallet.privateKey,
          props.secondWallet.address
        );

        if (res.error) {
          transactionStatus.value = 'exception';
          sendingNanoA.value = false;
          ElMessage({
            message: res.error,
            type: 'error',
          });
        }
      } else if (receivingWalletLetter === t('demo.nanoDemo.firstWalletLetter')) {
        // send from Wallet B to Wallet A
        isInitialNanoB.value = false;
        sendingNanoB.value = true;
        lastWalletClicked.value = t('demo.nanoDemo.secondWalletLetter');

        const res = await sendNano(
          token,
          props.secondWallet.address,
          props.secondWallet.privateKey,
          props.firstWallet.address
        );

        if (res.error) {
          transactionStatus.value = 'exception';
          sendingNanoB.value = false;
          ElMessage({
            message: res.error,
            type: 'error',
          });
        }
      }
    };

    emitter.on('internal-nano-send', (sendData) => {
      let wasSent;
      transactionEndTimeMs.value = sendData.timestamp;
      if (sendData.address === props.firstWallet.address) {
        sendingNanoA.value = false;
        waitingForReceiveNanoB.value = true;
        wasSent = true;
      } else if (sendData.address === props.secondWallet.address) {
        sendingNanoB.value = false;
        waitingForReceiveNanoA.value = true;
        wasSent = true;
      } else {
        wasSent = false;
      }
      if (wasSent) {
        emitter.emit('transaction-finished');
        confirmationSendHash.value = sendData.hash;
        showTransactionResults.value = true;
        transactionStatus.value = 'success';
      }
    });

    emitter.on('nano-received', (receiveData) => {
      let wasReceived;
      if (receiveData.address === props.firstWallet.address) {
        waitingForReceiveNanoA.value = false;
        wasReceived = true;
      } else if (receiveData.address === props.secondWallet.address) {
        waitingForReceiveNanoB.value = false;
        wasReceived = true;
        if (!hasCompletedAtLeastOneTransaction.value) {
          hasCompletedAtLeastOneTransaction.value = true;
          emitter.emit('step-completed', 'second');
        }
      } else {
        wasReceived = false;
      }
      if (wasReceived) {
        confirmationReceiveHash.value = receiveData.hash;
      }
    });

    return {
      t,
      isInitialNanoA,
      isInitialNanoB,
      sendingNanoA,
      sendingNanoB,
      disableNanoA,
      disableNanoB,
      waitingForReceiveNanoA,
      waitingForReceiveNanoB,
      lastWalletClicked,
      sendNanoClicked,
      showTransactionResults,
      transactionTime,
      confirmationSendHash,
      confirmationReceiveHash,
      transactionStatus,
    };
  },
};
</script>

<style>
.demo {
  margin-bottom: 30px;
}

.row-bg {
  margin: auto;
  padding: 1%;
  width: 95%;
}

.nano-buttons {
  width: 100%;
  display: flex;
  margin: 5px auto;
  justify-content: space-between;
}

.nano-button {
  font-weight: bold;
  display: inline-block;
  white-space: normal;
}

.arrow {
  font-size: 18px;
}

.results {
  margin: 10px auto 50px auto;
}

.fade-out-down-leave-active {
  transition: all 0.4s ease-out;
}

.fade-out-down-leave-to {
  transform: translatey(20px);
  opacity: 0;
}
</style>
