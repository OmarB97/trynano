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
    <footer class="footer" id="footer2">
      <div style="display: block">
        <span class="footer-content">
          Created by
          <a href="https://www.linkedin.com/in/omarbaradei/" target="_blank"
            >Omar Baradei</a
          >.
        </span>
        <span class="footer-content">
          Link to
          <a href="https://github.com/OmarB97/trynano" target="_blank">Github</a>.
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
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, getCurrentInstance } from 'vue';
import NanoIntro from './components/NanoIntro.vue';
import NanoFaucetInfo from './components/NanoFaucetInfo.vue';
import NanoDemo from './components/demo/NanoDemo.vue';
import callWebsocket from './rpc/nano-ws';
import generateNanoWallets from './utils/nano';

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
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.site-content {
  margin-top: 60px;
}

html,
.flex-wrapper {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: space-between;
}

#footer2 {
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 0.85em;
  text-align: center; /* This line is not needed but centers your text */
  color: #999;
  background-color: #404040;
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

.footer-content {
  margin: 0 0.5rem;
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
