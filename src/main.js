import { createApp } from "vue";
import { VueClipboard } from "@soerenmartius/vue3-clipboard";
import mitt from "mitt";
// import { NanoClient } from "@nanobox/nano-client";
import { VueReCaptcha } from "vue-recaptcha-v3";
import VueMq from "vue3-mq";
import axios from "axios";
import VueAxios from "vue-axios";
import NanoApp from "./NanoApp.vue";
import installElementPlus from "./plugins/element";
import "../node_modules/hover.css";


const app = createApp(NanoApp);
installElementPlus(app);

const emitter = mitt();
app.config.globalProperties.emitter = emitter;

// const client = new NanoClient({
//   url: process.env.VUE_APP_NANO_API_URL, // Or any other node url
//   // Basic auth if the proxy requires this
//   credentials: {
//     username: process.env.VUE_APP_NANO_API_USERNAME,
//     password: process.env.VUE_APP_NANO_API_PASSWORD,
//   },
// });

// app.config.globalProperties.nanoClient = client;

// Set breakpoints for various devices
const vueMqConfig = {
  breakpoints: {
    phone: 450,
    tablet: 1250,
    other: Infinity,
  },
};

// axios config
axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL_LOCAL;
// axios.defaults.headers.common['Content-Type'] = 'text/plain';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// silence all Vue warns
app.config.warnHandler = () => null;

app
  .use(VueAxios, axios)
  .use(VueClipboard)
  .use(VueMq, vueMqConfig)
  .use(VueReCaptcha, { siteKey: process.env.VUE_APP_RECAPTCHA_SITE_KEY })
  .mount("#app");
