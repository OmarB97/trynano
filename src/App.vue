<template>
  <NanoIntro @revealFaucetInfoClicked="handleRevealFaucetInfoClicked"></NanoIntro>
  <transition name="fade-in-down">
    <div v-show="didRevealFaucetInfo">
      <NanoFaucetInfo
        :firstWalletData="firstWalletData"
        @revealDemoClicked="didRevealDemo = true"
      ></NanoFaucetInfo>
    </div>
  </transition>
  <transition name="fade-in-down">
    <div v-show="didRevealDemo">
      <NanoDemo></NanoDemo>
    </div>
  </transition>
  <div id="footer">
    <div>
      Created by <a href="https://www.linkedin.com/in/omarbaradei/">Omar Baradei</a>
    </div>
    <div>
      Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from
      <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import NanoIntro from './components/NanoIntro.vue';
import NanoFaucetInfo from './components/NanoFaucetInfo.vue';
import NanoDemo from './components/demo/NanoDemo.vue';

export default {
  name: 'App',
  components: {
    NanoIntro,
    NanoFaucetInfo,
    NanoDemo,
  },
  data() {
    return {};
  },
  setup() {
    const didRevealFaucetInfo = ref(false);
    const didRevealDemo = ref(false);
    const firstWalletData = ref({ address: '', amount: 0 });
    const handleRevealFaucetInfoClicked = () => {
      didRevealFaucetInfo.value = true;
      firstWalletData.value.address = 'nano_12345';
    };

    return {
      didRevealFaucetInfo,
      didRevealDemo,
      firstWalletData,
      handleRevealFaucetInfoClicked,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#footer {
  font-size: small;
  bottom: 0;
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
}

a {
  color: #2c3e50;
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.fade-in-down-enter-active {
  transition: all 0.4s ease-out;
}

.fade-in-down-enter-from {
  transform: translatey(-20px);
  opacity: 0;
}
</style>
