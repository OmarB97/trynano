<template>
  <el-dialog
    :title="t('feedbackForm.title')"
    v-model="isDialogVisible"
    :width="dialogWidth"
  >
    <el-form
      :model="ruleForm"
      class="form"
      ref="form"
      :rules="rules"
      status-icon
      label-width="120px"
    >
      <el-form-item :label="t('feedbackForm.name.label')" prop="name">
        <el-input v-model="name" name="name"></el-input>
      </el-form-item>
      <el-form-item :label="t('feedbackForm.email.label')" prop="email">
        <el-input v-model="email" name="email"></el-input>
      </el-form-item>
      <el-form-item :label="t('feedbackForm.feedbackType.label')">
        <el-radio-group v-model="feedbackType" name="feedback_type">
          <el-radio
            :label="t('feedbackForm.feedbackType.type.bug')"
            name="feedback_type"
          ></el-radio>
          <el-radio
            :label="t('feedbackForm.feedbackType.type.featureRequest')"
            name="feedback_type"
          ></el-radio>
          <el-radio
            :label="t('feedbackForm.feedbackType.type.other')"
            name="feedback_type"
          ></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="t('feedbackForm.message.label')" prop="message">
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
        <el-button @click="hideFeedbackForm">{{
          t('feedbackForm.buttons.cancel')
        }}</el-button>
        <el-button
          :disabled="name === '' || email === '' || message === ''"
          type="primary"
          @click="onSubmitFeedbackForm"
          >{{ t('feedbackForm.buttons.confirm') }}</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { ref, getCurrentInstance } from 'vue';
import { useI18n } from 'vue-i18n';
import emailjs from 'emailjs-com';
import { ElMessage } from 'element-plus';

export default {
  name: 'FeedbackForm',
  props: {
    feedbackDialogVisible: Boolean,
  },
  computed: {
    dialogWidth() {
      switch (this.$mq) {
        case 'phone':
          return '95%';
        case 'tablet':
          return '80%';
        case 'other':
          return '40%';
        default:
          return '40%';
      }
    },
  },
  setup(props) {
    const { t } = useI18n({ useScope: 'global' });
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
    const feedbackType = ref(t('feedbackForm.feedbackType.type.bug'));
    const message = ref('');

    const ruleForm = ref({
      name,
      email,
      feedbackType,
      message,
    });

    const rules = ref({
      name: [{ required: true, message: t('feedbackForm.name.rule'), trigger: 'blur' }],
      email: [
        {
          required: true,
          message: t('feedbackForm.email.rules.required'),
          trigger: 'blur',
        },
        { type: 'email', message: t('feedbackForm.email.rules.email'), trigger: 'blur' },
      ],
      message: [
        {
          required: true,
          message: t('feedbackForm.message.rules.required'),
          trigger: 'blur',
        },
        { min: 10, message: t('feedbackForm.message.rules.min'), trigger: 'blur' },
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
                feedbackType.value = t('feedbackForm.feedbackType.type.bug');
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
      t,
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
