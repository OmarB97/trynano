import { createApp } from 'vue';
import { VueClipboard } from '@soerenmartius/vue3-clipboard';
import mitt from 'mitt';
import { NanoClient } from '@nanobox/nano-client';
import NanoApp from './NanoApp.vue';
import installElementPlus from './plugins/element';
import '../node_modules/hover.css';

const app = createApp(NanoApp);
installElementPlus(app);

const emitter = mitt();
app.config.globalProperties.emitter = emitter;

const client = new NanoClient({
  url: process.env.VUE_APP_NANO_API_URL, // Or any other node url
  // Basic auth if the proxy requires this
  credentials: {
    username: process.env.VUE_APP_NANO_API_USERNAME,
    password: process.env.VUE_APP_NANO_API_PASSWORD,
  },
});

app.config.globalProperties.nanoClient = client;

app.use(VueClipboard).mount('#app');
