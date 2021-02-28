<template>
  <div class="resources">
    <h3 class="headline">&#127881; Thanks for using TryNano! &#127881;</h3>
    <div>
      For a comprehensive list of resources related to Nano including the core team,
      social media channels, where to buy Nano, and more, please visit
      <a href="https://nanolinks.info/" target="_blank">nanolinks.info</a>.
    </div>
    <div class="donation">
      If you liked this experience, please consider donating to me at
      <a
        class="nano-address"
        href="https://nanocrawler.cc/explorer/account/nano_17yrgm818r4348g4r61oc7x3w6nd68ji85686d5xo3nt455znb65zafaofrq/history"
        target="_blank"
        >nano_17yrgm818r4348g4r61oc7x3w6nd68ji85686d5xo3nt455znb65zafaofrq</a
      >
      to help keep the website up and running!
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style>
.resources {
  width: 95%;
  margin: auto;
}

.headline {
  margin-bottom: 30px;
}

.nano-address {
  font-weight: 600;
  color: #000;
}

.donation {
  margin: 20px auto;
  font-size: 85%;
}

.donation::after {
  content: '❤️';
}
</style>
