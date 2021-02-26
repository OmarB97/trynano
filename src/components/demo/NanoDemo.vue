<template>
  <div>Nano Demo</div>
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
        :loading="sendingNanoA"
        :disabled="disableNanoA"
        ><div
          v-show="
            isInitialNanoA ||
            lastWalletClicked === 'B' ||
            (!disableNanoA && !sendingNanoA)
          "
        >
          Send to Wallet B <span class="arrow">→</span>
        </div>
        <div v-show="disableNanoA && sendingNanoA">Sending...</div>
        <div
          v-show="
            !isInitialNanoA && lastWalletClicked !== 'B' && disableNanoA && !sendingNanoA
          "
        >
          Sent!
        </div></el-button
      >
    </el-col>
    <el-col :span="16" class="progress-bar">
      <NanoTransactionStatusBar></NanoTransactionStatusBar>
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
            isInitialNanoB ||
            lastWalletClicked === 'A' ||
            (!disableNanoB && !sendingNanoB)
          "
        >
          <span class="arrow">←</span> Send to Wallet A
        </div>
        <div v-show="disableNanoB && sendingNanoB">Sending...</div>
        <div
          v-show="
            !isInitialNanoB && lastWalletClicked !== 'A' && disableNanoB && !sendingNanoB
          "
        >
          Sent!
        </div></el-button
      >
    </el-col>
  </el-row>
  <NanoTransactionResults></NanoTransactionResults>
  <NanoTransactionHistory></NanoTransactionHistory>
</template>

<script>
import { computed, ref, getCurrentInstance } from 'vue';
import NanoWallet from './NanoWallet.vue';
import NanoTransactionHistory from './NanoTransactionHistory.vue';
import NanoTransactionResults from './NanoTransactionResults.vue';
import NanoTransactionStatusBar from './NanoTransactionStatusBar.vue';

export default {
  name: 'NanoDemo',
  components: {
    NanoWallet,
    NanoTransactionHistory,
    NanoTransactionResults,
    NanoTransactionStatusBar,
  },
  props: {
    firstWallet: Object,
    secondWallet: Object,
  },
  setup(props) {
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

    const disableNanoA = computed(() => {
      return firstWalletAccount.value.balance.raw === '0' || sendingNanoA.value;
    });
    const disableNanoB = computed(() => {
      return secondWalletAccount.value.balance.raw === '0' || sendingNanoB.value;
    });

    const sendNano = (receivingWalletLetter) => {
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
              sendingNanoA.value = false;
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
              sendingNanoB.value = false;
              return;
            }
            console.log(accountAfterSend);
          });
      }
    };

    emitter.on('nano-sent', (sendData) => {
      if (sendData.address === firstWalletAccount.value.address) {
        console.log('#matched wallet A send');
        sendingNanoA.value = false;
      } else if (sendData.address === secondWalletAccount.value.address) {
        console.log('#matched wallet B send');
        sendingNanoB.value = false;
      } else {
        console.log("error, address from nano-sent emit doesn't any wallet address");
      }
    });
    return {
      firstWalletAccount,
      secondWalletAccount,
      isInitialNanoA,
      isInitialNanoB,
      sendingNanoA,
      sendingNanoB,
      disableNanoA,
      disableNanoB,
      lastWalletClicked,
      sendNano,
    };
  },
};
</script>

<style scoped>
.row-bg {
  margin: auto;
  padding: 1%;
  background-color: #f9fafc;
  width: 95%;
}

.nanoButton {
  margin-top: 5px;
  font-weight: bold;
  /* background-color: #ecf5ff; */
}

.arrow {
  font-size: 18px;
}
</style>
