<template>
  <div class="demo">
    <p>
      Try sending some nano back and forth between these two wallets to get a feel for
      just how quick and easy it is to use Nano!
    </p>
    <el-row type="flex" class="row-bg" justify="center" align="middle">
      <el-col :span="4">
        <NanoWallet
          class="wallet"
          walletLetter="A"
          :walletAddress="firstWalletAccount.address"
          :walletBalance="firstWalletAccount.balance"
        ></NanoWallet>
        <el-button
          type="primary"
          class="nanoButton"
          plain
          @click="sendNano('B')"
          :loading="sendingNanoA || waitingForReceiveNanoA"
          :disabled="disableNanoA"
          ><div
            v-show="
              !waitingForReceiveNanoA &&
              (isInitialNanoA ||
                lastWalletClicked === 'B' ||
                (!disableNanoA && !sendingNanoA))
            "
          >
            Send to Wallet B <span class="arrow">→</span>
          </div>
          <div v-show="disableNanoA && sendingNanoA">Sending...</div>
          <div
            v-show="
              !isInitialNanoA &&
              lastWalletClicked !== 'B' &&
              disableNanoA &&
              !sendingNanoA
            "
          >
            Sent!
          </div>
          <div v-show="waitingForReceiveNanoA">
            Confirming Received Nano...
          </div></el-button
        >
      </el-col>
      <el-col :span="16" class="progress-bar">
        <NanoTransactionStatusBar :status="transactionStatus"></NanoTransactionStatusBar>
      </el-col>
      <el-col :span="4">
        <NanoWallet
          class="wallet"
          walletLetter="B"
          :walletAddress="secondWalletAccount.address"
          :walletBalance="secondWalletAccount.balance"
        ></NanoWallet>
        <el-button
          type="primary"
          class="nanoButton"
          plain
          @click="sendNano('A')"
          :loading="sendingNanoB"
          :disabled="disableNanoB"
          ><div
            v-show="
              !waitingForReceiveNanoB &&
              (isInitialNanoB ||
                lastWalletClicked === 'A' ||
                (!disableNanoB && !sendingNanoB))
            "
          >
            <span class="arrow">←</span> Send to Wallet A
          </div>
          <div v-show="disableNanoB && sendingNanoB">Sending...</div>
          <div
            v-show="
              !isInitialNanoB &&
              lastWalletClicked !== 'A' &&
              disableNanoB &&
              !sendingNanoB
            "
          >
            Sent!
          </div>
          <div v-show="waitingForReceiveNanoB">
            Confirming Received Nano...
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
import { ElMessage } from 'element-plus';
import NanoWallet from './NanoWallet.vue';
import NanoTransactionResults from './NanoTransactionResults.vue';
import NanoTransactionStatusBar from './NanoTransactionStatusBar.vue';

