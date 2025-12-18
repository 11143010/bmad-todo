import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import { initDB } from "./modules/db";
import { initPWA } from "./modules/pwa";

const init = async () => {
  initPWA();
  await initDB();

  const app = createApp(App);
  app.use(createPinia());
  app.mount("#app");
};

init();
