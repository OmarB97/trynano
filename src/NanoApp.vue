/* eslint-disable operator-linebreak */
<template>
  <div class="flex-wrapper">
    <div>
      <div class="content-vertical-align">
        <div>
          <div :style="{ float: 'right', width: headerWidth }">
            <el-row type="flex" justify="end" align="middle" class="header-row">
              <el-col :span="languageSpan">
                <el-select v-model="locale">
                  <template #prefix>
                    <i class="fas fa-globe-americas locale-icon"></i>
                  </template>
                  <el-option
                    v-for="language in availableLocales"
                    :key="language"
                    :label="'  ' + localeNameMapping[language]"
                    :value="language"
                  >
                    <span
                      class="select-locale-font"
                      style="float: left; margin-right: 20px"
                      >{{ localeNameMapping[language] }}</span
                    >
                    <span
                      class="select-locale-font"
                      style="float: right; color: #8492a6; font-size: 13px"
                      >{{ language }}</span
                    >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="6">
                <p class="version">v{{ version }}</p>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="site-content">
          <NanoIntro @revealStepsClicked="handleRevealStepsClicked"></NanoIntro>
          <transition name="fade-in-down">
            <div v-show="didRevealSteps">
              <el-steps
                :space="500"
                class="steps"
                :class="{
                  'steps-width-phone': $mq === 'phone',
                  'steps-width-tabletSm': $mq === 'tabletSm',
                  'steps-width-tablet': $mq === 'tablet',
                  'steps-width-other': $mq === 'other',
                }"
                :active="currentStep"
                align-center
                finish-status="success"
              >
                <el-step
                  :title="t('nanoApp.steps.title', 1)"
                  :description="t('nanoApp.steps.description.one')"
                  icon="el-icon-coin"
                ></el-step>
                <el-step
                  :title="t('nanoApp.steps.title', 2)"
                  :description="t('nanoApp.steps.description.two')"
                  icon="el-icon-set-up"
                ></el-step>
                <el-step
                  :title="t('nanoApp.steps.title', 3)"
                  :description="t('nanoApp.steps.description.three')"
                  icon="el-icon-wallet"
                ></el-step>
                <el-step
                  :title="t('nanoApp.steps.title', 4)"
                  :description="t('nanoApp.steps.description.four')"
                  icon="el-icon-finished"
                ></el-step>
              </el-steps>
              <div
                class="step-section"
                :class="{
                  'step-section-width-phone': $mq === 'phone',
                  'step-section-width-tabletSm': $mq === 'tabletSm',
                  'step-section-width-tablet': $mq === 'tablet',
                  'step-section-width-other': $mq === 'other',
                }"
              >
                <div class="steppers">
                  <el-button
                    :style="{ visibility: currentStep > 0 ? 'visible' : 'hidden' }"
                    round
                    type="primary"
                    plain
                    icon="el-icon-back"
                    @click="decreaseStep"
                    >{{ t('nanoApp.steppers.previous') }}</el-button
                  >
                  <el-button
                    :style="{ visibility: currentStep < 4 ? 'visible' : 'hidden' }"
                    round
                    type="primary"
                    plain
                    @click="increaseStep"
                    :disabled="!isCurrentStepComplete"
                    >{{ t('nanoApp.steppers.next') }}<i class="el-icon-right"></i
                  ></el-button>
                </div>
                <el-card shadow="always" :body-style="{ backgroundColor: '#F4FAFF' }">
                  <vue-element-loading
                    :active="!didGenerateWallets"
                    background-color="#F4FAFF"
                    spinner="spinner"
                    color="#3b7bbf"
                    :text="t('nanoApp.generatingWallets')"
                  />
                  <transition :name="transitionDirection">
                    <div v-show="currentStep === 0">
                      <NanoFaucetInfo
                        :firstWalletData="firstWalletData"
                        :recaptchaLoaded="recaptchaLoaded"
                        :executeRecaptcha="executeRecaptcha"
                      ></NanoFaucetInfo>
                    </div>
                  </transition>
                  <transition :name="transitionDirection">
                    <div v-show="currentStep === 1">
                      <NanoDemo
                        :firstWallet="firstWalletData"
                        :secondWallet="secondWalletData"
                        :recaptchaLoaded="recaptchaLoaded"
                        :executeRecaptcha="executeRecaptcha"
                      ></NanoDemo>
                    </div>
                  </transition>
                  <transition :name="transitionDirection">
                    <div v-show="currentStep === 2">
                      <ClaimNano
                        :firstWallet="firstWalletData"
                        :secondWallet="secondWalletData"
                        :originAddressMap="nanoOriginAddressMap"
                        :recaptchaLoaded="recaptchaLoaded"
                        :executeRecaptcha="executeRecaptcha"
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
        </div>
      </div>
      <div class="push"></div>
    </div>
    <NanoFooter></NanoFooter>
  </div>
