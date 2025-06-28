<template>
	<view class="container">
		<!-- 顶部搜索栏 -->
		<view class="search-header">
			<view class="search-box" @tap="goToSearch">
				<text class="search-icon">🔍</text>
				<text class="keyword">{{ keyword }}</text>
			</view>
			<text class="edit-btn" @tap="goToSearch">编辑</text>
		</view>

		<!-- 搜索结果 -->
		<view class="goods-list">
			<view class="goods-item" v-for="(item, index) in searchResults" :key="index">
				<image :src="item.image" mode="aspectFill" class="goods-image" @tap="openSpec(item)"></image>
				<view class="goods-info">
					<view class="goods-name-wrap">
						<text class="goods-name">{{ item.name }}</text>
						<text class="new-tag" v-if="item.isNew">新</text>
					</view>
					<text class="goods-desc">{{ item.description }}</text>
					<view class="goods-bottom">
						<text class="goods-price">¥{{ item.price }}</text>
						<view class="goods-action">
							<text class="minus" v-if="item.num > 0" @tap.stop="updateCart(item, -1)">-</text>
							<text class="num" v-if="item.num > 0">{{ item.num }}</text>
							<text class="plus" @tap.stop="updateCart(item, 1)">+</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 无搜索结果 -->
		<view class="no-result" v-if="searchResults.length === 0">
			<image src="/static/no-result.png" mode="aspectFit" class="no-result-image"></image>
			<text class="no-result-text">暂无相关商品</text>
		</view>

		<CartBar />
		<SpecPopup v-model:show="specPopupVisible" :item="currentSpecItem" />
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CartBar from '@/components/CartBar.vue'
import SpecPopup from '@/components/SpecPopup.vue'
import { storeToRefs } from 'pinia'
import { useShopStore } from '@/stores/shop'

// 响应式数据
const keyword = ref('')
const searchResults = ref([])
const specPopupVisible = ref(false)
const currentSpecItem = ref(null)

// 取商品数据
const shopStore = useShopStore()
const { goodsList } = storeToRefs(shopStore)

// 生命周期钩子
onMounted(() => {
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	if (currentPage && currentPage.options.keyword) {
		keyword.value = decodeURIComponent(currentPage.options.keyword)
		searchProducts()
	}
})

// 方法
const goToSearch = () => {
	uni.redirectTo({
		url: './Search'
	})
}

const searchProducts = () => {
	if (!keyword.value) {
	searchResults.value = []
		return
	}
	const lower = keyword.value.toLowerCase()
	searchResults.value = goodsList.value.filter(item =>
		item.name.toLowerCase().includes(lower) ||
		item.description.toLowerCase().includes(lower)
	)
}

const updateCart = (item, delta) => {
	// 更新 Pinia 中的商品数量
	shopStore.updateGoodsNum(item.id, delta)

	// 同步当前搜索结果中的数量
	const updated = goodsList.value.find(g => g.id === item.id)
	if (updated) {
		item.num = updated.num
	}
}

const openSpec = (item) => {
	currentSpecItem.value = item
	specPopupVisible.value = true
}
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background: #f5f5f5;
	padding-bottom: 140rpx; /* 预留购物车高度 */
}

.search-header {
	display: flex;
	align-items: center;
	padding: 20rpx;
	background: #fff;
	border-bottom: 1rpx solid #f5f5f5;
	
	.search-box {
		flex: 1;
		display: flex;
		align-items: center;
		padding: 15rpx 20rpx;
		background: #f5f5f5;
		border-radius: 30rpx;
		margin-right: 20rpx;
		
		.search-icon {
			font-size: 32rpx;
			color: #666;
			margin-right: 10rpx;
		}
		
		.keyword {
			font-size: 28rpx;
			color: #333;
		}
	}
	
	.edit-btn {
		font-size: 28rpx;
		color: #666;
	}
}

.goods-list {
	padding: 20rpx;
	
	.goods-item {
		display: flex;
		padding: 20rpx;
		background: #fff;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
		
		.goods-image {
			width: 140rpx;
			height: 140rpx;
			border-radius: 8rpx;
			margin-right: 20rpx;
		}
		
		.goods-info {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			
			.goods-name-wrap {
				display: flex;
				align-items: center;
				
				.goods-name {
					font-size: 28rpx;
					font-weight: bold;
					color: #333;
				}
				
				.new-tag {
					margin-left: 10rpx;
					padding: 2rpx 8rpx;
					background: #ff4400;
					color: #fff;
					font-size: 20rpx;
					border-radius: 4rpx;
				}
			}
			
			.goods-desc {
				font-size: 24rpx;
				color: #666;
				margin: 8rpx 0;
			}
			
			.goods-bottom {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: auto;
				
				.goods-price {
					color: #ff4400;
					font-size: 32rpx;
					font-weight: bold;
				}
				
				.goods-action {
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
}

.no-result {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 200rpx;
	
	.no-result-image {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 20rpx;
	}
	
	.no-result-text {
		font-size: 28rpx;
		color: #999;
	}
}
</style> 