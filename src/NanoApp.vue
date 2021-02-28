/* eslint-disable operator-linebreak */
<template>
  <div class="flex-wrapper">
    <div class="site-content">
      <NanoIntro @revealFaucetInfoClicked="handleRevealFaucetInfoClicked"></NanoIntro>
      <transition name="fade-in-down">
        <div v-show="didRevealFaucetInfo">
          <NanoFaucetInfo
            :firstWalletData="firstWalletData"
            @revealDemoClicked="didRevealDemo = true"
          ></NanoFaucetInfo>
        </div>
      </transition>
      <transition name="fade-in-down">
        <div v-show="true">
          <NanoDemo
            :firstWallet="firstWalletData"
            :secondWallet="secondWalletData"
            @revealClaimNanoClicked="didRevealClaimNano = true"
          ></NanoDemo>
        </div>
      </transition>
      <transition name="fade-in-down">
        <div class="claimNano" v-show="didRevealClaimNano">
          <ClaimNano
            :firstWallet="firstWalletData"
            :secondWallet="secondWalletData"
          ></ClaimNano>
        </div>
      </transition>
      <div class="push"></div>
    </div>
    <NanoFooter></NanoFooter>
  </div>
</template>

<script>
import { ref, getCurrentInstance } from 'vue';
import removeTrailingZeros from 'remove-trailing-zeros';
import { tools } from 'nanocurrency-web';
import NanoIntro from './components/NanoIntro.vue';
import NanoFaucetInfo from './components/NanoFaucetInfo.vue';
import NanoFooter from './components/NanoFooter.vue';
import NanoDemo from './components/demo/NanoDemo.vue';
import ClaimNano from './components/ClaimNano.vue';
import callWebsocket from './rpc/nano-ws';

export default {
  name: 'NanoApp',
  components: {
    NanoIntro,
    NanoFaucetInfo,
    NanoDemo,
    NanoFooter,
    ClaimNano,
  },
  setup() {
    const {
      emitter,
      nanoClient,
    } = getCurrentInstance().appContext.config.globalProperties;

    const didRevealFaucetInfo = ref(false);
    const didRevealDemo = ref(false);
    const didRevealClaimNano = ref(false);

    const firstWalletData = ref(nanoClient.generateWallet());
    const secondWalletData = ref(nanoClient.generateWallet());
    const alreadyProcessedReceiveBlock = ref(false);

    const handleRevealFaucetInfoClicked = () => {
      didRevealFaucetInfo.value = true;
      console.log(firstWalletData.value);
      console.log(secondWalletData.value);
      callWebsocket(
        [
          firstWalletData.value.accounts[0].address,
          secondWalletData.value.accounts[0].address,
        ],
        emitter
      );
    };

    // Handle send confirmation block, receive most recent pending block
    emitter.on('block-confirmation-send', (res) => {
      console.log('emitter on block-confirmation-send in NanoApp');
      console.log(
        `NanoApp block-confirmation-send response: ${JSON.stringify(res.message)}`
      );

      const confirmationSenderAddress = res.message.account;
      let shouldEmitSend;
      if (firstWalletData.value.accounts[0].address === confirmationSenderAddress) {
        // update first wallet balance
        firstWalletData.value.accounts[0].balance.raw = res.message.block.balance;
        shouldEmitSend = true;
      } else if (
        secondWalletData.value.accounts[0].address === confirmationSenderAddress
      ) {
        // receive block for second wallet
        secondWalletData.value.accounts[0].balance.raw = res.message.block.balance;
        shouldEmitSend = true;
      } else {
        shouldEmitSend = false;
      }

      if (shouldEmitSend && !alreadyProcessedReceiveBlock.value) {
        emitter.emit('nano-sent', {
          address: confirmationSenderAddress,
          timestamp: res.time,
          hash: res.message.hash,
        });
      }

      const confirmationReceiverAddress = res.message.block.link_as_account;
      let matchingRecieveAccount;
      if (firstWalletData.value.accounts[0].address === confirmationReceiverAddress) {
        // receive block for first wallet
        [matchingRecieveAccount] = firstWalletData.value.accounts;
      } else if (
        secondWalletData.value.accounts[0].address === confirmationReceiverAddress
      ) {
        // receive block for second wallet
        [matchingRecieveAccount] = secondWalletData.value.accounts;
      } else {
        console.log(
          'Receive Confirmation block receiver address did not match address in either wallet'
        );
        return;
      }
      /*
        Replace hardcoded 1 with a 'receiveAll' API call once
        it has been implemented by the npm library
      */
      console.log(matchingRecieveAccount);
      if (!alreadyProcessedReceiveBlock.value) {
        nanoClient.receive(matchingRecieveAccount, 1).then((accountAfterReceive) => {
          if (accountAfterReceive.error && accountAfterReceive.error !== null) {
            console.log(`error receiving nano block, ${accountAfterReceive.error}`);
          }
          console.log(accountAfterReceive);
        });
      }
      alreadyProcessedReceiveBlock.value = !alreadyProcessedReceiveBlock.value;
    });

    // Handle receive confirmation block, emit received nano data
    emitter.on('block-confirmation-receive', (res) => {
      console.log('emitter on block-confirmation-receive in NanoApp');
      console.log(
        `NanoApp block-confirmation-receive response: ${JSON.stringify(res.message)}`
      );
      const confirmationAddress = res.message.account;
      if (firstWalletData.value.accounts[0].address === confirmationAddress) {
        // update first wallet balance
        firstWalletData.value.accounts[0].balance.raw = res.message.amount;
      } else if (secondWalletData.value.accounts[0].address === confirmationAddress) {
        // receive block for second wallet
        secondWalletData.value.accounts[0].balance.raw = res.message.amount;
      } else {
        console.log(
          'Receive Confirmation block receiver address did not match address in either wallet'
        );
        return;
      }

      const nanoAmount = removeTrailingZeros(
        tools.convert(res.message.amount, 'RAW', 'NANO')
      );
      const nanoBalance = removeTrailingZeros(
        tools.convert(res.message.block.balance, 'RAW', 'NANO')
      );
      emitter.emit('nano-received', {
        address: confirmationAddress,
        amount: nanoAmount,
        balance: nanoBalance,
        hash: res.message.hash,
      });
    });

    return {
      didRevealFaucetInfo,
      didRevealDemo,
      didRevealClaimNano,
      firstWalletData,
      secondWalletData,
      handleRevealFaucetInfoClicked,
    };
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0 auto;
}

.site-content {
  margin-top: 60px;
}

.flex-wrapper {
  display: flex;
  min-height: 100vh;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
}

a {
  text-decoration: none;
  color: #0000ee;
  font-weight: 600;
}

.footer-content > a {
  color: #e6e6e6;
  font-weight: 400;
}

a:hover {
  text-decoration: underline;
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.fade-in-down-enter-active {
  transition: all 0.4s ease-out;
}

.fade-in-down-enter-from {
  transform: translatey(-20px);
  opacity: 0;
}

.claimNano {
  margin-bottom: 30px;
}
</style>
