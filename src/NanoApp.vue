<template>
  <div class="flex-wrapper">
    <div class="site-content">
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
      <div class="push"></div>
    </div>
    <NanoFooter></NanoFooter>
  </div>
</template>

<script>
import { ref, getCurrentInstance } from 'vue';
import NanoIntro from './components/NanoIntro.vue';
import NanoFaucetInfo from './components/NanoFaucetInfo.vue';
import NanoFooter from './components/NanoFooter.vue';
import NanoDemo from './components/demo/NanoDemo.vue';
import callWebsocket from './rpc/nano-ws';
import generateNanoWallets from './utils/nano';

export default {
  name: 'NanoApp',
  components: {
    NanoIntro,
    NanoFaucetInfo,
    NanoDemo,
    NanoFooter,
  },
  setup() {
    const { emitter } = getCurrentInstance().appContext.config.globalProperties;

    const didRevealFaucetInfo = ref(false);
    const didRevealDemo = ref(false);

    const [firstWallet, secondWallet] = generateNanoWallets();

    const firstWalletData = ref(firstWallet);
    const secondWalletData = ref(secondWallet);

    const handleRevealFaucetInfoClicked = () => {
      didRevealFaucetInfo.value = true;
      console.log(firstWalletData.value);
      console.log(secondWalletData.value);
      callWebsocket(
        [firstWalletData.value.address, secondWalletData.value.address],
        emitter
      );
    };

    return {
      didRevealFaucetInfo,
      didRevealDemo,
      firstWalletData,
      secondWalletData,
      handleRevealFaucetInfoClicked,
    };
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0 auto;
}

.site-content {
  margin-top: 60px;
}

.flex-wrapper {
  display: flex;
  min-height: 100vh;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
}

a {
  text-decoration: none;
  color: #0000ee;
  font-weight: 600;
}

.footer-content > a {
  color: #e6e6e6;
  font-weight: 400;
}

a:hover {
  text-decoration: underline;
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
