<template>
  <div class="intro">
    <img class="logo" src="../assets/nano_logo-removebg.png" />
    <h5>
      Nano (NANO) is a peer-to-peer digital currency designed to provide fast
      transactions, zero fees and a high level of scalability, all while being very
      eco-friendly.
    </h5>
    <ClickToReveal
      :revealText="'Click here to try it out yourself!'"
      :clickable="true"
      :shouldBoldText="true"
      :sizeFactor="1"
      @revealClicked="$emit('revealFaucetInfoClicked')"
    ></ClickToReveal>
  </div>
</template>

<script>
import ClickToReveal from './common/ClickToReveal.vue';

export default {
  name: 'NanoIntro',
  components: { ClickToReveal },
  emits: ['revealFaucetInfoClicked'],
  setup() {
    console.log('NanoIntro component setup');
  },
};
</script>

<style lang="css" scoped>
.intro {
  margin-bottom: 25px;
}

.logo {
  height: auto;
  width: auto;
  max-width: 300px;
  max-height: 300px;
  padding-bottom: 25px;
}

h5 {
  font-size: 0.95em;
  font-weight: 500;
}
</style>
