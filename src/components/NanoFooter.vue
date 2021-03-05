/* eslint-disable no-unused-vars */
<template>
  <footer class="footer">
    <div style="display: block">
      <span class="footer-content">
        Created by
        <a href="https://www.linkedin.com/in/omarbaradei/" target="_blank">Omar Baradei</a
        >.
      </span>
      <span class="footer-content">
        Link to
        <a href="https://github.com/OmarB97/trynano" target="_blank">GitHub</a>.
      </span>
      <span class="footer-content">
        Icons made by
        <a href="https://www.freepik.com" title="Freepik" target="_blank">Freepik</a>
        from
        <a href="https://www.flaticon.com/" title="Flaticon" target="_blank"
          >www.flaticon.com</a
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
</style>
