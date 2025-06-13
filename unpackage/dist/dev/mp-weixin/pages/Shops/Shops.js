"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "Shops",
  setup(__props) {
    const title = common_vendor.ref("点单页面");
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(title.value)
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Shops/Shops.js.map
