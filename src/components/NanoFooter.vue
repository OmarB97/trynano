/* eslint-disable no-unused-vars */
<template>
  <footer class="footer" id="footer2">
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
          >nano_17yrgm818r4348g4r61oc7x3w6nd68ji85686d5xo3nt455znb65zafaofrq</a
        >.
      </span>
      <span class="footer-content">
        Give feedback
        <a class="feedback-link" @click="feedbackDialogVisible = true">here</a>.
      </span>
      <el-dialog title="Give Feedback" v-model="feedbackDialogVisible" width="40%">
        <el-form class="form" label-width="120px">
          <el-form-item label="Name">
            <el-input v-model="name" name="name"></el-input>
          </el-form-item>
          <el-form-item label="Email">
            <el-input v-model="email" name="email"></el-input>
          </el-form-item>
          <el-form-item label="Feedback Type">
            <el-radio-group v-model="feedbackType" name="type">
              <el-radio label="Bug"></el-radio>
              <el-radio label="Feature Request"></el-radio>
              <el-radio label="Other"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Message">
            <el-input type="textarea" v-model="message" name="message"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="feedbackDialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="onSubmitFeedbackForm">Confirm</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </footer>
</template>

<script>
import { ref } from 'vue';
import emailjs from 'emailjs-com';
import { ElMessage } from 'element-plus';

export default {
  name: 'NanoFooter',
  setup() {
    const feedbackDialogVisible = ref(false);

    const name = ref('');
    const email = ref('');
    const feedbackType = ref('Bug');
    const message = ref('');

    const onSubmitFeedbackForm = () => {
      console.log(name.value);
      console.log(email.value);
      console.log(feedbackType.value);
      console.log(message.value);
      console.log('feedback form submit click!');
      feedbackDialogVisible.value = false;
      try {
        emailjs
          .sendForm(
            process.env.VUE_APP_EMAILJS_SERVICE_KEY,
            process.env.VUE_APP_EMAILJS_TEMPLATE_KEY,
            '.form',
            process.env.VUE_APP_EMAILJS_USER_KEY
          )
          .then((response) => {
            console.log(response);
            if (response && response.status === 200) {
              ElMessage({
                message: 'Feedback successfully sent!',
                type: 'success',
              });
            } else {
              ElMessage({
                message: `Error submitting feedback${
                  response.error !== null ? `: ${response.error}` : ''
                }`,
                type: 'error',
              });
            }
          });
      } catch (error) {
        ElMessage({
          message: `Error submitting feedback: ${error}`,
          type: 'error',
        });
      }
      // Reset form field
      name.value = '';
      email.value = '';
      feedbackType.value = 'Bug';
      message.value = '';
    };

    return {
      feedbackDialogVisible,
      onSubmitFeedbackForm,
      name,
      email,
      feedbackType,
      message,
    };
  },
};
</script>

<style scoped>
#footer2 {
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 0.85em;
  text-align: center; /* This line is not needed but centers your text */
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
</style>
