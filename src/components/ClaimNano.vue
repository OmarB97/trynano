<template>
  <p>
    To claim back your Nano, you'll need to set up a <strong>private wallet</strong> to
    store it in.
  </p>
  <p>
    The most popular wallets in the Nano community are
    <a href="https://natrium.io/" target="_blank">Natrium</a> (Android/iOS) and
    <a href="https://nault.cc" target="_blank">Nault</a> (Web/Desktop).
  </p>
  <p style="font-size: 90%; opacity: 85%; margin-top: -10px">
    (For a more complete list of options, please visit
    <a href="https://nanowallets.guide/" target="_blank">this guide</a>.)
  </p>
  <p style="margin-top: 30px">
    Once you've finished setting up your wallet, enter your new Nano wallet address below
    and click send. That's it!
  </p>
  <el-form
    :inline="true"
    class="sendNanoForm"
    @submit.prevent="maybeTriggerSendButtonClick"
  >
    <el-form-item>
      <el-input
        class="nanoAddressInput"
        placeholder="Enter your Nano address..."
        v-model="receivingNanoAddress"
        clearable
        @input="validateNanoAddress"
        @focus="validNanoAddressLabel.style.display = 'none'"
        @blur="showNanoAddressValidityLabel"
      >
      </el-input>
      <div ref="validNanoAddressLabel" class="validNanoAddressLabel">
        {{ isValidNanoAddress ? 'Valid Nano Address' : 'Invalid Nano Address' }}
      </div>
    </el-form-item>
    <el-form-item>
      <el-button
        ref="sendButton"
        type="success"
        plain
        :disabled="!canSendNano"
        @click="onSendNano"
        :loading="sendingNano"
      >
        <div v-show="!sendingNano && !nanoSuccessfullySent">
          Send <i class="el-icon-s-promotion"></i>
        </div>
        <div v-show="sendingNano && !nanoSuccessfullySent">Sending...</div>
        <div v-show="!sendingNano && nanoSuccessfullySent">Sent!</div>
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { ref, computed, getCurrentInstance } from 'vue';
import { ElMessage } from 'element-plus';
import { tools } from 'nanocurrency-web';

export default {
  name: 'ClaimNano',
  props: {
    firstWallet: Object,
    secondWallet: Object,
  },
  setup(props) {
    const {
      emitter,
      nanoClient,
    } = getCurrentInstance().appContext.config.globalProperties;

    const sendButton = ref(null);
    const receivingNanoAddress = ref('');
    const isValidNanoAddress = ref(false);
    const validNanoAddressLabel = ref(null);
    const sendingNano = ref(false);
    const nanoSuccessfullySent = ref(false);

    const sendingWalletAccount = computed(() => {
      if (props.firstWallet.accounts[0].balance.raw !== '0') {
        return props.firstWallet.accounts[0];
      }
      return props.secondWallet.accounts[0];
    });

    const canSendNano = computed(() => {
      return (
        isValidNanoAddress.value &&
        sendingWalletAccount.value.balance.raw !== '0' &&
        !sendingNano.value &&
        !nanoSuccessfullySent.value
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

    const onSendNano = () => {
      sendingNano.value = true;
      nanoClient
        .send(
          sendingWalletAccount.value,
          receivingNanoAddress.value,
          sendingWalletAccount.value.balance
        )
        .then((accountAfterSend) => {
          sendingNano.value = false;
          if (accountAfterSend.error && accountAfterSend.error != null) {
            ElMessage({
              message: 'Error sending Nano to address provided',
              type: 'error',
            });
            return;
          }
          nanoSuccessfullySent.value = true;
          emitter.emit('step-completed', 'third');
        });
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

    return {
      receivingNanoAddress,
      onSendNano,
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
    };
  },
};
</script>

<style scoped>
.sendNanoForm {
  width: auto;
  display: inline-flex;
  justify-content: center;
}

.nanoAddressInput {
  display: inline-flex;
  min-width: 500px;
}

.validNanoAddressLabel {
  display: none;
  font-size: 95%;
  font-weight: 500;
  text-align: left;
  margin: -8px auto 0px 16px;
}
</style>
