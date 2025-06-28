<template>
	<view class="container">
		<!-- 搜索框 -->
		<view class="search-container">
			<view class="search-box" @tap="goToSearch">
				<image class="search-icon" src="/static/icons/Search.png" mode="aspectFit"></image>
				<text class="placeholder">搜索商品</text>
			</view>
		</view>
		<!-- 优雅的分割线 -->
		<view class="divider"></view>

		<!-- 卡片式轮播图 -->
		<view class="banner-container">
		<u-swiper
			:list="bannerList"
			height="190"
			mode="card"
			circular
			:autoplay="true"
			previous-margin="50"
			next-margin="50"
			duration="800"
			interval="3000"
			scale="0.8"
		/>
		</view>
		<!-- 公告播报区域 -->
		<view class="notice-wrapper">
			
			<u-notice-bar direction="column" :text="noticeList" duration="3000"/>
		</view>
		<!-- 点单区域 -->
		<view class="content">
			<!-- 左侧分类栏 -->
			<scroll-view class="cu-list menu" scroll-y>
				<view 
					v-for="(category, index) in categories" 
					:key="index"
					class="cu-item"
					:class="{ active: currentCategory === index }"
					@tap="scrollToCategory(index)"
				>
					<text>{{ category.name }}</text>
				</view>
			</scroll-view>

			<!-- 右侧商品列表 -->
			<scroll-view 
				class="main" 
				scroll-y 
				scroll-with-animation
				:scroll-into-view="scrollIntoView"
				@scroll="onScroll"
			>
				<view 
					v-for="(category, index) in categories" 
					:key="index"
					:id="'category-' + index"
					class="category-section"
				>
					<view class="category-title">{{ category.name }}</view>
					<view 
						class="goods-item" 
						v-for="item in getCategoryGoods(category.id)" 
						:key="item.id"
						@tap="showGoodsDetail(item)"
					>
						<image :src="item.image" mode="aspectFill" class="goods-image"></image>
						<view class="goods-info">
							<view class="goods-name-wrap">
								<text class="goods-name">{{ item.name }}</text>
							</view>
							<text class="goods-desc">{{ item.description }}</text>
							<view class="goods-bottom">
								<text class="goods-price">¥{{ item.price }}</text>
								<view class="goods-action">
									<button 
										class="cu-btn icon sm round bg-gray" 
										v-if="item.num > 0" 
										@tap.stop="updateCart(item, -1)"
									>
										<text class="cuIcon-move"></text>
									</button>
									<button 
										class="cu-btn icon sm round bg-red" 
										@tap.stop="updateCart(item, 1)"
									>
										<text class="cuIcon-add"></text>
									</button>
								</view>
								<image class="spec-icon" src="/static/icons/Add.png" mode="aspectFit" @tap.stop="selectSpec(item)"></image>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 购物车 -->
		 <!-- v-if="totalNum == 0" -->
		<view class="cart" >
			<view class="cart-info" @tap="showCartPopup">
				<view class="cart-icon">
					<image class="cart-icon-img" src="/static/icons/ShoppingCart.png" mode="aspectFit"></image>
					<text class="badge" v-if="totalNum">{{ totalNum }}</text>
				</view>
				<view class="cart-price">
					<text>¥{{ totalAmount }}</text>
				</view>
			</view>
			<view class="cart-button">
				<button @tap="goToOrder">去结算</button>
			</view>
		</view>
		<!-- 规格选择弹窗 -->
		<SpecPopup v-model:show="specPopupVisible" :item="currentSpecItem" />

		<!-- 购物车弹窗 -->
		<u-popup v-if="cartPopupVisible" v-model:show="cartPopupVisible" mode="bottom" round="20" safe-area-inset-bottom>
			<view class="popup">
				<view class="popup-header">
					<text class="title">购物车</text>
					<text class="clear" @tap="clearCart" v-if="cartItems.length">清空</text>
				</view>
				<scroll-view scroll-y="true" class="popup-content">
					<view class="popup-item" v-for="item in cartItems" :key="item.id">
						<image :src="item.image || '/static/logo.png'" class="item-image" mode="aspectFill" />
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
		<!-- 商品详情弹窗 -->
		<GoodsDetailPopup 
			v-model:show="goodsDetailVisible" 
			:item="currentDetailItem" 
			@add-to-cart="handleAddToCart"
		/>
	</view>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useShopStore } from '@/stores/shop'
