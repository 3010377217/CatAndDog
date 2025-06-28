"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const stores_shop = require("../../stores/shop.js");
if (!Array) {
  const _easycom_u_swiper2 = common_vendor.resolveComponent("u-swiper");
  const _easycom_u_notice_bar2 = common_vendor.resolveComponent("u-notice-bar");
  const _easycom_u_popup2 = common_vendor.resolveComponent("u-popup");
  (_easycom_u_swiper2 + _easycom_u_notice_bar2 + _easycom_u_popup2)();
}
const _easycom_u_swiper = () => "../../node-modules/uview-plus/components/u-swiper/u-swiper.js";
const _easycom_u_notice_bar = () => "../../node-modules/uview-plus/components/u-notice-bar/u-notice-bar.js";
const _easycom_u_popup = () => "../../node-modules/uview-plus/components/u-popup/u-popup.js";
if (!Math) {
  (_easycom_u_swiper + _easycom_u_notice_bar + SpecPopup + _easycom_u_popup + GoodsDetailPopup)();
}
const SpecPopup = () => "../../components/SpecPopup.js";
const GoodsDetailPopup = () => "../../components/GoodsDetailPopup.js";
const _sfc_main = {
  __name: "Shops",
  setup(__props) {
    const cardCur = common_vendor.ref(0);
    const currentCategory = common_vendor.ref(0);
    const searchKeyword = common_vendor.ref("");
    const searchMode = common_vendor.ref(false);
    const scrollTimer = common_vendor.ref(null);
    const scrollIntoView = common_vendor.ref("");
    const bannerList = common_vendor.ref([
      "/static/picture/1.jpg",
      "/static/picture/2.jpg",
      "/static/picture/3.jpg",
      "/static/picture/4.jpg",
      "/static/picture/5.jpg"
    ]);
    const noticeList = common_vendor.ref([
      "欢迎光临本商城，满99元包邮！",
      "新品上市，全场8折优惠！",
      "宠物洗护专区：买二送一，快来抢购！",
      "点击商品卡片可查看详情哦！",
      "春节期间为运输高峰期，请耐心等待！"
    ]);
    common_vendor.onMounted(() => {
      cardCur.value = 0;
      loadShopData();
    });
    const loadShopData = async () => {
      common_vendor.index.__f__("log", "at pages/Shops/Shops.vue:195", "Shops.vue - 开始加载商品数据");
      try {
        await shopStore.fetchGoods(1, 100);
        common_vendor.index.__f__("log", "at pages/Shops/Shops.vue:199", "Shops.vue - 商品数据加载成功，商品数量:", goodsList.value.length);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/Shops/Shops.vue:201", "Shops.vue - 加载商品数据失败:", error);
        common_vendor.index.showToast({
          title: "加载商品失败，请重试",
          icon: "none"
        });
      }
    };
    const shopStore = stores_shop.useShopStore();
    const { goodsList, categories } = common_vendor.storeToRefs(shopStore);
    const cartItems = common_vendor.computed(() => goodsList.value.filter((item) => item.num > 0));
    const cartPopupVisible = common_vendor.ref(false);
    common_vendor.computed(() => {
      if (searchMode.value && searchKeyword.value) {
        return goodsList.value.filter(
          (item) => item.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) || item.description.toLowerCase().includes(searchKeyword.value.toLowerCase())
        );
      }
      return goodsList.value.filter((item) => item.categoryId === categories.value[currentCategory.value].id);
    });
    const totalAmount = common_vendor.computed(() => {
      return cartItems.value.reduce((sum, item) => sum + item.price * item.num, 0);
    });
    const totalNum = common_vendor.computed(() => {
      return cartItems.value.reduce((sum, item) => sum + item.num, 0);
    });
    const goToSearch = () => {
      common_vendor.index.navigateTo({
        url: "./Search"
      });
    };
    const scrollToCategory = (index) => {
      currentCategory.value = index;
      scrollIntoView.value = `category-${index}`;
      setTimeout(() => scrollIntoView.value = "", 800);
    };
    const specPopupVisible = common_vendor.ref(false);
    const currentSpecItem = common_vendor.ref(null);
    const specQuantity = common_vendor.ref(1);
    const selectSpec = (item) => {
      common_vendor.index.__f__("log", "at pages/Shops/Shops.vue:257", "加号按钮点击事件触发", item.name);
      common_vendor.index.__f__("log", "at pages/Shops/Shops.vue:258", "点击了规格选择");
      currentSpecItem.value = item;
      specQuantity.value = 1;
      specPopupVisible.value = true;
      common_vendor.index.__f__("log", "at pages/Shops/Shops.vue:262", "显示规格选择弹窗 - 仅包含数量选择");
    };
    const updateCart = (item, delta) => {
      shopStore.updateGoodsNum(item.id, delta);
    };
    const showCartPopup = () => {
      if (cartItems.value.length === 0) {
        common_vendor.index.showToast({ title: "购物车为空", icon: "none" });
        return;
      }
      cartPopupVisible.value = true;
    };
    const clearCart = () => {
      shopStore.resetGoodsNum();
    };
    const goToOrder = () => {
      if (cartItems.value.length === 0) {
        common_vendor.index.showToast({
          title: "请先选择商品",
          icon: "none"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/Shops/Order/Order"
      });
    };
    const getCategoryGoods = (categoryId) => {
      if (categoryId === 0) {
        return goodsList.value;
      }
      return goodsList.value.filter((item) => item.categoryId === categoryId);
    };
    const onScroll = (e) => {
      if (scrollTimer.value)
        clearTimeout(scrollTimer.value);
      scrollTimer.value = setTimeout(() => {
        e.detail.scrollTop;
        const query = common_vendor.index.createSelectorQuery();
        query.selectAll(".category-section").boundingClientRect((rects) => {
          if (!rects || !rects.length)
            return;
          let currentIndex = 0;
          for (let i = 0; i < rects.length; i++) {
            if (rects[i].top >= 0) {
              currentIndex = i;
              break;
            }
          }
          currentCategory.value = currentIndex;
        }).exec();
      }, 100);
    };
    const goodsDetailVisible = common_vendor.ref(false);
    const currentDetailItem = common_vendor.ref(null);
    const showGoodsDetail = (item) => {
      common_vendor.index.__f__("log", "at pages/Shops/Shops.vue:346", "卡片点击事件触发", item.name);
      if (!item) {
        common_vendor.index.showToast({
          title: "商品信息不完整",
          icon: "none"
        });
        return;
      }
      currentDetailItem.value = item;
      goodsDetailVisible.value = true;
      common_vendor.index.__f__("log", "at pages/Shops/Shops.vue:357", "显示商品详情弹窗 - 包含详情内容");
    };
    const handleAddToCart = ({ item, quantity }) => {
      if (!item || quantity <= 0)
        return;
      updateCart(item, quantity);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0,
        b: common_vendor.o(goToSearch),
        c: common_vendor.p({
          list: bannerList.value,
          height: "190",
          mode: "card",
          circular: true,
          autoplay: true,
          ["previous-margin"]: "50",
          ["next-margin"]: "50",
          duration: "800",
          interval: "3000",
          scale: "0.8"
        }),
        d: common_vendor.p({
          direction: "column",
          text: noticeList.value,
          duration: "3000"
        }),
        e: common_vendor.f(common_vendor.unref(categories), (category, index, i0) => {
          return {
            a: common_vendor.t(category.name),
            b: index,
            c: currentCategory.value === index ? 1 : "",
            d: common_vendor.o(($event) => scrollToCategory(index), index)
          };
        }),
        f: common_vendor.f(common_vendor.unref(categories), (category, index, i0) => {
          return {
            a: common_vendor.t(category.name),
            b: common_vendor.f(getCategoryGoods(category.id), (item, k1, i1) => {
              return common_vendor.e({
                a: item.image,
                b: common_vendor.t(item.name),
                c: common_vendor.t(item.description),
                d: common_vendor.t(item.price),
                e: item.num > 0
              }, item.num > 0 ? {
                f: common_vendor.o(($event) => updateCart(item, -1), item.id)
              } : {}, {
                g: common_vendor.o(($event) => updateCart(item, 1), item.id),
                h: common_vendor.o(($event) => selectSpec(item), item.id),
                i: item.id,
                j: common_vendor.o(($event) => showGoodsDetail(item), item.id)
              });
            }),
            c: index,
            d: "category-" + index
          };
        }),
        g: common_assets._imports_1,
        h: scrollIntoView.value,
        i: common_vendor.o(onScroll),
        j: common_assets._imports_0$1,
        k: totalNum.value
      }, totalNum.value ? {
        l: common_vendor.t(totalNum.value)
      } : {}, {
        m: common_vendor.t(totalAmount.value),
        n: common_vendor.o(showCartPopup),
        o: common_vendor.o(goToOrder),
        p: common_vendor.o(($event) => specPopupVisible.value = $event),
        q: common_vendor.p({
          item: currentSpecItem.value,
          show: specPopupVisible.value
        }),
        r: cartPopupVisible.value
      }, cartPopupVisible.value ? common_vendor.e({
        s: cartItems.value.length
      }, cartItems.value.length ? {
        t: common_vendor.o(clearCart)
      } : {}, {
        v: common_vendor.f(cartItems.value, (item, k0, i0) => {
          return {
            a: item.image || "/static/logo.png",
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.price),
            d: common_vendor.o(($event) => updateCart(item, -1), item.id),
            e: common_vendor.t(item.num),
            f: common_vendor.o(($event) => updateCart(item, 1), item.id),
            g: item.id
          };
        }),
        w: common_vendor.o(($event) => cartPopupVisible.value = $event),
        x: common_vendor.p({
          mode: "bottom",
          round: "20",
          ["safe-area-inset-bottom"]: true,
          show: cartPopupVisible.value
        })
      }) : {}, {
        y: common_vendor.o(handleAddToCart),
        z: common_vendor.o(($event) => goodsDetailVisible.value = $event),
        A: common_vendor.p({
          item: currentDetailItem.value,
          show: goodsDetailVisible.value
        }),
        B: common_vendor.gei(_ctx, "")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c522fcb6"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Shops/Shops.js.map
