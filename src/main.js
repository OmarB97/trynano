import { createApp } from 'vue';
import { VueClipboard } from '@soerenmartius/vue3-clipboard';
import mitt from 'mitt';
import NanoApp from './NanoApp.vue';
import installElementPlus from './plugins/element';
import '../node_modules/hover.css';

const app = createApp(NanoApp);
installElementPlus(app);

const emitter = mitt();
app.config.globalProperties.emitter = emitter;

app.use(VueClipboard).mount('#app');