import SpecPopup from '@/components/SpecPopup.vue'
import GoodsDetailPopup from '@/components/GoodsDetailPopup.vue'

// 响应式数据
const cardCur = ref(0)
const currentCategory = ref(0)
const searchKeyword = ref('')
const searchMode = ref(false)
const scrollTimer = ref(null)
const scrollIntoView = ref('')

// 轮播图数据
const bannerList = ref([
	'/static/picture/1.jpg',
	'/static/picture/2.jpg',
	'/static/picture/3.jpg',
	'/static/picture/4.jpg',
	'/static/picture/5.jpg'
])

// 公告列表
const noticeList = ref([
	'欢迎光临本商城，满99元包邮！',
	'新品上市，全场8折优惠！',
	'宠物洗护专区：买二送一，快来抢购！',
	'点击商品卡片可查看详情哦！',
	'春节期间为运输高峰期，请耐心等待！',
])

// 生命周期钩子
onMounted(() => {
	// 初始化轮播图
	cardCur.value = 0
	
	// 初始化加载商品数据
	loadShopData()
})

// 加载商品数据
const loadShopData = async () => {
	console.log('Shops.vue - 开始加载商品数据')
	try {
		// 加载所有商品数据
		await shopStore.fetchGoods(1, 100) // 一次性加载足够多的商品
		console.log('Shops.vue - 商品数据加载成功，商品数量:', goodsList.value.length)
	} catch (error) {
		console.error('Shops.vue - 加载商品数据失败:', error)
		uni.showToast({
			title: '加载商品失败，请重试',
			icon: 'none'
		})
	}
}

// 获取商品列表 store
const shopStore = useShopStore()
// 使用 storeToRefs 保持响应性
const { goodsList, categories } = storeToRefs(shopStore)

// 购物车数据
const cartItems = computed(() => goodsList.value.filter(item => item.num > 0))
const cartPopupVisible = ref(false)

// 计算属性
const currentGoods = computed(() => {
	if (searchMode.value && searchKeyword.value) {
		return goodsList.value.filter(item => 
			item.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
			item.description.toLowerCase().includes(searchKeyword.value.toLowerCase())
		)
	}
	// 使用store中的分类ID
	return goodsList.value.filter(item => item.categoryId === categories.value[currentCategory.value].id)
})

const totalAmount = computed(() => {
	return cartItems.value.reduce((sum, item) => sum + item.price * item.num, 0)
})

const totalNum = computed(() => {
	return cartItems.value.reduce((sum, item) => sum + item.num, 0)
})

// 方法
const goToSearch = () => {
	uni.navigateTo({
		url: './Search'
	})
}

const scrollToCategory = (index) => {
	currentCategory.value = index
	scrollIntoView.value = `category-${index}`
	// 等待下一帧复位，避免连续点击无效
	setTimeout(() => (scrollIntoView.value = ''), 800)
}

const specPopupVisible = ref(false)
const currentSpecItem = ref(null)
const specQuantity = ref(1)

const selectSpec = (item) => {
	console.log('加号按钮点击事件触发', item.name)
	console.log("点击了规格选择")
	currentSpecItem.value = item
	specQuantity.value = 1
	specPopupVisible.value = true
	console.log('显示规格选择弹窗 - 仅包含数量选择')
}

const incQty = () => {
	specQuantity.value += 1
}
const decQty = () => {
	if (specQuantity.value > 1) specQuantity.value -= 1
}

const confirmSpecAdd = () => {
	updateCart(currentSpecItem.value, specQuantity.value)
	specPopupVisible.value = false
}

const updateCart = (item, delta) => {
	shopStore.updateGoodsNum(item.id, delta)
}