export default {
  name: 'NanoDemo',
  components: {
    NanoWallet,
    NanoTransactionResults,
    NanoTransactionStatusBar,
  },
  emits: ['revealClaimNanoClicked'],
  props: {
    firstWallet: Object,
    secondWallet: Object,
  },
  setup(props, context) {
    console.log('NanoDemo component setup');
    const {
      emitter,
      nanoClient,
    } = getCurrentInstance().appContext.config.globalProperties;
    const firstWalletAccount = computed(() => props.firstWallet.accounts[0]);
    const secondWalletAccount = computed(() => props.secondWallet.accounts[0]);
    const isInitialNanoA = ref(true);
    const isInitialNanoB = ref(true);
    const lastWalletClicked = ref('');
    const sendingNanoA = ref(false);
    const sendingNanoB = ref(false);
    const waitingForReceiveNanoA = ref(false);
    const waitingForReceiveNanoB = ref(false);

    const showTransactionResults = ref(false);
    const transactionStartTimeMs = ref(0);
    const transactionTime = ref('N/A');
    const confirmationSendHash = ref(null);
    const confirmationReceiveHash = ref(null);
    const hasCompletedAtLeastOneTransaction = ref(false);

    const transactionStatus = ref(null);

    const disableNanoA = computed(() => {
      return firstWalletAccount.value.balance.raw === '0' || sendingNanoA.value;
    });
    const disableNanoB = computed(() => {
      return secondWalletAccount.value.balance.raw === '0' || sendingNanoB.value;
    });

    const sendNano = (receivingWalletLetter) => {
      emitter.emit('transaction-started');
      transactionStartTimeMs.value = Date.now();
      showTransactionResults.value = false;
      confirmationSendHash.value = null;
      confirmationReceiveHash.value = null;
      transactionStatus.value = null;
      if (receivingWalletLetter === 'B') {
        // send from Wallet A to Wallet B
        isInitialNanoA.value = false;
        sendingNanoA.value = true;
        lastWalletClicked.value = 'A';
        nanoClient
          .send(
            firstWalletAccount.value,
            secondWalletAccount.value.address,
            firstWalletAccount.value.balance
          )
          .then((accountAfterSend) => {
            if (accountAfterSend.error && accountAfterSend.error != null) {
              console.log(`error sending nano from wallet A, ${accountAfterSend.error}`);
              transactionStatus.value = 'exception';
              sendingNanoA.value = false;
              ElMessage({
                message: 'Error sending Nano from Wallet A to Wallet B',
                type: 'error',
              });
              return;
            }
            console.log(accountAfterSend);
          });
      } else if (receivingWalletLetter === 'A') {
        // send from Wallet B to Wallet A
        isInitialNanoB.value = false;
        sendingNanoB.value = true;
        lastWalletClicked.value = 'B';
        nanoClient
          .send(
            secondWalletAccount.value,
            firstWalletAccount.value.address,
            secondWalletAccount.value.balance
          )
          .then((accountAfterSend) => {
            if (accountAfterSend.error && accountAfterSend.error != null) {
              console.log(`error sending nano from wallet B, ${accountAfterSend.error}`);
              transactionStatus.value = 'exception';
              sendingNanoB.value = false;
              ElMessage({
                message: 'Error sending Nano from Wallet B to Wallet A',
                type: 'error',
              });
              return;
            }
            console.log(accountAfterSend);
          });
      }
    };

    emitter.on('nano-sent', (sendData) => {
      let wasSent;
      transactionTime.value = `${(
        (sendData.timestamp - transactionStartTimeMs.value) /
        1000.0
      ).toString()} seconds`;
      console.log(`settlement time: ${transactionTime.value}`);
      if (sendData.address === firstWalletAccount.value.address) {
        console.log('#matched wallet A send');
        sendingNanoA.value = false;
        waitingForReceiveNanoB.value = true;
        wasSent = true;
      } else if (sendData.address === secondWalletAccount.value.address) {
        console.log('#matched wallet B send');
        sendingNanoB.value = false;
        waitingForReceiveNanoA.value = true;
        wasSent = true;
      } else {
        console.log(
          "error, address from nano-sent emit doesn't match any wallet address"
        );
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
      console.log('emitter on nano-received in NanoDemo');
      console.log(receiveData);
      let wasReceived;
      if (receiveData.address === firstWalletAccount.value.address) {
        waitingForReceiveNanoA.value = false;
        wasReceived = true;
      } else if (receiveData.address === secondWalletAccount.value.address) {
        waitingForReceiveNanoB.value = false;
        wasReceived = true;
        if (!hasCompletedAtLeastOneTransaction.value) {
          hasCompletedAtLeastOneTransaction.value = true;
          emitter.emit('step-completed', 'second');
        }
      } else {
        console.log(
          "error, address from nano-received emit doesn't match any wallet address"
        );
        wasReceived = false;
      }
      if (wasReceived) {
        confirmationReceiveHash.value = receiveData.hash;
      }
    });

    const handleClaimNanoClicked = () => {
      context.emit('revealClaimNanoClicked');
    };

    return {
      firstWalletAccount,
      secondWalletAccount,
      isInitialNanoA,
      isInitialNanoB,
      sendingNanoA,
      sendingNanoB,
      disableNanoA,
      disableNanoB,
      waitingForReceiveNanoA,
      waitingForReceiveNanoB,
      lastWalletClicked,
      sendNano,
      showTransactionResults,
      transactionTime,
      confirmationSendHash,
      confirmationReceiveHash,
      handleClaimNanoClicked,
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
  background-color: #f9fafc;
  width: 95%;
}

.nanoButton {
  margin-top: 5px;
  font-weight: bold;
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
