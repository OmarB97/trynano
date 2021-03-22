<template>
  <i18n-t keypath="claimNano.firstSentence.main" tag="p">
    <strong>{{ t('claimNano.firstSentence.privateWallet') }}</strong>
  </i18n-t>
  <i18n-t keypath="claimNano.secondSentence.main" tag="p">
    <a href="https://natrium.io/" target="_blank">{{
      t('claimNano.secondSentence.natrium')
    }}</a>
    <a href="https://nault.cc" target="_blank">{{
      t('claimNano.secondSentence.nault')
    }}</a>
  </i18n-t>
  <i18n-t
    keypath="claimNano.thirdSentence.main"
    tag="p"
    style="font-size: 90%; opacity: 85%; margin-top: -10px"
  >
    <a href="https://nanowallets.guide/" target="_blank">{{
      t('claimNano.thirdSentence.guide')
    }}</a>
  </i18n-t>
  <p style="margin-top: 30px">
    {{ t('claimNano.fourthSentence') }}
  </p>
  <el-row
    class="send-nano-row"
    :class="{
      'send-nano-row-phone': $mq === 'phone',
      'send-nano-row-tabletSm': $mq === 'tabletSm',
      'send-nano-row-tablet': $mq === 'tablet',
      'send-nano-row-other': $mq === 'other',
    }"
    type="flex"
    justify="center"
  >
    <el-col :span="nanoAddressSpan">
      <el-input
        class="nano-address-input"
        :placeholder="t('claimNano.addressPlaceholder')"
        v-model="receivingNanoAddress"
        clearable
        @input="validateNanoAddress"
        @focus="validNanoAddressLabel.style.display = 'none'"
        @blur="showNanoAddressValidityLabel"
        @keyup.enter.prevent="maybeTriggerSendButtonClick"
      >
      </el-input>
      <div ref="validNanoAddressLabel" class="validNanoAddressLabel">
        {{
          isValidNanoAddress
            ? t('claimNano.validNanoAddress')
            : t('claimNano.invalidNanoAddress')
        }}
      </div>
    </el-col>
    <el-col :span="sendButtonSpan">
      <el-button
        ref="sendButton"
        type="success"
        plain
        :disabled="!canSendNano"
        @click="sendNanoClicked"
        :loading="sendingNano"
      >
        <div v-show="!sendingNano && !nanoSuccessfullySent">
          {{ t('claimNano.send') }} <i class="el-icon-s-promotion"></i>
        </div>
        <div v-show="sendingNano && !nanoSuccessfullySent">
          {{ t('claimNano.sending') }}
        </div>
        <div v-show="!sendingNano && nanoSuccessfullySent">{{ t('claimNano.sent') }}</div>
      </el-button></el-col
    >
  </el-row>
  <el-divider content-position="center"
    ><div>{{ t('claimNano.dividerText') }}</div></el-divider
  >
  <div class="return-nano-button">
    <el-button
      type="success"
      round
      :disabled="!canReturnNano"
      @click="returnNanoClicked"
      :loading="returningNano"
      :class="{
        'return-nano-button-phone': $mq === 'phone',
        'return-nano-button-tabletSm': $mq === 'tabletSm',
        'return-nano-button-tablet': $mq === 'tablet',
        'return-nano-button-other': $mq === 'other',
      }"
    >
      <div v-show="!returningNano && !nanoSuccessfullyReturned">
        {{ t('claimNano.returnToSender') }} <i class="el-icon-s-promotion"></i>
      </div>
      <div v-show="returningNano && !nanoSuccessfullyReturned">
        {{ t('claimNano.sending') }}
      </div>
      <div v-show="!returningNano && nanoSuccessfullyReturned">
        {{ t('claimNano.sent') }}
      </div>
    </el-button>
  </div>
</template>
<script>
import { ref, computed, getCurrentInstance } from 'vue';
import { ElMessage } from 'element-plus';
import { tools } from 'nanocurrency-web';
import { useI18n } from 'vue-i18n';
import recaptcha from '../util/recaptcha';
import serverAPI from '../util/server_api';

