import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);

app.use(store);
app.use(router);
app.use(ElementPlus);
app.use(ElementPlusIconsVue);

// 将所有图标组件逐一全局注册 性能会比较低 需要时再注册
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.mount("#app");
