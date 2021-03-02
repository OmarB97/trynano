<template>
  <div class="intro">
    <img class="logo" src="../assets/trynano_full.png" />
    <h3>
      TryNano demonstrates how fast and simple Nano transactions are by giving you two
      wallets to send Nano back and forth between each other.
    </h3>
    <h5>
      <strong>What is Nano?</strong> Nano (NANO) is a peer-to-peer digital currency
      designed to provide instant transactions, zero fees, and scalability, all while
      being eco-friendly.
    </h5>
    <ClickToReveal
      :revealText="'Click here to try it out yourself!'"
      :clickable="true"
      :shouldBoldText="true"
      :sizeFactor="1"
      @revealClicked="handleRevealStepsClicked"
    ></ClickToReveal>
  </div>
</template>

<script>
import { ref } from 'vue';
import ClickToReveal from './common/ClickToReveal.vue';

export default {
  name: 'NanoIntro',
  components: { ClickToReveal },
  emits: ['revealStepsClicked'],
  setup(props, context) {
    const revealStepsClicked = ref(false);

    const handleRevealStepsClicked = () => {
      revealStepsClicked.value = true;
      context.emit('revealStepsClicked');
    };

    return { revealStepsClicked, handleRevealStepsClicked };
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

h3 {
  font-size: 1.2em;
  font-weight: 700;
}

h5 {
  font-size: 0.95em;
  font-weight: 400;
}
</style>
