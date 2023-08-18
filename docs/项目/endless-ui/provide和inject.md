# 使用依赖注入进行 Topnav 点击切换
## 场景
- 在 APP.vue 里面有两个组件 Topnav 和 Aside，需要在 Topnav 通过点击切换 `asideVisible` 的值来显示和隐藏 Aside，同时只有在移动端才显示此切换按钮，否则 `asideVisible` 默认为 false，Aside 一直显示。

- `asideVisible` 不能放到 Topnav 里，因为这样 Aside 就访问不到，所以需要放在它们公共的父级组件中，通过 `Provide / Inject` 组合提供给所以 App.vue 的后代元素使用。
- 
```ts
// App.vue
import { ref, provide } from "vue";
import { router } from "./router";

export default {
  name: "App",
  setup() {
    const width = document.documentElement.clientWidth;
    const asideVisible = ref(width > 500);
    provide("asideVisible", asideVisible);
    router.afterEach(() => {
      if (width <= 500) {
        asideVisible.value = false;
      }
    });
  },
};
```
```ts
// Aside.vue
import Topnav from "../components/Topnav.vue";
import {inject, Ref} from "vue";

export default {
  components: {Topnav},
  setup() {
    const asideVisible = inject<Ref<boolean>>("asideVisible");
    return {asideVisible};
  },
};
```
```ts
// Topnav.vue
import { inject, Ref } from "vue";

export default {
  props: {
    toggleMenuButtonVisible: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const asideVisible = inject<Ref<boolean>>("asideVisible");
    const toggleAside = () => {
      asideVisible.value = !asideVisible.value;
    };
    return { toggleAside };
  },
};
```
