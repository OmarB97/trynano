<template>
  <div class="resources">
    <h3 class="headline">&#127881; {{ t('nanoResources.title') }} &#127881;</h3>
    <i18n-t keypath="nanoResources.firstSentence.main" tag="div">
      <a href="https://nanolinks.info/" target="_blank">{{
        t('nanoResources.firstSentence.nanoLinksUrl')
      }}</a>
    </i18n-t>
    <i18n-t keypath="nanoResources.secondSentence.main" tag="div" class="donation">
      <a
        class="nano-address"
        :class="{
          'nano-address-phone': $mq === 'phone',
          'nano-address-tabletSm': $mq === 'tabletS,',
          'nano-address-tablet': $mq === 'tablet',
        }"
        href="https://nanocrawler.cc/explorer/account/nano_17yrgm818r4348g4r61oc7x3w6nd68ji85686d5xo3nt455znb65zafaofrq/history"
        target="_blank"
        >nano_17yrgm818r4348g4r61oc7x3w6nd68ji85686d5xo3nt455znb65zafaofrq</a
      >
      <a
        class="nano-address"
        :class="{
          'nano-address-phone': $mq === 'phone',
          'nano-address-tabletSm': $mq === 'tabletSm',
          'nano-address-tablet': $mq === 'tablet',
        }"
        href="https://nanocrawler.cc/explorer/account/nano_3fb56gt1896wmzfrs78oowdjwed9arm1mugtg48eupewfnuq4io1gfjors5j/history"
        target="_blank"
        >nano_3fb56gt1896wmzfrs78oowdjwed9arm1mugtg48eupewfnuq4io1gfjors5j</a
      >
    </i18n-t>
  </div>
</template>
<script>
import { useI18n } from 'vue-i18n';

export default {
  name: 'NanoResources',
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    return { t };
  },
};
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

.nano-address-phone,
.nano-address-tabletSm,
.nano-address-tablet {
  overflow-wrap: break-word;
}

.donation {
  margin: 20px auto;
  font-size: 85%;
}

.donation::after {
  content: '❤️';
}
</style>
