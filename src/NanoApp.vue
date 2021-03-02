/* eslint-disable operator-linebreak */
<template>
  <div class="flex-wrapper">
    <div class="site-content">
      <NanoIntro @revealStepsClicked="handleRevealStepsClicked"></NanoIntro>
      <transition name="fade-in-down">
        <div v-show="didRevealSteps">
          <el-steps
            class="steps"
            :active="currentStep"
            align-center
            finish-status="success"
          >
            <el-step
              title="Step 1"
              description="Grab Some Nano"
              icon="el-icon-coin"
            ></el-step>
            <el-step
              title="Step 2"
              description="Try It Out"
              icon="el-icon-set-up"
            ></el-step>
            <el-step
              title="Step 3"
              description="Set Up Your Wallet"
              icon="el-icon-wallet"
            ></el-step>
            <el-step title="Step 4" description="Done!" icon="el-icon-finished"></el-step>
          </el-steps>
          <div class="step-section">
            <div class="steppers">
              <el-button
                :style="{ visibility: currentStep > 0 ? 'visible' : 'hidden' }"
                round
                type="primary"
                plain
                icon="el-icon-back"
                @click="decreaseStep"
                >Previous Step</el-button
              >
              <el-button
                :style="{ visibility: currentStep < 4 ? 'visible' : 'hidden' }"
                round
                type="primary"
                plain
                @click="increaseStep"
                :disabled="!isCurrentStepComplete"
                >Next Step <i class="el-icon-right"></i
              ></el-button>
            </div>
            <el-card shadow="always" :body-style="{ backgroundColor: '#F4FAFF' }">
              <transition :name="transitionDirection">
                <div v-show="currentStep === 0">
                  <NanoFaucetInfo :firstWalletData="firstWalletData"></NanoFaucetInfo>
                </div>
              </transition>
              <transition :name="transitionDirection">
                <div v-show="currentStep === 1">
                  <NanoDemo
                    :firstWallet="firstWalletData"
                    :secondWallet="secondWalletData"
                  ></NanoDemo>
                </div>
              </transition>
              <transition :name="transitionDirection">
                <div v-show="currentStep === 2">
                  <ClaimNano
                    :firstWallet="firstWalletData"
                    :secondWallet="secondWalletData"
                  ></ClaimNano>
                </div>
              </transition>
              <transition :name="transitionDirection">
                <div v-show="currentStep === 4">
                  <NanoResources
                    :firstWallet="firstWalletData"
                    :secondWallet="secondWalletData"
                  ></NanoResources>
                </div>
              </transition>
            </el-card>
          </div>
        </div>
      </transition>
      <div class="push"></div>
    </div>
    <NanoFooter></NanoFooter>
  </div>
</template>

<script>
import { ref, computed, getCurrentInstance } from 'vue';
import removeTrailingZeros from 'remove-trailing-zeros';
import { tools } from 'nanocurrency-web';
import NanoIntro from './components/NanoIntro.vue';
import NanoFaucetInfo from './components/NanoFaucetInfo.vue';
import NanoFooter from './components/NanoFooter.vue';
import NanoDemo from './components/demo/NanoDemo.vue';
import ClaimNano from './components/ClaimNano.vue';
import callWebsocket from './rpc/nano-ws';
import NanoResources from './components/NanoResources.vue';

export default {
  name: 'NanoApp',
  components: {
    NanoIntro,
    NanoFaucetInfo,
    NanoDemo,
    NanoFooter,
    ClaimNano,
    NanoResources,
  },
  setup() {
    const {
      emitter,
      nanoClient,
    } = getCurrentInstance().appContext.config.globalProperties;

    const currentStep = ref(0);
    const transitionDirection = ref('fade-in-down');

    const stepCompleteState = ref({
      isFirstStepComplete: false,
      isSecondStepComplete: false,
      isThirdStepComplete: false,
    });

    const isCurrentStepComplete = computed(() => {
      switch (currentStep.value) {
        case 0:
          return stepCompleteState.value.isFirstStepComplete;
        case 1:
          return stepCompleteState.value.isSecondStepComplete;
        case 2:
          return stepCompleteState.value.isThirdStepComplete;
        case 4:
        default:
          return true;
      }
    });

    emitter.on('step-completed', (step) => {
      switch (step) {
        case 'first':
          stepCompleteState.value.isFirstStepComplete = true;
          break;
        case 'second':
          stepCompleteState.value.isSecondStepComplete = true;
          break;
        case 'third':
          stepCompleteState.value.isThirdStepComplete = true;
          break;
        default:
      }
    });

    const decreaseStep = () => {
      if (currentStep.value === 4) {
        currentStep.value -= 1;
      }
      currentStep.value -= 1;
      transitionDirection.value = 'fade-in-left';
    };

    const increaseStep = () => {
      if (currentStep.value === 2) {
        currentStep.value += 1;
      }
      currentStep.value += 1;
      transitionDirection.value = 'fade-in-right';
    };

    const didRevealSteps = ref(false);

    const firstWalletData = ref(nanoClient.generateWallet());
    const secondWalletData = ref(nanoClient.generateWallet());
    const alreadyProcessedReceiveBlock = ref(false);

    const handleRevealStepsClicked = () => {
      didRevealSteps.value = true;
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
        return;
      }
      /*
        Replace hardcoded 1 with a 'receiveAll' API call once
        it has been implemented by the npm library
      */
      if (!alreadyProcessedReceiveBlock.value) {
        nanoClient.receive(matchingRecieveAccount, 1);
      }
      alreadyProcessedReceiveBlock.value = !alreadyProcessedReceiveBlock.value;
    });

    // Handle receive confirmation block, emit received nano data
    emitter.on('block-confirmation-receive', (res) => {
      const confirmationAddress = res.message.account;
      if (firstWalletData.value.accounts[0].address === confirmationAddress) {
        // update first wallet balance
        firstWalletData.value.accounts[0].balance.raw = res.message.amount;
      } else if (secondWalletData.value.accounts[0].address === confirmationAddress) {
        // receive block for second wallet
        secondWalletData.value.accounts[0].balance.raw = res.message.amount;
      } else {
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
      currentStep,
      decreaseStep,
      increaseStep,
      stepCompleteState,
      isCurrentStepComplete,
      transitionDirection,
      didRevealSteps,
      firstWalletData,
      secondWalletData,
      handleRevealStepsClicked,
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

.fade-in-right-enter-active {
  transition: all 0.4s ease-out;
}

.fade-in-right-enter-from {
  transform: translatex(20px);
  opacity: 0;
}

.fade-in-left-enter-active {
  transition: all 0.4s ease-out;
}

.fade-in-left-enter-from {
  transform: translatex(-20px);
  opacity: 0;
}

.steps {
  text-align: initial;
  width: 60%;
  margin: -60px auto 50px auto;
}

.step-section {
  width: 80%;
  margin: auto auto 50px auto;
}

.steppers {
  width: 95%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
</style>
