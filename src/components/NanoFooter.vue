/* eslint-disable no-unused-vars */
<template>
  <footer
    class="footer"
    :class="{
      'footer-phone': $mq === 'phone',
      'footer-small': $mq === 'phone' || $mq === 'tabletSm',
      'footer-normal': $mq === 'tablet' || $mq === 'other',
    }"
  >
    <div
      :class="{
        'footer-small': $mq === 'phone' || $mq === 'tabletSm',
        'footer-normal': $mq === 'tablet' || $mq === 'other',
      }"
    >
      <i18n-t keypath="nanoFooter.createdBy.main" tag="span" class="footer-content">
        <a href="https://www.linkedin.com/in/omarbaradei/" target="_blank">{{
          t('nanoFooter.createdBy.omar')
        }}</a>
        <a href="https://www.linkedin.com/in/patricssss/" target="_blank">{{
          t('nanoFooter.createdBy.patrick')
        }}</a>
      </i18n-t>
      <i18n-t keypath="nanoFooter.github.main" tag="span" class="footer-content">
        <a href="https://github.com/OmarB97/trynano" target="_blank">{{
          t('nanoFooter.github.url')
        }}</a>
      </i18n-t>
      <i18n-t keypath="nanoFooter.faucet" tag="span" class="footer-content">
        <a
          href="https://nanocrawler.cc/explorer/account/nano_3fb56gt1896wmzfrs78oowdjwed9arm1mugtg48eupewfnuq4io1gfjors5j/history"
          target="_blank"
          :class="{ 'footer-content-phone': $mq === 'phone' || $mq === 'tabletSm' }"
          >nano_3fb56gt1896wmzfrs78oowdjwed9arm1mugtg48eupewfnuq4io1gfjors5j</a
        >
      </i18n-t>
      <i18n-t keypath="nanoFooter.tips" tag="span" class="footer-content">
        <a
          href="https://nanocrawler.cc/explorer/account/nano_17yrgm818r4348g4r61oc7x3w6nd68ji85686d5xo3nt455znb65zafaofrq/history"
          target="_blank"
          :class="{ 'footer-content-phone': $mq === 'phone' || $mq === 'tabletSm' }"
          >nano_17yrgm818r4348g4r61oc7x3w6nd68ji85686d5xo3nt455znb65zafaofrq</a
        >
      </i18n-t>
      <div
        :class="{
          'footer-small': $mq === 'phone' || $mq === 'tabletSm',
          'footer-normal': $mq === 'tablet' || $mq === 'other',
        }"
      >
        <i18n-t keypath="nanoFooter.feedback.main" tag="span" class="footer-content">
          <a class="feedback-link" @click="toggleFeedbackDialogVisibility(true)">{{
            t('nanoFooter.feedback.feedbackLink')
          }}</a>
        </i18n-t>
        <i18n-t keypath="nanoFooter.recaptcha.main" tag="span" class="footer-content">
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            :class="{ 'footer-content-phone': $mq === 'phone' || $mq === 'tabletSm' }"
            >{{ t('nanoFooter.recaptcha.policy') }}</a
          >
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            :class="{ 'footer-content-phone': $mq === 'phone' || $mq === 'tabletSm' }"
            >{{ t('nanoFooter.recaptcha.tos') }}</a
          >
        </i18n-t>
      </div>
      <div class="feedback-form">
        <FeedbackForm
          :feedbackDialogVisible="feedbackDialogVisible"
          @hideFeedbackForm="toggleFeedbackDialogVisibility(false)"
        ></FeedbackForm>
      </div>
    </div>
  </footer>
</template>

<script>
import { ref, getCurrentInstance } from 'vue';
import { useI18n } from 'vue-i18n';
import FeedbackForm from './FeedbackForm.vue';

export default {
  name: 'NanoFooter',
  components: {
    FeedbackForm,
  },
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const { emitter } = getCurrentInstance().appContext.config.globalProperties;

    const feedbackDialogVisible = ref(false);

    const toggleFeedbackDialogVisibility = (isVisible) => {
      emitter.emit('toggle-feedback-form-visibility', isVisible);
    };

    emitter.on('toggle-feedback-form-visibility', (isVisible) => {
      feedbackDialogVisible.value = isVisible;
    });

    return {
      t,
      feedbackDialogVisible,
      toggleFeedbackDialogVisibility,
    };
  },
};
</script>

<style>
.footer {
  width: 100vw;
  padding: 1rem 1.5rem;
  font-size: 0.85em;
  color: #999;
  background-color: #404040;
  box-sizing: border-box;
  margin-bottom: -5px;
}

.footer-phone {
  font-size: 85%;
}

.footer-small {
  text-align: left;
  display: flex;
  flex-direction: column;
  line-height: 2.6;
}

.footer-normal {
  text-align: center;
  display: inline-block;
  line-height: 2;
}

.footer-content {
  margin: 0 0.5rem;
}

.feedback-link:hover {
  cursor: pointer;
}

.footer-content-phone {
  overflow-wrap: break-word;
  max-width: 100%;
}

.feedback-form {
  text-align: center;
}
</style>