const showCartPopup = () => {
	if (cartItems.value.length === 0) {
		uni.showToast({ title: '购物车为空', icon: 'none' })
		return
	}
	cartPopupVisible.value = true
}

const clearCart = () => {
	shopStore.resetGoodsNum()
}

const goToOrder = () => {
	if (cartItems.value.length === 0) {
		uni.showToast({
			title: '请先选择商品',
			icon: 'none'
		})
		return
	}
	
	// 跳转到订单确认页
	uni.navigateTo({
		url: '/pages/Shops/Order/Order'
	})
}

const getCategoryGoods = (categoryId) => {
	// 如果是"全部商品"分类（id为0），则返回所有商品
	if (categoryId === 0) {
		return goodsList.value
	}
	// 否则返回特定分类的商品
	return goodsList.value.filter(item => item.categoryId === categoryId)
}

const onScroll = (e) => {
	// 防抖处理
	if (scrollTimer.value) clearTimeout(scrollTimer.value)
	scrollTimer.value = setTimeout(() => {
		const scrollTop = e.detail.scrollTop
		const query = uni.createSelectorQuery()
		query.selectAll('.category-section').boundingClientRect(rects => {
			if (!rects || !rects.length) return
			
			// 找到当前可见的第一个分类
			let currentIndex = 0
			for (let i = 0; i < rects.length; i++) {
				if (rects[i].top >= 0) {
					currentIndex = i
					break
				}
			}
			
			currentCategory.value = currentIndex
		}).exec()
	}, 100)
}

// 商品详情弹窗
const goodsDetailVisible = ref(false)
const currentDetailItem = ref(null)

// 显示商品详情
const showGoodsDetail = (item) => {
	console.log('卡片点击事件触发', item.name)
	// 先确保有商品信息，防止传递 null 值
	if (!item) {
		uni.showToast({
			title: '商品信息不完整',
			icon: 'none'
		})
		return
	}
	currentDetailItem.value = item
	goodsDetailVisible.value = true
	console.log('显示商品详情弹窗 - 包含详情内容')
}

// 处理从详情弹窗添加到购物车
const handleAddToCart = ({ item, quantity }) => {
	// 确保数据有效
	if (!item || quantity <= 0) return
	updateCart(item, quantity)
}
</script>

<style lang="scss" scoped>
.container {
	height: 100vh;
	display: flex;
	flex-direction: column;
	background: #f5f5f5;
}

.search-container {
	
	padding: 20rpx;
	background: #fff;
	position: sticky;
	top: 0;
	z-index: 100;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.search-box {
	width: 90%;
	margin: 0 auto;
	display: flex;
	align-items: center;
	padding: 15rpx 20rpx;
	background: #f5f5f5;
	border-radius: 30rpx;
	
	.search-icon {
		width: 32rpx;
		height: 32rpx;
		margin-right: 10rpx;
	}
	
	.placeholder {
		font-size: 28rpx;
		color: #999;
	}
}

.divider {
	width: 95%;
	margin: 0 auto 20rpx;
	height: 2rpx;
	background: linear-gradient(to right, transparent, #f0f0f0, transparent);
	position: relative;
	
	&::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 60rpx;
		height: 8rpx;
		background: linear-gradient(to right, #2aeee6, #7df7f2);
		border-radius: 4rpx;
	}
}

.content {
	display: flex;
	background: #fff;
	margin-top: 20rpx;
	padding-bottom: 110rpx;
}

.cu-list.menu {
	width: 200rpx;
	max-height: calc(100vh - 380rpx);
	background: #f8f8f8;
	overflow-y: auto;
	align-self: flex-start;

	.cu-item {
		min-height: 90rpx;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #666;
		position: relative;
		transition: all 0.3s;
		border: 2rpx solid transparent;
		border-radius: 10rpx;
		margin: 10rpx;
		background: #fff;
		text-align: center;

		text {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
		}

		&.active {
			color: #2aeee6;
			background: #fff;
			border-color: #2aeee6;

			&::after {
				display: none;
			}
		}

		&:not(.active):hover {
			border-color: rgba(42, 238, 230, 0.3);
			color: #2aeee6;
		}
	}
}

.main {
	flex: 1;
	padding: 20rpx;
	 /* 预留购物车高度 */
	overflow-y: auto;
	min-height: 0;
	max-height: 780rpx;
	display: block; /* 确保正确的布局 */
}

.category-section {
	padding: 20rpx;
	width: 100%;
	box-sizing: border-box;

	.category-title {
		font-size: 32rpx;
		font-weight: bold;
		margin-left: -10rpx;
		color: #333;
		padding: 20rpx 0 20rpx 0;
		position: sticky;
		top: 0;
		background: #fff;
		z-index: 20;
		
	}
}

.goods-item {
	display: flex;
	padding: 24rpx;
	margin: 0 auto 24rpx;
	width: 92%;
	max-width: 680rpx;
	background: #fff;
	border-radius: 16rpx;
	border: 1rpx solid #f0f0f0;
	box-shadow: 0 4rpx 14rpx rgba(0, 0, 0, 0.06), 0 8rpx 28rpx rgba(0,0,0,0.06);
	transition: transform 0.2s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.2s;
	position: relative;
	z-index: 1;
	
	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: transparent;
		border-radius: 16rpx;
		transition: background-color 0.2s;
	}
	
	&:active {
		transform: translateY(4rpx) scale(0.98);
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
		
		&::after {
			background-color: rgba(0, 0, 0, 0.03);
		}
	}
}

.goods-image {
	width: 160rpx;
	height: 160rpx;
	border-radius: 8rpx;
	margin-right: 20rpx;
}

.goods-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	height: 160rpx;
}

