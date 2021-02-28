<template>
  <el-dialog title="Give Feedback" v-model="isDialogVisible" width="40%">
    <el-form
      :model="ruleForm"
      class="form"
      ref="form"
      :rules="rules"
      status-icon
      label-width="120px"
    >
      <el-form-item label="Name" prop="name">
        <el-input v-model="name" name="name"></el-input>
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="email" name="email"></el-input>
      </el-form-item>
      <el-form-item label="Feedback Type">
        <el-radio-group v-model="feedbackType" name="type">
          <el-radio label="Bug"></el-radio>
          <el-radio label="Feature Request"></el-radio>
          <el-radio label="Other"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Message" prop="message">
        <el-input
          type="textarea"
          v-model="message"
          name="message"
          maxlength="500"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="hideFeedbackForm">Cancel</el-button>
        <el-button
          :disabled="name === '' || email === '' || message === ''"
          type="primary"
          @click="onSubmitFeedbackForm"
          >Confirm</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { ref, getCurrentInstance } from 'vue';
import emailjs from 'emailjs-com';
import { ElMessage } from 'element-plus';

export default {
  name: '',
  props: {
    feedbackDialogVisible: Boolean,
  },
  setup(props) {
    const { emitter } = getCurrentInstance().appContext.config.globalProperties;

    const isDialogVisible = ref(props.feedbackDialogVisible);

    const hideFeedbackForm = () => {
      emitter.emit('toggle-feedback-form-visibility', false);
    };

    emitter.on('toggle-feedback-form-visibility', (isVisible) => {
      isDialogVisible.value = isVisible;
    });

    const form = ref(null);

    const name = ref('');
    const email = ref('');
    const feedbackType = ref('Bug');
    const message = ref('');

    const ruleForm = ref({
      name,
      email,
      feedbackType,
      message,
    });

    const rules = ref({
      name: [{ required: true, message: 'Please enter a name', trigger: 'blur' }],
      email: [
        { required: true, message: 'Please enter an email', trigger: 'blur' },
        { type: 'email', message: 'Invalid email address', trigger: 'blur' },
      ],
      message: [
        { required: true, message: 'Please enter a message', trigger: 'blur' },
        { min: 10, message: 'Please enter more than 10 characters', trigger: 'blur' },
      ],
    });

    const onSubmitFeedbackForm = () => {
      try {
        form.value.validate((isValid) => {
          if (!isValid) {
            ElMessage({
              message: `Error submitting feedback, form was invalid`,
              type: 'error',
            });
            return;
          }
          hideFeedbackForm();
          emailjs
            .sendForm(
              process.env.VUE_APP_EMAILJS_SERVICE_KEY,
              process.env.VUE_APP_EMAILJS_TEMPLATE_KEY,
              '.form',
              process.env.VUE_APP_EMAILJS_USER_KEY
            )
            .then((response) => {
              if (response && response.status === 200) {
                ElMessage({
                  message: 'Feedback successfully sent!',
                  type: 'success',
                });

                // Reset form field
                name.value = '';
                email.value = '';
                feedbackType.value = 'Bug';
                message.value = '';
              } else {
                ElMessage({
                  message: `Error submitting feedback${
                    response.error !== null ? `: ${response.error}` : ''
                  }`,
                  type: 'error',
                });
              }
            });
        });
      } catch (error) {
        ElMessage({
          message: `Error submitting feedback: ${error}`,
          type: 'error',
        });
      }
    };

    return {
      isDialogVisible,
      hideFeedbackForm,
      onSubmitFeedbackForm,
      form,
      ruleForm,
      rules,
      name,
      email,
      feedbackType,
      message,
    };
  },
};
</script>
<style lang=""></style>