</template>

<script>
import { ref, computed, getCurrentInstance } from 'vue';
import removeTrailingZeros from 'remove-trailing-zeros';
import { tools } from 'nanocurrency-web';
import { NANO } from '@nanobox/nano-client/dist/models';
import { useReCaptcha } from 'vue-recaptcha-v3';
import { ElMessage } from 'element-plus';
import VueElementLoading from 'vue-element-loading';
import { useI18n } from 'vue-i18n';
import { version } from '../package.json';
import recaptcha from './util/recaptcha';
import NanoIntro from './components/NanoIntro.vue';
import NanoFaucetInfo from './components/NanoFaucetInfo.vue';
import NanoFooter from './components/NanoFooter.vue';
import NanoDemo from './components/demo/NanoDemo.vue';
import ClaimNano from './components/ClaimNano.vue';
import callWebsocket from './ws/nano-ws';
import NanoResources from './components/NanoResources.vue';
import serverAPI from './util/server_api';
import sampleWalletData from './util/sample_wallet_data';

export default {
  name: 'NanoApp',
  components: {
    NanoIntro,
    NanoFaucetInfo,
    NanoDemo,
    NanoFooter,
    ClaimNano,
    NanoResources,
    VueElementLoading,
  },
  data() {
    return {
      localeNameMapping: {
        en: 'English',
        'pt-BR': 'Português brasileiro',
        'fr-FR': 'France francaise',
      },
    };
  },
  computed: {
    headerWidth() {
      switch (this.$mq) {
        case 'phone':
          return '80%';
        case 'tabletSm':
          return '60%';
        case 'tablet':
          return '40%';
        case 'other':
          return '25%';
        default:
          return '25%';
      }
    },
    languageSpan() {
      switch (this.$mq) {
        case 'phone':
          return 18;
        case 'tabletSm':
          return 16;
        case 'tablet':
          return 12;
        case 'other':
          return 11;
        default:
          return 11;
      }
    },
  },
  setup() {
    const { t, locale, availableLocales } = useI18n({ useScope: 'global' });

    const { emitter } = getCurrentInstance().appContext.config.globalProperties;
    const { recaptchaLoaded, executeRecaptcha } = useReCaptcha();
    const { getRecaptchaToken } = recaptcha();
    const { generateWallets, getFaucetInfo, receiveNano } = serverAPI();
    const { firstSampleWallet, secondSampleWallet } = sampleWalletData();

    const currentStep = ref(0);
    const transitionDirection = ref('fade-in-down');

    const stepCompleteState = ref({
      isFirstStepComplete: false,
      isSecondStepComplete: false,
      isThirdStepComplete: false,
    });

    const didRevealSteps = ref(false);
    const didGenerateWallets = ref(false);
    const firstWalletData = ref(firstSampleWallet.value);
    const secondWalletData = ref(secondSampleWallet.value);
    const alreadyProcessedReceiveBlock = ref(false);

    const nanoOriginAddressMap = ref(new Map());

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

    const getFaucetInfoData = async (token1, token2) => {
      return Promise.all([generateWallets(token1), getFaucetInfo(token2)]);
    };

    const handleRevealStepsClicked = async () => {
      didRevealSteps.value = true;
      const token1 = await getRecaptchaToken(
        recaptchaLoaded,
        executeRecaptcha,
        'generateWallets'
      );

      const token2 = await getRecaptchaToken(
        recaptchaLoaded,
        executeRecaptcha,
        'getFaucetInfo'
      );

      // concurently get both wallets + faucet info
      const [generateWalletsRes, getFaucetInfoRes] = await getFaucetInfoData(
        token1,
        token2
      );

      if (getFaucetInfoRes.error) {
        ElMessage({
          message: getFaucetInfoRes.error,
          type: 'error',
        });
      } else {
        emitter.emit('faucet-balance-info', {
          balance: getFaucetInfoRes.balance.toFixed(6),
          payout: `${getFaucetInfoRes.payout * 100}%`,
        });
      }

      if (generateWalletsRes.error) {
        ElMessage({
          message: generateWalletsRes.error,
          type: 'error',
        });
      } else {
        didGenerateWallets.value = true;
        [firstWalletData.value, secondWalletData.value] = generateWalletsRes.wallets;
        callWebsocket(
          [firstWalletData.value.address, secondWalletData.value.address],
          emitter
        );
      }
    };

    // Handle send confirmation block, receive most recent pending block
    emitter.on('block-confirmation-send', async (res) => {
      const confirmationSenderAddress = res.message.account;
      const confirmationReceiverAddress = res.message.block.link_as_account;
      let shouldEmitSend;
      if (firstWalletData.value.address === confirmationSenderAddress) {
        // update first wallet balance
        firstWalletData.value.balance.raw = res.message.block.balance;
        shouldEmitSend = true;
      } else if (secondWalletData.value.address === confirmationSenderAddress) {
        // receive block for second wallet
        secondWalletData.value.balance.raw = res.message.block.balance;
        shouldEmitSend = true;
      } else {
        // save all external wallet addresses and how much Nano they've sent so far
        let amountSentFromOrigin = NANO.fromRAW(res.message.amount);
        if (nanoOriginAddressMap.value.has(confirmationSenderAddress)) {
          amountSentFromOrigin = amountSentFromOrigin.plus(
            nanoOriginAddressMap.value.get(confirmationSenderAddress)
          );
        }
        nanoOriginAddressMap.value.set(confirmationSenderAddress, amountSentFromOrigin);
        shouldEmitSend = false;
      }

      const isInternalSend =
        (confirmationSenderAddress === firstWalletData.value.address ||
          confirmationSenderAddress === secondWalletData.value.address) &&
        (confirmationReceiverAddress === firstWalletData.value.address ||
          confirmationReceiverAddress === secondWalletData.value.address);

      const emitType = isInternalSend ? 'internal-nano-send' : 'external-nano-send';

      if (shouldEmitSend && isInternalSend && !alreadyProcessedReceiveBlock.value) {
        emitter.emit(emitType, {
          address: confirmationSenderAddress,
          timestamp: res.time,
          hash: res.message.hash,
        });
      }

      let matchingRecieveAccount;
      if (firstWalletData.value.address === confirmationReceiverAddress) {
        // receive block for first wallet
        matchingRecieveAccount = firstWalletData.value.address;
      } else if (secondWalletData.value.address === confirmationReceiverAddress) {
        // receive block for second wallet
        matchingRecieveAccount = secondWalletData.value.address;
      } else {
        return;
      }
      /*
        Replace hardcoded 1 with a 'receiveAll' API call once
        it has been implemented by the npm library
      */
      if (!alreadyProcessedReceiveBlock.value) {
        // matchingRecieveAccount
        const token = await getRecaptchaToken(
          recaptchaLoaded,
          executeRecaptcha,
          'receiveNano'
        );
        const receiveRes = await receiveNano(token, matchingRecieveAccount);
        if (receiveRes.error) {
          ElMessage({
            message: receiveRes.error,
            type: 'error',
          });
          return;
        }
      }
      alreadyProcessedReceiveBlock.value = !alreadyProcessedReceiveBlock.value;
    });

    // Handle receive confirmation block, emit received nano data
    emitter.on('block-confirmation-receive', (res) => {
      const confirmationAddress = res.message.account;
      if (firstWalletData.value.address === confirmationAddress) {
        // update first wallet balance
        firstWalletData.value.balance.raw = res.message.amount;
      } else if (secondWalletData.value.address === confirmationAddress) {
        // receive block for second wallet
        secondWalletData.value.balance.raw = res.message.amount;
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
      t,
      locale,
      availableLocales,
      version,
      currentStep,
      decreaseStep,
      increaseStep,
      stepCompleteState,
      isCurrentStepComplete,
      transitionDirection,
      didRevealSteps,
      didGenerateWallets,
      firstWalletData,
      secondWalletData,
      handleRevealStepsClicked,
      recaptchaLoaded,
      executeRecaptcha,
      nanoOriginAddressMap,
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
  max-width: 100%;
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
  margin-top: 20px;
  padding: 0 20px;
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
  margin: -60px auto 50px auto;
}

.steps-width-phone {
  width: 100%;
}

.steps-width-tabletSm {
  width: 90%;
}

.steps-width-tablet {
  width: 80%;
}

.steps-width-other {
  width: 60%;
}

.step-section {
  margin: auto auto 50px auto;
}

.step-section-width-phone {
  width: 100%;
}

.step-section-width-tabletSm {
  width: 95%;
}

.step-section-width-tablet {
  width: 90%;
}

.step-section-width-other {
  width: 80%;
}

.steppers {
  width: 95%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.grecaptcha-badge {
  opacity: 0;
}

.select-locale-font {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.locale-icon {
  font-size: 1.2em;
  position: relative;
  top: calc(50% - 1.04em);
  left: 5px;
}

.header-row {
  margin: 10px auto;
}

.version {
  font-size: 14px;
}

.content-vertical-align {
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
