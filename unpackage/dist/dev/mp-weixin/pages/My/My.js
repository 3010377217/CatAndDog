"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "My",
  setup(__props) {
    common_vendor.ref("我的页面");
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_vendor.f(5, (item, k0, i0) => {
          return {
            a: item
          };
        }),
        c: common_assets._imports_0
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8f9a99c0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/My/My.js.map