.goods-name-wrap {
	display: flex;
	align-items: center;
	margin-bottom: 10rpx;
}

.goods-name {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
	margin-right: 10rpx;
}

.goods-desc {
	font-size: 24rpx;
	color: #999;
	margin-bottom: 20rpx;
}

.goods-bottom {
	display: flex;
	align-items: center;
	margin-top: auto;
}

.goods-price {
	font-size: 32rpx;
	color: #f01616;
	font-weight: bold;
}

.goods-action {
	margin-left: 20rpx;
	position: relative;
	z-index: 10;
}

.spec-icon {
	margin-left: 50rpx;
	width: 44rpx;
	height: 44rpx;
	position: relative;
	z-index: 10;
}

.num {
	font-size: 28rpx;
	color: #333;
}

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
	bottom: 0rpx; /* tabBar 高度约 100rpx，可按实际调整 */
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
	padding: 30rpx 30rpx 0rpx 30rpx;
	
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

.notice-wrapper {
	width: 97%;
	height: 30rpx;
	margin: 0 auto;
	background: #fff;
	padding: 15rpx 10rpx;
	display: flex;
	align-items: center;
	border-bottom: 1rpx solid #f5f5f5;
	margin-top: 15rpx;
}

.horn-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 16rpx;
}

.spec-popup {
	padding: 30rpx 30rpx 0 30rpx;
	display: flex;
	flex-direction: column;
	max-height: 80vh;
	box-sizing: border-box;

	.popup-header {
		display: flex;
		margin-bottom: 30rpx;
		.popup-image {
			width: 160rpx;
			height: 160rpx;
			border-radius: 8rpx;
			margin-right: 20rpx;
		}
		.popup-info {
			display: flex;
			flex-direction: column;
			justify-content: center;
			.popup-name {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 10rpx;
			}
			.popup-price {
				font-size: 32rpx;
				color: #f01616;
				font-weight: bold;
			}
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
				color: #333;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 36rpx;
			}

			.qty-number {
				margin: 0 20rpx;
				font-size: 32rpx;
			}
		}
	}

	.popup-footer {
		margin-top: auto;
		.confirm-btn {
			width: 100%;
			height: 90rpx;
			line-height: 90rpx;
			border-radius: 45rpx;
			background: linear-gradient(90deg, #ff4d4f, #ff0000);
			color: #fff;
			font-size: 32rpx;
			text-align: center;
		}
	}
}
</style>