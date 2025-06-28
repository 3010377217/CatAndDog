<template>
  <u-popup v-if="show" :show="show" @update:show="$emit('update:show', $event)" mode="bottom" round="20" :style="{ height: '50vh' }" safe-area-inset-bottom>
    <view class="goods-detail-popup">
      <!-- 顶部商品信息 -->
      <template v-if="item">
        <view class="popup-header">
          <image :src="item.image" mode="aspectFill" class="popup-image"></image>
          <view class="popup-info">
            <text class="popup-name">{{ item.name }}</text>
            <text class="popup-desc">{{ item.description || '' }}</text>
          </view>
          <text class="popup-price">¥{{ item.price }}</text>
        </view>
        
        <!-- 数量控制 -->
        <view class="popup-section">
          <text class="section-title">购买数量</text>
          <view class="qty-control">
            <view class="btn minus" @tap="decreaseQty">-</view>
            <text class="qty-number">{{ quantity }}</text>
            <view class="btn plus" @tap="increaseQty">+</view>
          </view>
        </view>
        
        <!-- 分隔线 -->
        <view class="divider"></view>
        
        <!-- 商品详情 -->
        <scroll-view scroll-y class="detail-content">
          <view class="detail-title">商品详情</view>
          <view class="detail-text">
            商品详情商品详情商品详情
            商品详情商品详情商品详情
            商品详情商品详情商品详情
            商品详情商品详情商品详情
            商品详情商品详情商品详情
            商品详情商品详情商品详情
            商品详情商品详情商品详情
          </view>
        </scroll-view>
        
        <!-- 底部按钮 -->
        <view class="popup-footer">
          <button class="add-cart-btn" @tap="addToCart">加入购物车</button>
        </view>
      </template>
      <template v-else>
        <view class="empty-state">
          <text>商品信息加载中...</text>
        </view>
      </template>
    </view>
  </u-popup>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  item: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:show', 'add-to-cart']);

// 商品数量
const quantity = ref(1);

// 监听弹窗状态，重置数量
watch(() => props.show, (newVal) => {
  if (newVal) {
    quantity.value = 1;
  }
});

// 增加数量
const increaseQty = () => {
  quantity.value++;
};

// 减少数量
const decreaseQty = () => {
  if (quantity.value > 0) {
    quantity.value--;
  }
};

// 添加到购物车
const addToCart = () => {
  if (props.item) {
    emit('add-to-cart', {
      item: props.item,
      quantity: quantity.value
    });
    emit('update:show', false);
  } else {
    uni.showToast({
      title: '商品信息不完整',
      icon: 'none'
    });
  }
};
</script>

<style lang="scss" scoped>
.goods-detail-popup {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 30rpx;
  box-sizing: border-box;
  
  .popup-header {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
    
    .popup-image {
      width: 160rpx;
      height: 160rpx;
      border-radius: 12rpx;
      margin-right: 20rpx;
      flex-shrink: 0;
    }
    
    .popup-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 160rpx;
      
      .popup-name {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 10rpx;
        line-height: 1.3;
      }
      
      .popup-desc {
        font-size: 24rpx;
        color: #999;
        line-height: 1.3;
      }
    }
    
    .popup-price {
      font-size: 36rpx;
      color: #f01616;
      font-weight: bold;
      align-self: center;
      margin-left: 20rpx;
    }
  }
  
  .popup-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    
    .section-title {
      font-size: 28rpx;
      color: #333;
    }
    
    .qty-control {
      display: flex;
      align-items: center;
      
      .btn {
        width: 60rpx;
        height: 60rpx;
        border-radius: 8rpx;
        background: #f5f5f5;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 36rpx;
        
        &.minus {
          color: #999;
        }
        
        &.plus {
          color: #f01616;
          background: rgba(240, 22, 22, 0.1);
        }
      }
      
      .qty-number {
        width: 80rpx;
        text-align: center;
        font-size: 32rpx;
        color: #333;
      }
    }
  }
  
  .divider {
    height: 2rpx;
    background: #f5f5f5;
    margin: 20rpx 0;
  }
  
  .detail-content {
    flex: 1;
    overflow-y: auto;
    
    .detail-title {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
    }
    
    .detail-text {
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
      white-space: pre-wrap;
    }
  }
  
  .popup-footer {
    margin-top: 30rpx;
    
    .add-cart-btn {
      height: 80rpx;
      line-height: 80rpx;
      background: linear-gradient(90deg, #ff6034, #f01616);
      color: #fff;
      font-size: 30rpx;
      border-radius: 40rpx;
    }
  }
  
  .empty-state {
    height: 300rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #999;
    font-size: 30rpx;
  }
}
</style> 