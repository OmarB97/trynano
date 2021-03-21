import { createApp } from "vue";
import { VueClipboard } from "@soerenmartius/vue3-clipboard";
import mitt from "mitt";
import { VueReCaptcha } from "vue-recaptcha-v3";
import VueMq from "vue3-mq";
import axios from "axios";
import VueAxios from "vue-axios";
import { createI18n } from 'vue-i18n'
import NanoApp from "./NanoApp.vue";
import installElementPlus from "./plugins/element";
import "../node_modules/hover.css";
import translations from "./translations";

const app = createApp(NanoApp);
installElementPlus(app);

const emitter = mitt();
app.config.globalProperties.emitter = emitter;

// Set breakpoints for various devices
const vueMqConfig = {
  breakpoints: {
    phone: 450,
    tablet: 1250,
    other: Infinity,
  },
};

// axios config
axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// 2. Create i18n instance with options
const i18n = createI18n({
  legacy: false, // you must set `false`, to use Compostion API
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages: translations, // set locale messages
  // If you need to specify other options, you can set other options
  // ...
})

// silence all Vue warns
app.config.warnHandler = () => null;

app
  .use(VueAxios, axios)
  .use(VueClipboard)
  .use(VueMq, vueMqConfig)
  .use(VueReCaptcha, { siteKey: process.env.VUE_APP_RECAPTCHA_SITE_KEY })
  .use(i18n)
  .mount("#app");
