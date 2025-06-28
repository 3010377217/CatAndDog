"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_shop = require("../../stores/shop.js");
if (!Array) {
  const _easycom_u_swiper2 = common_vendor.resolveComponent("u-swiper");
  _easycom_u_swiper2();
}
const _easycom_u_swiper = () => "../../node-modules/uview-plus/components/u-swiper/u-swiper.js";
if (!Math) {
  (_easycom_u_swiper + GoodsDetailPopup)();
}
const GoodsDetailPopup = () => "../../components/GoodsDetailPopup.js";
const TRIGGER_HEIGHT_RPX = 400;
const _sfc_main = {
  __name: "Index",
  setup(__props) {
    const shopStore = stores_shop.useShopStore();
    const showPopup = common_vendor.ref(false);
    const selectedGoods = common_vendor.ref(null);
    const activeCardId = common_vendor.ref(null);
    const handleCardTouchStart = (id) => {
      activeCardId.value = id;
    };
    const handleCardTouchEnd = () => {
      setTimeout(() => {
        activeCardId.value = null;
      }, 50);
    };
    const showGoodsDetail = (item) => {
      selectedGoods.value = {
        id: item.id,
        name: item.title,
        description: item.description,
        price: item.price,
        image: item.image
      };
      showPopup.value = true;
    };
    const handleAddToCart = (data) => {
      const { item, quantity } = data;
      shopStore.updateGoodsNum(item.id, quantity);
      common_vendor.index.showToast({
        title: `已添加${quantity}件到购物车`,
        icon: "success"
      });
    };
    const throttle = (fn, delay = 600) => {
      let lastTime = 0;
      return function(...args) {
        const now = Date.now();
        if (now - lastTime >= delay) {
          fn.apply(this, args);
          lastTime = now;
        }
      };
    };
    const throttledPageScroll = throttle((e) => {
      if (!pageInfo.loading && pageInfo.hasMore) {
        checkScrollPosition(e.scrollTop);
      }
    });
    common_vendor.onPageScroll(throttledPageScroll);
    const bannerList = common_vendor.ref([
      "/static/picture/food1.jpg",
      "/static/picture/food2.jpg",
      "/static/picture/food3.jpg",
      "/static/picture/4.jpg"
    ]);
    const currentIndex = common_vendor.ref(0);
    const prevIndex = common_vendor.ref(-1);
    let autoplayTimer = null;
    common_vendor.ref(0);
    common_vendor.ref(0);
    common_vendor.ref(false);
    common_vendor.ref(0);
    const isTransitioning = common_vendor.ref(false);
    const goToSlide = (index) => {
      if (index === currentIndex.value || isTransitioning.value)
        return;
      isTransitioning.value = true;
      prevIndex.value = currentIndex.value;
      currentIndex.value = index;
      setTimeout(() => {
        prevIndex.value = -1;
        isTransitioning.value = false;
      }, 800);
    };
    const nextSlide = () => {
      goToSlide((currentIndex.value + 1) % bannerList.value.length);
    };
    const startAutoplay = () => {
      stopAutoplay();
      autoplayTimer = setInterval(() => {
        nextSlide();
      }, 4e3);
    };
    const stopAutoplay = () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };
    common_vendor.onMounted(() => {
      startAutoplay();
    });
    common_vendor.onUnmounted(() => {
      stopAutoplay();
    });
    const goodsList = common_vendor.ref([]);
    const pageInfo = common_vendor.reactive({
      page: 1,
      pageSize: 10,
      hasMore: true,
      loading: false,
      initialized: false
      // 是否已完成初始化
    });
    const leftColumn = common_vendor.ref([]);
    const rightColumn = common_vendor.ref([]);
    const leftHeight = common_vendor.ref(0);
    const rightHeight = common_vendor.ref(0);
    const initWaterfall = () => {
      leftColumn.value = [];
      rightColumn.value = [];
      leftHeight.value = 0;
      rightHeight.value = 0;
    };
    const onImageLoad = (e, column) => {
      const { width, height } = e.detail || {};
      if (!width || !height)
        return;
      const columnWidth = common_vendor.index.getSystemInfoSync().windowWidth * 0.9 / 2;
      const scaledHeight = height / width * columnWidth + 200;
      if (column === "left") {
        leftHeight.value += scaledHeight;
      } else {
        rightHeight.value += scaledHeight;
      }
      common_vendor.index.createSelectorQuery().select(".container").boundingClientRect((res) => {
        if (res)
          containerHeight = res.height;
      }).exec();
    };
    let lastLoadTime = 0;
    let containerHeight = 0;
    common_vendor.onMounted(() => {
      const query = common_vendor.index.createSelectorQuery();
      query.select(".container").boundingClientRect((data) => {
        if (data)
          containerHeight = data.height;
      }).exec();
    });
    const throttleLoadMore = () => {
      const now = Date.now();
      if (now - lastLoadTime > 600) {
        lastLoadTime = now;
        common_vendor.index.__f__("log", "at pages/Index/Index.vue:354", "触发了上拉加载更多");
        loadMoreGoods();
      }
    };
    const updateWaterfall = (newItems) => {
      const getEstimatedHeight = () => 500;
      if (newItems.length > 0) {
        leftColumn.value.push(newItems[0]);
        leftHeight.value += getEstimatedHeight();
      }
      if (newItems.length > 1) {
        rightColumn.value.push(newItems[1]);
        rightHeight.value += getEstimatedHeight();
      }
      newItems.forEach((item, index) => {
        if (index < 2) {
          return;
        }
        const diff = leftHeight.value - rightHeight.value;
        if (diff > 0) {
          rightColumn.value.push(item);
          rightHeight.value += getEstimatedHeight();
        } else {
          leftColumn.value.push(item);
          leftHeight.value += getEstimatedHeight();
        }
      });
    };
    let isTriggered = false;
    const checkScrollPosition = (scrollTop) => {
      if (!containerHeight)
        return;
      const windowHeight = common_vendor.index.getSystemInfoSync().windowHeight;
      const distanceToBottom = containerHeight - (scrollTop + windowHeight);
      const triggerPx = rpxToPx(TRIGGER_HEIGHT_RPX);
      if (distanceToBottom <= triggerPx && !isTriggered) {
        isTriggered = true;
        throttleLoadMore();
      } else if (distanceToBottom > triggerPx * 2) {
        isTriggered = false;
      }
    };
    common_vendor.onPullDownRefresh(() => {
      common_vendor.index.__f__("log", "at pages/Index/Index.vue:426", "触发了下拉刷新");
      goodsList.value = [];
      leftColumn.value = [];
      rightColumn.value = [];
      leftHeight.value = 0;
      rightHeight.value = 0;
      pageInfo.page = 1;
      pageInfo.hasMore = true;
      pageInfo.initialized = false;
      initGoodsData();
      setTimeout(() => {
        common_vendor.index.stopPullDownRefresh();
      }, 1e3);
    });
    common_vendor.onMounted(() => {
      startAutoplay();
      initWaterfall();
    });
    common_vendor.onReady(() => {
      initGoodsData();
    });
    const rpxToPx = (rpx) => rpx * common_vendor.index.getSystemInfoSync().windowWidth / 750;
    const transformShopGoods = (goodsItems) => {
      return goodsItems.map((item) => ({
        id: item.id,
        title: item.name,
        price: item.price.toFixed(2),
        sales: item.sales || Math.floor(Math.random() * 500) + 50,
        image: item.image,
        description: item.description
      }));
    };
    const initGoodsData = () => {
      if (pageInfo.loading)
        return;
      pageInfo.loading = true;
      shopStore.fetchGoods(1, pageInfo.pageSize).then((result) => {
        const transformedGoods = transformShopGoods(result.data);
        goodsList.value = transformedGoods;
        updateWaterfall(transformedGoods);
        pageInfo.page = 2;
        pageInfo.hasMore = result.pagination.hasMore;
        pageInfo.loading = false;
        pageInfo.initialized = true;
        common_vendor.index.__f__("log", "at pages/Index/Index.vue:498", "商品数据初始化完成");
      }).catch((error) => {
        common_vendor.index.__f__("error", "at pages/Index/Index.vue:500", "获取商品数据失败:", error);
        pageInfo.loading = false;
        common_vendor.index.showToast({
          title: "加载数据失败，请稍后再试",
          icon: "none"
        });
      });
    };
    const loadMoreGoods = () => {
      if (pageInfo.loading || !pageInfo.hasMore || !pageInfo.initialized)
        return;
      pageInfo.loading = true;
      shopStore.fetchGoods(pageInfo.page, pageInfo.pageSize).then((result) => {
        const transformedGoods = transformShopGoods(result.data);
        goodsList.value = [...goodsList.value, ...transformedGoods];
        updateWaterfall(transformedGoods);
        pageInfo.page++;
        pageInfo.hasMore = result.pagination.hasMore;
        pageInfo.loading = false;
        common_vendor.index.createSelectorQuery().select(".container").boundingClientRect((res) => {
          if (res)
            containerHeight = res.height;
        }).exec();
        isTriggered = false;
      }).catch((error) => {
        common_vendor.index.__f__("error", "at pages/Index/Index.vue:542", "加载更多商品失败:", error);
        pageInfo.loading = false;
        isTriggered = false;
        common_vendor.index.showToast({
          title: "加载数据失败，请稍后再试",
          icon: "none"
        });
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          list: bannerList.value,
          height: "200",
          mode: "card",
          circular: true,
          autoplay: true,
          ["previous-margin"]: "50",
          ["next-margin"]: "50",
          duration: "800",
          interval: "3000",
          scale: "0.8"
        }),
        b: !pageInfo.initialized
      }, !pageInfo.initialized ? {} : {
        c: common_vendor.f(leftColumn.value, (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.o((e) => onImageLoad(e, "left"), index),
            c: common_vendor.t(item.title),
            d: common_vendor.t(item.description),
            e: common_vendor.t(item.price),
            f: common_vendor.t(item.sales),
            g: activeCardId.value === item.id ? 1 : "",
            h: common_vendor.o(($event) => handleCardTouchStart(item.id), index),
            i: common_vendor.o(($event) => handleCardTouchEnd(item.id), index),
            j: common_vendor.o(($event) => handleCardTouchEnd(item.id), index),
            k: common_vendor.o(($event) => showGoodsDetail(item), index),
            l: index
          };
        }),
        d: common_vendor.f(rightColumn.value, (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.o((e) => onImageLoad(e, "right"), index),
            c: common_vendor.t(item.title),
            d: common_vendor.t(item.description),
            e: common_vendor.t(item.price),
            f: common_vendor.t(item.sales),
            g: activeCardId.value === item.id ? 1 : "",
            h: common_vendor.o(($event) => handleCardTouchStart(item.id), index),
            i: common_vendor.o(($event) => handleCardTouchEnd(item.id), index),
            j: common_vendor.o(($event) => handleCardTouchEnd(item.id), index),
            k: common_vendor.o(($event) => showGoodsDetail(item), index),
            l: index
          };
        })
      }, {
        e: pageInfo.initialized
      }, pageInfo.initialized ? common_vendor.e({
        f: pageInfo.loading
      }, pageInfo.loading ? {} : !pageInfo.hasMore ? {} : {}, {
        g: !pageInfo.hasMore
      }) : {}, {
        h: common_vendor.o(handleAddToCart),
        i: common_vendor.o(($event) => showPopup.value = $event),
        j: common_vendor.p({
          item: selectedGoods.value,
          show: showPopup.value
        }),
        k: common_vendor.gei(_ctx, "")
      });
    };
  }
};
_sfc_main.__runtimeHooks = 1;
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Index/Index.js.map
