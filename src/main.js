import { createApp } from 'vue';
import App from './App.vue';
import installElementPlus from './plugins/element';
import '../node_modules/hover.css';

const app = createApp(App);
installElementPlus(app);
app.mount('#app');
