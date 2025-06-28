<template>
	<!-- 购物车底部栏 -->
	<view class="cart">
		<view class="cart-info" @tap="toggleCartPopup">
			<view class="cart-icon">
				<image class="cart-icon-img" src="/static/icons/ShoppingCart.png" mode="aspectFit" />
				<text class="badge" v-if="totalNum">{{ totalNum }}</text>
			</view>
			<view class="cart-price">
				<text>¥{{ totalAmount }}</text>
			</view>
		</view>
		<view class="cart-button">
			<button @tap="goToOrder">去结算</button>
		</view>

		<!-- 购物车弹窗 -->
		<u-popup v-model:show="cartPopupVisible" mode="bottom" round="20" safe-area-inset-bottom>
			<view class="popup">
				<view class="popup-header">
					<text class="title">购物车</text>
					<text class="clear" v-if="cartItems.length" @tap="clearCart">清空</text>
				</view>
				<scroll-view scroll-y class="popup-content">
					<view class="popup-item" v-for="item in cartItems" :key="item.id">
						<image :src="item.image" class="item-image" mode="aspectFill" />
						<view class="item-info">
							<text class="item-name">{{ item.name }}</text>
							<text class="item-price">¥{{ item.price }}</text>
						</view>
						<view class="item-action">
							<view class="minus" @tap.stop="updateCart(item,-1)">-</view>
							<text class="num">{{ item.num }}</text>
							<view class="plus" @tap.stop="updateCart(item,1)">+</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useShopStore } from '@/stores/shop'

const cartPopupVisible = ref(false)

const shopStore = useShopStore()
const { goodsList } = storeToRefs(shopStore)

const cartItems = computed(() => goodsList.value.filter(item => item.num > 0))
const totalAmount = computed(() => cartItems.value.reduce((sum, item) => sum + item.price * item.num, 0))
const totalNum = computed(() => cartItems.value.reduce((sum, item) => sum + item.num, 0))

const toggleCartPopup = () => {
	if (cartItems.value.length === 0) {
		uni.showToast({ title: '购物车为空', icon: 'none' })
		return
	}
	cartPopupVisible.value = true
}

const updateCart = (item, delta) => {
	shopStore.updateGoodsNum(item.id, delta)
}

const clearCart = () => {
	shopStore.resetGoodsNum()
}

const goToOrder = () => {
	if (cartItems.value.length === 0) {
		uni.showToast({ title: '请先选择商品', icon: 'none' })
		return
	}
	uni.navigateTo({ url: '/pages/Shops/Order/Order' })
}
</script>

<style scoped lang="scss">
.cart {
	height: 100rpx;
	background: #fff;
	display: flex;
	align-items: center;
	padding: 0 24rpx;
	box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1000;

	.cart-info {
		flex: 1;
		display: flex;
		align-items: center;

		.cart-icon {
			position: relative;
			width: 80rpx;
			height: 80rpx;
			background: #bfbfbf;
			border-radius: 50%;
			margin-top: -40rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 20rpx;

			.cart-icon-img {
				width: 48rpx;
				height: 48rpx;
			}

			.badge {
				position: absolute;
				top: -6rpx;
				right: -6rpx;
				min-width: 32rpx;
				height: 32rpx;
				padding: 0 8rpx;
				background: #fff;
				border: 2rpx solid #2aeee6;
				border-radius: 16rpx;
				font-size: 20rpx;
				color: #2aeee6;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		.cart-price {
			font-size: 32rpx;
			font-weight: bold;
			color: #f01616;
		}
	}

	.cart-button {
		button {
			width: 180rpx;
			height: 70rpx;
			line-height: 70rpx;
			background: #f01616;
			color: #fff;
			font-size: 28rpx;
			border-radius: 35rpx;
		}
	}
}

.popup {
	background: #fff;
	border-radius: 20rpx 20rpx 0 0;
	padding: 30rpx 30rpx 0 30rpx;

	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;

		.title {
			font-size: 30rpx;
			font-weight: bold;
			color: #333;
		}

		.clear {
			font-size: 26rpx;
			color: #999;
		}
	}

	.popup-content {
		max-height: 600rpx;

		.popup-item {
			display: flex;
			align-items: center;
			padding: 20rpx 0;
			border-bottom: 1rpx solid #f5f5f5;

			.item-image {
				width: 100rpx;
				height: 100rpx;
				border-radius: 8rpx;
				margin-right: 20rpx;
			}

			.item-info {
				flex: 1;
				display: flex;
				flex-direction: column;

				.item-name {
					font-size: 26rpx;
					color: #333;
					margin-bottom: 8rpx;
					display:block;
				}

				.item-price {
					font-size: 28rpx;
					color: #ff4400;
					font-weight: bold;
					display:block;
				}
			}

			.item-action {
				display: flex;
				align-items: center;

				.minus, .plus {
					width: 44rpx;
					height: 44rpx;
					line-height: 44rpx;
					text-align: center;
					border-radius: 50%;
					font-size: 32rpx;
				}

				.minus {
					background: #f5f5f5;
					color: #666;
				}

				.plus {
					background: #ff4400;
					color: #fff;
				}

				.num {
					margin: 0 16rpx;
					font-size: 26rpx;
					color: #333;
				}
			}
		}
	}
}
</style> 