export default {
  name: 'ClaimNano',
  props: {
    firstWallet: Object,
    secondWallet: Object,
    originAddressMap: Map,
    recaptchaLoaded: Function,
    executeRecaptcha: Function,
  },
  computed: {
    nanoAddressSpan() {
      switch (this.$mq) {
        case 'phone':
          return 16;
        case 'tabletSm':
          return 14;
        case 'tablet':
          return 12;
        case 'other':
          return 12;
        default:
          return 12;
      }
    },
    sendButtonSpan() {
      switch (this.$mq) {
        case 'phone':
          return 8;
        case 'tabletSm':
          return 7;
        case 'tablet':
          return 6;
        case 'other':
          return 3;
        default:
          return 3;
      }
    },
  },
  setup(props) {
    const { t } = useI18n({ useScope: 'global' });
    const { emitter } = getCurrentInstance().appContext.config.globalProperties;

    const { getRecaptchaToken } = recaptcha();
    const { sendNano } = serverAPI();

    const sendButton = ref(null);
    const receivingNanoAddress = ref('');
    const isValidNanoAddress = ref(false);
    const validNanoAddressLabel = ref(null);
    const sendingNano = ref(false);
    const nanoSuccessfullySent = ref(false);
    const returningNano = ref(false);
    const nanoSuccessfullyReturned = ref(false);

    const sendingWalletAccount = computed(() => {
      if (props.firstWallet.balance.raw !== '0') {
        return props.firstWallet;
      }
      return props.secondWallet;
    });

    const canSendNano = computed(() => {
      return (
        isValidNanoAddress.value &&
        sendingWalletAccount.value.balance.raw !== '0' &&
        !sendingNano.value &&
        !nanoSuccessfullySent.value
      );
    });

    const canReturnNano = computed(() => {
      return (
        sendingWalletAccount.value.balance.raw !== '0' &&
        !returningNano.value &&
        !nanoSuccessfullyReturned.value
      );
    });

    const showNanoAddressValidityLabel = () => {
      if (isValidNanoAddress.value) {
        validNanoAddressLabel.value.style.color = '#23DC3D';
      } else {
        validNanoAddressLabel.value.style.color = '#E51C08';
      }
      if (receivingNanoAddress.value !== '') {
        validNanoAddressLabel.value.style.display = 'block';
      } else {
        validNanoAddressLabel.value.style.display = 'none';
      }
    };

    const validateNanoAddress = (address) => {
      if (validNanoAddressLabel.value.style.display !== 'none') {
        validNanoAddressLabel.value.style.display = 'none';
      }
      isValidNanoAddress.value = tools.validateAddress(address);
    };

    const sendNanoClicked = async () => {
      sendingNano.value = true;

      // Generate recaptcha token
      const token = await getRecaptchaToken(
        props.recaptchaLoaded,
        props.executeRecaptcha,
        'sendNano'
      );

      const res = await sendNano(
        token,
        sendingWalletAccount.value.address,
        sendingWalletAccount.value.privateKey,
        receivingNanoAddress.value
      );

      if (res.error) {
        ElMessage({
          message: res.error,
          type: 'error',
        });
        return;
      }
      sendingNano.value = false;
      nanoSuccessfullySent.value = true;
      emitter.emit('step-completed', 'third');
    };

    const maybeTriggerSendButtonClick = () => {
      if (nanoSuccessfullySent.value) {
        return;
      }
      if (canSendNano.value) {
        if (sendButton.value != null) {
          sendButton.value.handleClick();
        }
      } else {
        showNanoAddressValidityLabel();
      }
    };

    const returnNanoClicked = async () => {
      returningNano.value = true;
      // Generate recaptcha token
      const token = await getRecaptchaToken(
        props.recaptchaLoaded,
        props.executeRecaptcha,
        'returnNano'
      );
      const allNanoSent = ref(true);
      const results = ref([]);
      // eslint-disable-next-line no-restricted-syntax
      for (const [originAddress, originAmount] of props.originAddressMap) {
        results.value.push(
          sendNano(
            token,
            sendingWalletAccount.value.address,
            sendingWalletAccount.value.privateKey,
            originAddress,
            originAmount
          ).then((res) => {
            if (res.error) {
              allNanoSent.value = false;
            }
          })
        );
      }
      // Now that all the asynchronous operations are running, here we wait until they all complete.
      await Promise.all(results.value);
      if (allNanoSent.value) {
        nanoSuccessfullyReturned.value = true;
        emitter.emit('step-completed', 'third');
      } else {
        ElMessage({
          message: 'Error returning Nano back to original source(s)',
          type: 'error',
        });
      }
      returningNano.value = false;
    };

    return {
      t,
      receivingNanoAddress,
      sendNanoClicked,
      validateNanoAddress,
      isValidNanoAddress,
      validNanoAddressLabel,
      showNanoAddressValidityLabel,
      sendingNano,
      nanoSuccessfullySent,
      sendingWalletAccount,
      sendButton,
      maybeTriggerSendButtonClick,
      canSendNano,
      canReturnNano,
      returningNano,
      nanoSuccessfullyReturned,
      returnNanoClicked,
    };
  },
};
</script>

<style scoped>
.send-nano-row {
  margin: auto;
}

.send-nano-row-other,
.send-nano-row-tablet {
  width: 90%;
}

.send-nano-row-tabletSm,
.send-nano-row-phone {
  width: 95%;
}

.nano-address-input {
  display: inline-flex;
  width: 100%;
}

.validNanoAddressLabel {
  display: none;
  font-size: 95%;
  font-weight: 500;
  text-align: left;
  margin: 1px auto 0px 16px;
}

.return-nano-button {
  margin-top: 30px;
  margin-bottom: 20px;
}

.return-nano-button-tabletSm,
.return-nano-button-phone {
  width: auto;
}

.return-nano-button-tablet {
  width: 75%;
}

.return-nano-button-other {
  width: 70%;
}
</style>
