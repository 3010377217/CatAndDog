"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/Index/Index.js";
  "./pages/Shops/Shops.js";
  "./pages/Evaluate/Evaluate.js";
  "./pages/Forum/Forum.js";
  "./pages/Forum/Detail.js";
  "./pages/Forum/Post.js";
  "./pages/Forum/SearchResult.js";
  "./pages/My/My.js";
  "./pages/My/profile/index.js";
  "./pages/My/address/index.js";
  "./pages/My/address/edit.js";
  "./pages/My/posts/index.js";
  "./pages/My/favorites/index.js";
  "./pages/My/promotion/index.js";
  "./pages/My/exchange/index.js";
  "./pages/My/feedback/index.js";
  "./pages/My/join/index.js";
  "./pages/My/about/index.js";
  "./pages/Shops/Search.js";
  "./pages/Shops/SearchResult.js";
  "./pages/Shops/Order/Order.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:7", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:10", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  const pinia = common_vendor.createPinia();
  app.use(pinia);
  app.use(common_vendor.uviewPlus);
  return {
    app,
    pinia
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
