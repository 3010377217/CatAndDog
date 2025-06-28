"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const stores_user = require("../../stores/user.js");
const _sfc_main = {
  __name: "My",
  setup(__props) {
    common_vendor.ref("daily");
    const services = common_vendor.ref([
      {
        id: "exchange",
        name: "兑换中心",
        icon: "/static/icons/Exchange.png"
      },
      {
        id: "feedback",
        name: "问题反馈",
        icon: "/static/icons/Feedback.png"
      },
      {
        id: "join",
        name: "加盟咨询",
        icon: "/static/icons/Join.png"
      },
      {
        id: "about",
        name: "关于我们",
        icon: "/static/icons/AboutUs.png"
      }
    ]);
    const userStore = stores_user.useUserStore();
    const { isLogin, userInfo } = common_vendor.storeToRefs(userStore);
    const getUserInfo = () => {
      return new Promise((resolve, reject) => {
        common_vendor.index.__f__("log", "at pages/My/My.vue:216", "【getUserInfo】进入微信小程序环境，准备调用wx.getUserProfile");
        common_vendor.wx$1.getUserProfile({
          lang: "zh_CN",
          desc: "用于完善会员资料",
          success: (res) => {
            common_vendor.index.__f__("log", "at pages/My/My.vue:221", "【getUserInfo】wx.getUserProfile调用成功", res);
            if (res.userInfo) {
              common_vendor.index.__f__("log", "at pages/My/My.vue:223", "【getUserInfo】昵称:", res.userInfo.nickName, "头像URL:", res.userInfo.avatarUrl);
            }
            resolve(res.userInfo);
          },
          fail: (err) => {
            common_vendor.index.__f__("log", "at pages/My/My.vue:228", "【getUserInfo】wx.getUserProfile调用失败", err);
            reject(err);
          }
        });
      });
    };
    const getLogin = () => {
      return new Promise((resolve, reject) => {
        common_vendor.wx$1.login({
          success(res) {
            resolve(res.code);
          },
          fail: (err) => {
            reject(err);
          }
        });
      });
    };
    const handleLogin = async () => {
      if (isLogin.value) {
        common_vendor.index.showToast({ title: "您已登录", icon: "none" });
        return;
      }
      const now = Date.now();
      if (now - lastClickTime.value < 500)
        return;
      lastClickTime.value = now;
      if (loginLoading.value)
        return;
      loginLoading.value = true;
      try {
        const [userInfo2, code] = await Promise.all([getUserInfo(), getLogin()]);
        const res = await common_vendor.nr.callFunction({
          name: "user-login",
          data: {
            code,
            userInfo: {
              nickName: userInfo2.nickName,
              avatarUrl: userInfo2.avatarUrl
            }
          }
        });
        const result = res.result;
        if (result.code === 0) {
          await userStore.login({
            ...userInfo2,
            ...result.data.userInfo,
            token: result.data.token
          });
          common_vendor.index.showToast({ title: "登录成功", icon: "success" });
        } else {
          common_vendor.index.showToast({ title: result.message || "登录失败", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/My/My.vue:303", "登录失败:", error);
        let errMsg = "登录失败";
        if (error.message && error.message.includes("url not in domain list")) {
          errMsg = "请配置云函数域名\\n小程序后台->开发设置->服务器域名";
        }
        common_vendor.index.showModal({
          title: "提示",
          content: errMsg,
          showCancel: false
        });
      } finally {
        loginLoading.value = false;
      }
    };
    const loginLoading = common_vendor.ref(false);
    const lastClickTime = common_vendor.ref(0);
    const goToProfile = () => {
      common_vendor.index.navigateTo({
        url: "/pages/My/profile/index"
      });
    };
    common_vendor.onMounted(async () => {
      await userStore.checkLoginStatus();
    });
    const handleCellClick = (type) => {
      if (!isLogin.value) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
        return;
      }
      switch (type) {
        case "profile":
          common_vendor.index.navigateTo({
            url: "/pages/My/profile/index"
          });
          break;
        case "address":
          common_vendor.index.navigateTo({
            url: "/pages/My/address/index"
          });
          break;
        case "posts":
          common_vendor.index.navigateTo({
            url: "/pages/My/posts/index"
          });
          break;
        case "favorites":
          common_vendor.index.navigateTo({
            url: "/pages/My/favorites/index"
          });
          break;
        case "promotion":
          common_vendor.index.navigateTo({
            url: "/pages/My/promotion/index"
          });
          break;
        case "exchange":
          common_vendor.index.navigateTo({
            url: "/pages/My/exchange/index"
          });
          break;
        case "feedback":
          common_vendor.index.navigateTo({
            url: "/pages/My/feedback/index"
          });
          break;
        case "join":
          common_vendor.index.navigateTo({
            url: "/pages/My/join/index"
          });
          break;
        case "about":
          common_vendor.index.navigateTo({
            url: "/pages/My/about/index"
          });
          break;
        case "orders":
          common_vendor.index.navigateTo({
            url: "/pages/Order/index"
          });
          break;
        case "pending-payment":
          common_vendor.index.navigateTo({
            url: "/pages/Order/index?status=pending-payment"
          });
          break;
        case "pending-delivery":
          common_vendor.index.navigateTo({
            url: "/pages/Order/index?status=pending-delivery"
          });
          break;
        case "pending-receipt":
          common_vendor.index.navigateTo({
            url: "/pages/Order/index?status=pending-receipt"
          });
          break;
        case "after-sale":
          common_vendor.index.navigateTo({
            url: "/pages/Order/index?status=after-sale"
          });
          break;
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !common_vendor.unref(isLogin)
      }, !common_vendor.unref(isLogin) ? {
        b: common_assets._imports_0$4,
        c: common_vendor.o(handleLogin),
        d: common_vendor.o(handleLogin)
      } : {
        e: common_vendor.unref(userInfo).avatarUrl || "/static/logo.png",
        f: common_vendor.t(common_vendor.unref(userInfo).nickName),
        g: common_vendor.o(goToProfile),
        h: common_vendor.t(common_vendor.unref(userInfo).points || 0),
        i: common_vendor.t(common_vendor.unref(userInfo).coupons || 0),
        j: common_vendor.t(common_vendor.unref(userInfo).giftCards || 0),
        k: common_vendor.o(($event) => handleCellClick("orders")),
        l: common_assets._imports_1$2,
        m: common_vendor.o(($event) => handleCellClick("pending-payment")),
        n: common_assets._imports_2,
        o: common_vendor.o(($event) => handleCellClick("pending-delivery")),
        p: common_assets._imports_3,
        q: common_vendor.o(($event) => handleCellClick("pending-receipt")),
        r: common_assets._imports_4,
        s: common_vendor.o(($event) => handleCellClick("after-sale"))
      }, {
        t: common_assets._imports_5,
        v: common_vendor.o(($event) => handleCellClick("profile")),
        w: common_assets._imports_6,
        x: common_vendor.o(($event) => handleCellClick("address")),
        y: common_assets._imports_7,
        z: common_vendor.o(($event) => handleCellClick("posts")),
        A: common_assets._imports_8,
        B: common_vendor.o(($event) => handleCellClick("favorites")),
        C: common_assets._imports_9,
        D: common_vendor.o(($event) => handleCellClick("promotion")),
        E: common_vendor.f(services.value, (service, k0, i0) => {
          return {
            a: service.icon,
            b: common_vendor.t(service.name),
            c: service.id,
            d: common_vendor.o(($event) => handleCellClick(service.id), service.id)
          };
        }),
        F: common_vendor.gei(_ctx, "")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8f9a99c0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/My/My.js.map
