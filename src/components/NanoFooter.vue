/* eslint-disable no-unused-vars */
<template>
  <footer class="footer">
    <div style="display: block">
      <span class="footer-content">
        Created by
        <a href="https://www.linkedin.com/in/omarbaradei/" target="_blank"
          >Omar Baradei</a
        >
        and <a href="https://www.reddit.com/u/miri1299/" target="_blank">u/miri1299</a>.
      </span>
      <span class="footer-content">
        Link to
        <a href="https://github.com/OmarB97/trynano" target="_blank">GitHub</a>.
      </span>
      <span class="footer-content">
        Donate to the TryNano Faucet:
        <a
          href="https://nanocrawler.cc/explorer/account/nano_1r71ir93w6ymq9bmjbbz7zmqngj54uhgcdjgrjzcpk5bog3rs5t7ijh47y7w/history"
          target="_blank"
          :class="{ 'footer-content-phone': $mq === 'phone' }"
          >nano_1r71ir93w6ymq9bmjbbz7zmqngj54uhgcdjgrjzcpk5bog3rs5t7ijh47y7w</a
        >.
      </span>
      <span class="footer-content">
        Tips accepted at:
        <a
          href="https://nanocrawler.cc/explorer/account/nano_17yrgm818r4348g4r61oc7x3w6nd68ji85686d5xo3nt455znb65zafaofrq/history"
          target="_blank"
          :class="{ 'footer-content-phone': $mq === 'phone' }"
          >nano_17yrgm818r4348g4r61oc7x3w6nd68ji85686d5xo3nt455znb65zafaofrq</a
        >.
      </span>
      <span class="footer-content">
        Give feedback
        <a class="feedback-link" @click="toggleFeedbackDialogVisibility(true)">here</a>.
      </span>
      <div class="footer-content recaptcha-disclaimer">
        This site is protected by reCAPTCHA and the
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          :class="{ 'footer-content-phone': $mq === 'phone' }"
          >Google Privacy Policy</a
        >
        and
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          :class="{ 'footer-content-phone': $mq === 'phone' }"
          >Terms of Service</a
        >
        apply.
      </div>
      <FeedbackForm
        :feedbackDialogVisible="feedbackDialogVisible"
        @hideFeedbackForm="toggleFeedbackDialogVisibility(false)"
      ></FeedbackForm>
    </div>
  </footer>
</template>

<script>
import { ref, getCurrentInstance } from 'vue';
import FeedbackForm from './FeedbackForm.vue';

export default {
  name: 'NanoFooter',
  components: {
    FeedbackForm,
  },
  setup() {
    const { emitter } = getCurrentInstance().appContext.config.globalProperties;

    const feedbackDialogVisible = ref(false);

    const toggleFeedbackDialogVisibility = (isVisible) => {
      emitter.emit('toggle-feedback-form-visibility', isVisible);
    };

    emitter.on('toggle-feedback-form-visibility', (isVisible) => {
      feedbackDialogVisible.value = isVisible;
    });

    return {
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
  text-align: center;
  color: #999;
  background-color: #404040;
  box-sizing: border-box;
  margin-bottom: -5px;
}

.footer-content {
  margin: 0 0.5rem;
  line-height: 2;
}

.feedback-link:hover {
  cursor: pointer;
}

.footer-content-phone {
  overflow-wrap: break-word;
  max-width: 100%;
}

/* .recaptcha-disclaimer {
  margin-top: 7px;
  margin-bottom: -5px;
} */
</style>
