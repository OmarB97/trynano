import { createApp } from 'vue';
import { VueClipboard } from '@soerenmartius/vue3-clipboard';
import mitt from 'mitt';
import App from './App.vue';
import installElementPlus from './plugins/element';
import '../node_modules/hover.css';

const app = createApp(App);
installElementPlus(app);

const emitter = mitt();
app.config.globalProperties.emitter = emitter;

app.use(VueClipboard).mount('#app');
