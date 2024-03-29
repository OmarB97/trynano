<template>
  <div
    class="faucet-info"
    :class="{
      'faucet-card-width-phone': $mq === 'phone',
      'faucet-card-width-tabletSm': $mq === 'tabletSm',
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
        :loading="nanoFaucetPending || (nanoFaucetCompleted && !nanoReceived)"
        :disabled="nanoFaucetPending || nanoFaucetCompleted || nanoReceived"
        :class="{
          'faucet-button-phone': $mq === 'phone',
          'faucet-button-tabletSm': $mq === 'tabletSm',
          'faucet-button-tablet': $mq === 'tablet',
          'faucet-button-other': $mq === 'other',
        }"
        @click="onFaucetButtonClicked"
        ><div class="faucet-button-content">
          <div v-show="!nanoFaucetPending && !nanoFaucetCompleted">
            <span
              :style="{ paddingLeft: $mq !== 'phone' ? '30px' : '0px' }"
              class="faucet-text"
              >{{ t('nanoFaucetInfo.faucetButton') }}</span
            ><span class="faucet-emoji">🚰</span>
          </div>
          <div v-show="nanoFaucetPending && !nanoFaucetCompleted">
            <span class="faucet-text">{{ t('nanoFaucetInfo.requestingFaucet') }}</span>
          </div>
          <div v-show="!nanoFaucetPending && nanoFaucetCompleted && !nanoReceived">
            <span class="faucet-text"
              >{{ t('nanoFaucetInfo.receivePendingFromFaucet') }}
            </span>
          </div>
          <div v-show="!nanoFaucetPending && nanoFaucetCompleted && nanoReceived">
            <span class="faucet-text">{{ t('nanoFaucetInfo.faucetReceived') }}</span>
          </div>
        </div>
      </el-button>
    </div>
    <el-row class="faucet-balance-info" :gutter="20" type="flex" justify="center">
      <vue-element-loading
        :active="!didGetFaucetInfo"
        background-color="#F4FAFF"
        spinner="spinner"
        color="#3b7bbf"
        :text="t('nanoFaucetInfo.gettingFaucetInfo')"
      />
      <el-col :span="faucetInfoSpan">
        <i18n-t
          keypath="nanoFaucetInfo.faucetBalance.main"
          tag="p"
          class="faucet-balance-info-items"
        >
          <b>{{ t('nanoFaucetInfo.faucetBalance.balance', { faucetBalance }) }}</b>
        </i18n-t>
      </el-col>
      <el-col :span="faucetInfoSpan">
        <i18n-t
          keypath="nanoFaucetInfo.faucetPayout.main"
          tag="p"
          class="faucet-balance-info-items"
        >
          <b>{{ t('nanoFaucetInfo.faucetPayout.payout', { faucetPayout }) }}</b>
        </i18n-t>
      </el-col>
    </el-row>
    <el-divider content-position="center"
      ><div>{{ t('nanoFaucetInfo.dividerText') }}</div></el-divider
    >
    <i18n-t keypath="nanoFaucetInfo.firstSentence.main" tag="p" class="maintext">
      <a href="https://www.freenanofaucet.com/" target="_blank">{{
        t('nanoFaucetInfo.firstSentence.faucetUrl')
      }}</a>
    </i18n-t>
    <i18n-t keypath="nanoFaucetInfo.secondSentence.main" tag="p" class="subtext">
      <u>{{ t('nanoFaucetInfo.secondSentence.note') }}</u>
      <a href="https://nanotipbot.com/" target="_blank">{{
        t('nanoFaucetInfo.secondSentence.nanoTipBotUrl')
      }}</a>
    </i18n-t>
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
        <i18n-t
          keypath="nanoFaucetInfo.popover.main"
          tag="div"
          style="word-break: keep-all"
        >
          <strong
            ><u>{{ t('nanoFaucetInfo.popover.walletAddress') }}</u></strong
          >
        </i18n-t>
      </el-popover>
      <el-tooltip
        effect="dark"
        :content="copyPrompt"
        :placement="$mq === 'other' ? 'right' : 'bottom-end'"
        :offset="15"
      >
        <div
          style="display: inline-block; margin: 16px 0px"
          @mouseenter="copyPrompt = t('nanoFaucetInfo.tooltip.copyAddress')"
          @mouseover="hoverOnCopyAddress = true"
          @mouseleave="hoverOnCopyAddress = false"
          class="overflow"
          :class="{ pointer: hoverOnCopyAddress }"
          v-clipboard:copy="walletAccount.address"
          v-clipboard:success="onAddressCopySuccess"
        >
          <b>{{ t('nanoFaucetInfo.generatedWalletAddress') }}</b
          >:
          <span>{{ walletAccount.address }}</span>
          <img class="logo" src="../assets/copy.png" />
        </div>
      </el-tooltip>
    </div>
    <strong style="display: block">
      <div style="display: inline-block">
        {{ t('nanoFaucetInfo.depositStatus.main') }}&ensp;
      </div>
      <div style="display: inline-block" v-show="!nanoReceived" class="waiting">
        {{ t('nanoFaucetInfo.depositStatus.notReceived') }}
      </div>
      <div style="display: inline-block" v-show="nanoReceived" class="received">
        {{ t('nanoFaucetInfo.depositStatus.received') }}
      </div>
    </strong>
    <div v-show="walletBalance > 0">
      <div style="display: block">
        <strong style="display: inline-block"
          >{{ t('nanoFaucetInfo.walletBalance.main') }}&ensp;</strong
        >
        <div class="overflow" style="display: inline-block">
          {{ t('nanoFaucetInfo.walletBalance.amount', { walletBalance }) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, getCurrentInstance, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
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
    faucetInfoSpan() {
      switch (this.$mq) {
        case 'phone':
          return 10;
        case 'tabletSm':
          return 8;
        case 'tablet':
          return 7;
        case 'other':
          return 6;
        default:
          return 6;
      }
    },
    buttonSize() {
      switch (this.$mq) {
        case 'phone':
          return 'small';
        case 'tabletSm':
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
    const { t } = useI18n({ useScope: 'global' });
    const { emitter } = getCurrentInstance().appContext.config.globalProperties;
    const { getRecaptchaToken } = recaptcha();
    const { getNanoFromFaucet } = serverAPI();

    const didGetFaucetInfo = ref(false);
    const faucetBalance = ref(0);
    const faucetPayout = ref('');
    const nanoReceived = ref(false);
    const hoverOnCopyAddress = ref(false);
    const copyPrompt = ref(t('nanoFaucetInfo.tooltip.copyAddress'));
    const walletBalance = ref(0);
    const walletAccount = computed(() => props.firstWalletData);

    const nanoFaucetPending = ref(false);
    const nanoFaucetCompleted = ref(false);

    onMounted(async () => {
      const dividerTextElements = document.getElementsByClassName('el-divider__text');
      if (dividerTextElements) {
        // eslint-disable-next-line no-restricted-syntax
        for (const dividerTextElement of dividerTextElements)
          dividerTextElement.style.background = '#f4fafe';
      }
    });

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
      } else {
        nanoFaucetCompleted.value = true;
        faucetBalance.value = res.balance.toFixed(6);
      }
    };

    emitter.on('faucet-balance-info', (faucetBalanceInfo) => {
      didGetFaucetInfo.value = true;
      faucetBalance.value = faucetBalanceInfo.balance;
      faucetPayout.value = faucetBalanceInfo.payout;
    });

    emitter.on('nano-received', (receiveData) => {
      if (receiveData.address === walletAccount.value.address) {
        if (!nanoReceived.value && receiveData.balance > 0) {
          nanoReceived.value = true;
          walletBalance.value = receiveData.balance;
          emitter.emit('step-completed', 'first');
        }
      }
    });

    const onAddressCopySuccess = () => {
      copyPrompt.value = t('nanoFaucetInfo.tooltip.copiedAddress');
    };

    return {
      t,
      nanoReceived,
      hoverOnCopyAddress,
      onAddressCopySuccess,
      copyPrompt,
      walletBalance,
      walletAccount,
      onFaucetButtonClicked,
      nanoFaucetPending,
      nanoFaucetCompleted,
      didGetFaucetInfo,
      faucetBalance,
      faucetPayout,
    };
  },
};
</script>

<style>
.faucet-info {
  margin: 10px auto 50px auto;
}

.faucet-balance-info {
  padding: 0;
  margin: 0 auto 30px auto;
}

.faucet-balance-info-items {
  margin: 0;
  padding: 0;
  font-size: 14px;
  font-weight: lighter;
}

.faucet-balance-info-items > b {
  font-weight: 500;
}

.faucet-card-width-phone,
.faucet-card-width-tabletSm,
.faucet-card-width-tablet {
  width: 100%;
}

.faucet-card-width-other {
  width: 80%;
}

.faucet-button {
  margin-bottom: 15px;
}

.faucet-button-phone {
  width: auto;
}

.faucet-button-tabletSm {
  width: 90%;
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
