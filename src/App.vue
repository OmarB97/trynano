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
  <div id="footer2">
    <div style="display: block">
      <span class="footer-content">
        Created by
        <a href="https://www.linkedin.com/in/omarbaradei/" target="_blank">Omar Baradei</a
        >.
      </span>
      <span class="footer-content">
        Link to
        <a href="https://github.com/OmarB97/trynano" target="_blank">Github</a>.
      </span>
      <span class="footer-content">
        Icons made by
        <a href="https://www.freepik.com" title="Freepik" target="_blank">Freepik</a> from
        <a href="https://www.flaticon.com/" title="Flaticon" target="_blank"
          >www.flaticon.com</a
        >.
      </span>
      <span class="footer-content">
        Tips are accepted at:
        <a
          href="https://nanocrawler.cc/explorer/account/nano_17yrgm818r4348g4r61oc7x3w6nd68ji85686d5xo3nt455znb65zafaofrq/history"
          target="_blank"
          >nano_17yrgm818r4348g4r61oc7x3w6nd68ji85686d5xo3nt455znb65zafaofrq</a
        >.
      </span>
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
  position: fixed;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2px;
}

#footer2 {
  font-size: 0.85em;
  width: 100%;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0px;
  padding: 1rem 1.5rem;
  text-align: center; /* This line is not needed but centers your text */
  color: #999;
  background-color: #404040;
}

a {
  text-decoration: none;
  color: #141337;
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
