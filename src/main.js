import { createApp } from 'vue';
import { VueClipboard } from '@soerenmartius/vue3-clipboard';
import App from './App.vue';
import installElementPlus from './plugins/element';
import '../node_modules/hover.css';

const app = createApp(App);
installElementPlus(app);

app.use(VueClipboard).mount('#app');
