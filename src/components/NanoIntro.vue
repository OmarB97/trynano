<template>
  <div
    class="intro"
    :class="{
      'intro-phone': $mq === 'phone',
    }"
  >
    <img
      class="logo"
      :class="{
        'logo-phone': $mq === 'phone',
        'logo-normal': $mq !== 'phone',
      }"
      src="../assets/trynano_full.png"
    />
    <h3
      :class="{
        'first-sentence-sm': $mq === 'phone' || $mq === 'tabletSm',
        'first-sentence-lg': $mq === 'other' || $mq === 'tablet',
      }"
    >
      {{ t('nanoIntro.firstSentence') }}
    </h3>
    <i18n-t
      keypath="nanoIntro.secondSentence.main"
      tag="h5"
      :class="{
        'second-sentence-sm': $mq === 'phone' || $mq === 'tabletSm',
        'second-sentence-lg': $mq === 'other' || $mq === 'tablet',
      }"
    >
      <strong>{{ t('nanoIntro.secondSentence.whatIsNano') }}</strong>
    </i18n-t>
    <ClickToReveal
      :revealText="t('nanoIntro.revealText')"
      :clickable="true"
      :shouldBoldText="true"
      :sizeFactor="1"
      @revealClicked="handleRevealStepsClicked"
    ></ClickToReveal>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ClickToReveal from './common/ClickToReveal.vue';

export default {
  name: 'NanoIntro',
  components: { ClickToReveal },
  emits: ['revealStepsClicked'],
  setup(props, context) {
    const { t } = useI18n({ useScope: 'global' });
    const revealStepsClicked = ref(false);

    const handleRevealStepsClicked = () => {
      revealStepsClicked.value = true;
      context.emit('revealStepsClicked');
    };

    return { t, revealStepsClicked, handleRevealStepsClicked };
  },
};
</script>

<style lang="css" scoped>
.intro {
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.intro-phone {
  font-size: 90%;
}

.logo {
  height: auto;
  width: auto;
}

.logo-phone {
  max-width: 250px;
  max-height: 250px;
  padding-bottom: 15px;
}

.logo-normal {
  max-width: 300px;
  max-height: 300px;
  padding-bottom: 25px;
}

h3 {
  font-size: 1.2em;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.1em;
}

h5 {
  font-size: 0.95em;
  font-weight: 400;
  align-self: center;
}

.first-sentence-lg {
  max-width: 75%;
}

.first-sentence-sm {
  max-width: 90%;
}

.second-sentence-lg {
  max-width: 65%;
}

.second-sentence-sm {
  max-width: 80%;
}
</style>
