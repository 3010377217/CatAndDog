<template>
	<u-popup v-if="popupVisible" v-model:show="popupVisible" mode="bottom" round="20" :style="{ height: '40vh' }" safe-area-inset-bottom>
		<view class="spec-popup" v-if="item">
			<!-- 头部：商品信息 -->
			<view class="popup-header">
				<image :src="item.image || '/static/logo.png'" class="popup-image" mode="aspectFill" />
				<view class="popup-info">
					<text class="popup-name">{{ item.name }}</text>
					<text class="popup-desc" v-if="item.description">{{ item.description }}</text>
					<text class="popup-price">¥{{ item.price }}</text>
				</view>
			</view>

			<!-- 提示说明 -->
			<view class="popup-tip">
				<text>快速选择商品数量并加入购物车</text>
			</view>

			<!-- 数量 -->
			<view class="popup-section">
				<text class="section-title">数量</text>
				<view class="qty-control">
					<view class="btn minus" @tap="decQty">-</view>
					<text class="qty-number">{{ quantity }}</text>
					<view class="btn plus" @tap="incQty">+</view>
				</view>
			</view>

			<!-- 确认按钮 -->
			<view class="popup-footer">
				<button class="confirm-btn" @tap="confirmAdd">加入购物车</button>
			</view>
		</view>
	</u-popup>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { defineProps, defineEmits } from 'vue'
import { useShopStore } from '@/stores/shop'

const props = defineProps({
	show: Boolean,
	item: {
		type: Object,
		default: null
	}
})
const emit = defineEmits(['update:show'])

// 双向绑定 show
const popupVisible = computed({
	get: () => props.show,
	set: (val) => emit('update:show', val)
})

const quantity = ref(1)

watch(() => props.item, () => {
	quantity.value = 1
})

const incQty = () => {
	quantity.value += 1
}
const decQty = () => {
	if (quantity.value > 1) quantity.value -= 1
}

const shopStore = useShopStore()

const confirmAdd = () => {
	if (!props.item) return
	shopStore.updateGoodsNum(props.item.id, quantity.value)
	popupVisible.value = false
	uni.showToast({ title: '已加入购物车', icon: 'success' })
}
</script>

<style scoped lang="scss">
.spec-popup {
	padding: 30rpx 30rpx 0 30rpx;
	display: flex;
	flex-direction: column;
	height: 100%;
	box-sizing: border-box;

	.popup-header {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;

		.popup-image {
			width: 160rpx;
			height: 160rpx;
			border-radius: 8rpx;
			margin-right: 20rpx;
			flex-shrink: 0;
		}

		.popup-info {
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;

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
				margin-bottom: 8rpx;
				line-height: 1.3;
			}

			.popup-price {
				font-size: 32rpx;
				color: #f01616;
				font-weight: bold;
			}
		}
	}
	
	.popup-tip {
		background-color: #f8f8f8;
		padding: 16rpx;
		border-radius: 8rpx;
		margin-bottom: 30rpx;
		
		text {
			font-size: 24rpx;
			color: #666;
		}
	}

	.popup-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40rpx;

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
				margin: 0 20rpx;
				font-size: 32rpx;
				width: 80rpx;
				text-align: center;
				color: #333;
			}
		}
	}

	.popup-footer {
		margin-top: auto;
		margin-bottom: 30rpx;

		.confirm-btn {
			width: 100%;
			height: 90rpx;
			line-height: 90rpx;
			border-radius: 45rpx;
			background: linear-gradient(90deg, #ff6034, #f01616);
			color: #fff;
			font-size: 32rpx;
			text-align: center;
		}
	}
}
</style> 