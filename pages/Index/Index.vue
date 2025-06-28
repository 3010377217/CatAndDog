<template>
	<view class="container">
		<!-- 卡片式轮播图 -->
		<view class="banner-container">
			<u-swiper
				:list="bannerList"
				height="200"
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
		<!--瀑布流商品卡片 -->
		<view class="waterfall-container">
			<view v-if="!pageInfo.initialized" class="waterfall-loading">
				<view class="loading-text">商品数据加载中...</view>
			</view>
			<view v-else class="waterfall-columns">
				<!-- 左列 -->
				<view class="waterfall-column">
					<view v-for="(item, index) in leftColumn" :key="index" class="goods-item">
						<view 
							class="goods-card" 
							:class="{ 'card-active': activeCardId === item.id }"
							@touchstart="handleCardTouchStart(item.id)" 
							@touchend="handleCardTouchEnd(item.id)"
							@touchcancel="handleCardTouchEnd(item.id)"
							@tap="showGoodsDetail(item)"
						>
							<image :src="item.image" mode="widthFix" class="goods-image" @load="(e)=>onImageLoad(e,'left')"></image>
							<view class="goods-info">
								<text class="goods-title">{{item.title}}</text>
								<text class="goods-desc">{{item.description}}</text>
								<view class="goods-price-box">
									<text class="goods-price">¥{{item.price}}</text>
									<text class="goods-sales">已售{{item.sales}}件</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 右列 -->
				<view class="waterfall-column">
					<view v-for="(item, index) in rightColumn" :key="index" class="goods-item">
						<view 
							class="goods-card" 
							:class="{ 'card-active': activeCardId === item.id }"
							@touchstart="handleCardTouchStart(item.id)" 
							@touchend="handleCardTouchEnd(item.id)"
							@touchcancel="handleCardTouchEnd(item.id)"
							@tap="showGoodsDetail(item)"
						>
							<image :src="item.image" mode="widthFix" class="goods-image" @load="(e)=>onImageLoad(e,'right')"></image>
							<view class="goods-info">
								<text class="goods-title">{{item.title}}</text>
								<text class="goods-desc">{{item.description}}</text>
								<view class="goods-price-box">
									<text class="goods-price">¥{{item.price}}</text>
									<text class="goods-sales">已售{{item.sales}}件</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 加载状态提示 -->
		<view class="loading-status" v-if="pageInfo.initialized">
			<view v-if="pageInfo.loading" class="loading">
				<text>加载中...</text>
			</view>
			<view v-else-if="!pageInfo.hasMore" class="no-more">
				<text>没有更多数据了</text>
			</view>
		</view>
		
		<!-- 商品详情弹出层 -->
		<goods-detail-popup 
			v-model:show="showPopup" 
			:item="selectedGoods"
			@add-to-cart="handleAddToCart"
		/>
	</view>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { onPullDownRefresh, onPageScroll as uniPageScroll, onReady } from '@dcloudio/uni-app'
import { useShopStore } from '@/stores/shop.js'
import GoodsDetailPopup from '@/components/GoodsDetailPopup.vue'

// 获取shop store
const shopStore = useShopStore()

// 商品详情弹出层相关
const showPopup = ref(false)
const selectedGoods = ref(null)

// 当前活动卡片ID (用于触摸交互)
const activeCardId = ref(null)

// 卡片触摸事件处理
const handleCardTouchStart = (id) => {
  activeCardId.value = id
}

const handleCardTouchEnd = () => {
  // 延迟一点点再移除活动状态，使动画效果更好
  setTimeout(() => {
    activeCardId.value = null
  }, 50)
}

// 显示商品详情
const showGoodsDetail = (item) => {
	// 转换格式为弹窗所需的格式
	selectedGoods.value = {
		id: item.id,
		name: item.title,
		description: item.description,
		price: item.price,
		image: item.image
	}
	showPopup.value = true
}

// 处理添加到购物车
const handleAddToCart = (data) => {
	const { item, quantity } = data
	// 这里可以添加购物车逻辑
	shopStore.updateGoodsNum(item.id, quantity)
	
	uni.showToast({
		title: `已添加${quantity}件到购物车`,
		icon: 'success'
	})
}

// 给 throttle 默认 600ms，避免并发
const throttle = (fn, delay = 600) => {
    let lastTime = 0
    return function(...args) {
        const now = Date.now()
        if (now - lastTime >= delay) {
            fn.apply(this, args)
            lastTime = now
        }
    }
}

// 页面滚动节流监听 – 与 loadMoreGoods 耗时保持一致
const throttledPageScroll = throttle((e) => {
    if (!pageInfo.loading && pageInfo.hasMore) {
        checkScrollPosition(e.scrollTop)
    }
})

// 注册页面滚动监听
uniPageScroll(throttledPageScroll)

// 轮播图数据
const bannerList = ref([
	 '/static/picture/food1.jpg',
	 '/static/picture/food2.jpg',
	 '/static/picture/food3.jpg',
	 '/static/picture/4.jpg'
])

// 当前显示的索引
const currentIndex = ref(0)
// 前一个索引（用于淡出效果）
const prevIndex = ref(-1)
// 自动播放定时器
let autoplayTimer = null

// 触摸相关状态
const touchStartX = ref(0)
const touchStartY = ref(0)
const isTouching = ref(false)
const touchDeltaX = ref(0)
const isTransitioning = ref(false)


// 切换到指定幻灯片
const goToSlide = (index) => {
	if (index === currentIndex.value || isTransitioning.value) return
	
	isTransitioning.value = true
	prevIndex.value = currentIndex.value
	currentIndex.value = index
	
	// 800ms后重置过渡状态和前一个索引，与CSS过渡时间匹配
	setTimeout(() => {
		prevIndex.value = -1
		isTransitioning.value = false
	}, 800)
}

// 切换到下一张幻灯片
const nextSlide = () => {
	goToSlide((currentIndex.value + 1) % bannerList.value.length)
}

// 切换到上一张幻灯片
const prevSlide = () => {
	goToSlide((currentIndex.value - 1 + bannerList.value.length) % bannerList.value.length)
}

// 启动自动播放
const startAutoplay = () => {
	stopAutoplay()
	autoplayTimer = setInterval(() => {
		nextSlide()
	}, 4000) // 4秒切换一次
}

// 停止自动播放
const stopAutoplay = () => {
	if (autoplayTimer) {
		clearInterval(autoplayTimer)
		autoplayTimer = null
	}
}

// 触摸事件处理
const handleTouchStart = (e) => {
	if (isTransitioning.value) return
	
	touchStartX.value = e.touches[0].clientX
	touchStartY.value = e.touches[0].clientY
	isTouching.value = true
	touchDeltaX.value = 0
	stopAutoplay() // 触摸时停止自动播放
}

const handleTouchMove = (e) => {
	if (!isTouching.value) return
	
	const deltaX = e.touches[0].clientX - touchStartX.value
	const deltaY = e.touches[0].clientY - touchStartY.value
	
	// 如果垂直滑动距离大于水平滑动距离，则不处理轮播图滑动
	if (Math.abs(deltaY) > Math.abs(deltaX)) {
		isTouching.value = false
		return
	}
	
	touchDeltaX.value = deltaX
	// 阻止页面滚动
	e.preventDefault && e.preventDefault()
}

const handleTouchEnd = () => {
	if (!isTouching.value) return
	
	isTouching.value = false
	const threshold = 20 // 滑动阈值
	
	if (Math.abs(touchDeltaX.value) > threshold) {
		if (touchDeltaX.value > 0) {
			// 向右滑动，显示上一张
			prevSlide()
		} else {
			// 向左滑动，显示下一张
			nextSlide()
		}
	}
	
	touchDeltaX.value = 0
	startAutoplay() // 触摸结束后重新开始自动播放
}

// 组件挂载时启动自动播放
onMounted(() => {
	startAutoplay()
})

// 组件卸载时清除定时器
onUnmounted(() => {
	stopAutoplay()
})

// 瀑布流数据
const goodsList = ref([])

// 分页参数
const pageInfo = reactive({
	page: 1,
	pageSize: 10,
	hasMore: true,
	loading: false,
	initialized: false // 是否已完成初始化
})

// 左右列数据
const leftColumn = ref([])
const rightColumn = ref([])

// 左右列高度
const leftHeight = ref(0)
const rightHeight = ref(0)

// 初始化瀑布流数据
const initWaterfall = () => {
	leftColumn.value = []
	rightColumn.value = []
	leftHeight.value = 0
	rightHeight.value = 0
}

// 使用图片 onLoad 返回尺寸，减少系统 API 调用
const onImageLoad = (e, column) => {
	const { width, height } = e.detail || {}
	if (!width || !height) return

	const columnWidth = uni.getSystemInfoSync().windowWidth * 0.9 / 2 // 两列，容器 90%
	const scaledHeight = (height / width) * columnWidth + 200 // 加上文字等内容预估

	if (column === 'left') {
		leftHeight.value += scaledHeight
	} else {
		rightHeight.value += scaledHeight
	}

	// 图片实际渲染完后再更新容器高度，保证滚动检测准确
	uni.createSelectorQuery().select('.container').boundingClientRect(res => {
		if (res) containerHeight = res.height
	}).exec()
}

// 防抖函数
let lastLoadTime = 0
let containerHeight = 0

// 初始化时获取容器高度
onMounted(() => {
	const query = uni.createSelectorQuery()
	query.select('.container').boundingClientRect(data => {
		if (data) containerHeight = data.height
	}).exec()
})

const throttleLoadMore = () => {
	const now = Date.now()
	if (now - lastLoadTime > 600) { // 与 throttle 保持一致
		lastLoadTime = now
		console.log('触发了上拉加载更多')
		loadMoreGoods()
	}
}

// 列高均衡变量
let lastInsertLeft = false // 记录上一次是否插入左列

// 根据每次插入后实时更新的列高差，把新商品合理分配到两列
const updateWaterfall = (newItems) => {
	// 获取卡片估算高度：默认估计每个卡片约 500px
	const getEstimatedHeight = () => 500
	
	// 强制前两个商品交替放置，确保两列都有数据
	if (newItems.length > 0) {
		leftColumn.value.push(newItems[0])
		lastInsertLeft = true
		// 模拟更新高度
		leftHeight.value += getEstimatedHeight()
	}
	
	if (newItems.length > 1) {
		rightColumn.value.push(newItems[1])
		lastInsertLeft = false
		// 模拟更新高度
		rightHeight.value += getEstimatedHeight()
	}
	
	// 处理剩余商品，每次实时计算高度差
	newItems.forEach((item, index) => {
		// 跳过已处理的前两个商品
		if (index < 2) {
			return
		}
		
		// 每次放置前重新计算当前列高差
		const diff = leftHeight.value - rightHeight.value
		
		// 始终放入较矮的列，保持列高平衡
		if (diff > 0) {
			// 左列更高，放入右列
			rightColumn.value.push(item)
			rightHeight.value += getEstimatedHeight() // 立即更新高度
			lastInsertLeft = false
		} else {
			// 右列更高或相等，放入左列
			leftColumn.value.push(item)
			leftHeight.value += getEstimatedHeight() // 立即更新高度
			lastInsertLeft = true
		}
	})
}

// 主动检查滚动位置
let isTriggered = false
const checkScrollPosition = (scrollTop) => {
	if (!containerHeight) return

	const windowHeight = uni.getSystemInfoSync().windowHeight
	const distanceToBottom = containerHeight - (scrollTop + windowHeight)
	const triggerPx = rpxToPx(TRIGGER_HEIGHT_RPX)

	if (distanceToBottom <= triggerPx && !isTriggered) {
		isTriggered = true
		throttleLoadMore()
	} else if (distanceToBottom > triggerPx * 2) {
		isTriggered = false
	}
}

// 下拉刷新
onPullDownRefresh(() => {
	console.log('触发了下拉刷新')
	// 重置数据
	goodsList.value = []
	leftColumn.value = []
	rightColumn.value = []
	leftHeight.value = 0
	rightHeight.value = 0
	pageInfo.page = 1
	pageInfo.hasMore = true
	pageInfo.initialized = false
	
	// 重新加载数据
	initGoodsData()
	
	// 完成刷新
	setTimeout(() => {
		uni.stopPullDownRefresh()
	}, 1000)
})

// 页面加载和准备就绪时初始化
onMounted(() => {
	startAutoplay()
	// 初始化瀑布流结构，但不加载数据（避免重复加载）
	initWaterfall()
})

// 当页面准备就绪时加载商品数据
onReady(() => {
	// 首次加载商品数据
	initGoodsData()
})

const TRIGGER_HEIGHT_RPX = 400 // 距离底部 400rpx 触发
const rpxToPx = (rpx) => rpx * uni.getSystemInfoSync().windowWidth / 750

// 从API获取的商品数据转换为瀑布流所需格式
const transformShopGoods = (goodsItems) => {
	return goodsItems.map(item => ({
		id: item.id,
		title: item.name,
		price: item.price.toFixed(2),
		sales: item.sales || Math.floor(Math.random() * 500) + 50,
		image: item.image,
		description: item.description
	}))
}

// 初始化商品数据
const initGoodsData = () => {
	if (pageInfo.loading) return
	
	// 显示加载中状态
	pageInfo.loading = true
	
	// 使用shopStore的fetchGoods方法获取数据
	shopStore.fetchGoods(1, pageInfo.pageSize).then(result => {
		// 转换数据格式
		const transformedGoods = transformShopGoods(result.data)
		
		// 更新商品列表
		goodsList.value = transformedGoods
		
		// 更新瀑布流
		updateWaterfall(transformedGoods)
		
		// 更新分页状态
		pageInfo.page = 2
		pageInfo.hasMore = result.pagination.hasMore
		pageInfo.loading = false
		pageInfo.initialized = true
		
		console.log('商品数据初始化完成')
	}).catch(error => {
		console.error('获取商品数据失败:', error)
		pageInfo.loading = false
		
		// 显示错误提示
		uni.showToast({
			title: '加载数据失败，请稍后再试',
			icon: 'none'
		})
	})
}

// 加载更多商品
const loadMoreGoods = () => {
	// 如果正在加载或没有更多数据，则不执行
	if (pageInfo.loading || !pageInfo.hasMore || !pageInfo.initialized) return
	
	// 设置加载中状态
	pageInfo.loading = true
	
	// 使用shopStore的fetchGoods方法获取下一页数据
	shopStore.fetchGoods(pageInfo.page, pageInfo.pageSize).then(result => {
		// 转换数据格式
		const transformedGoods = transformShopGoods(result.data)
		
		// 添加到商品列表
		goodsList.value = [...goodsList.value, ...transformedGoods]
		
		// 更新瀑布流
		updateWaterfall(transformedGoods)
		
		// 更新分页状态
		pageInfo.page++
		pageInfo.hasMore = result.pagination.hasMore
		pageInfo.loading = false
		
		// 更新容器高度，保证触底计算准确
		uni.createSelectorQuery().select('.container').boundingClientRect(res => {
			if (res) containerHeight = res.height
		}).exec()
		
		isTriggered = false
	}).catch(error => {
		console.error('加载更多商品失败:', error)
		pageInfo.loading = false
		isTriggered = false
		
		// 显示错误提示
		uni.showToast({
			title: '加载数据失败，请稍后再试',
			icon: 'none'
		})
	})
}

// 商品详情页导航（弃用，改为弹窗显示）
const navigateToDetail = (id) => {
	uni.navigateTo({
		url: `/pages/Goods/Detail?id=${id}`
	})
}
</script>

<style lang="scss">
.container {
	display: flex;
	flex-direction: column;
	padding-top: 20rpx;
	box-sizing: border-box;
	
}

.waterfall-loading {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 300rpx;
	width: 100%;
	
	.loading-text {
		font-size: 28rpx;
		color: #999;
	}
}

.fade-swiper-box {
	margin: 0 auto;
	width: 95%;
	height: 400rpx; /* 减小轮播图高度 */
	position: relative;
	overflow: hidden;
	border-radius: 12rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.custom-fade-swiper {
	width: 100%;
	height: 100%;
	position: relative;
}

.swiper-item {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
	transition: opacity 0.8s ease;
	will-change: opacity;
	display: flex;
	justify-content: center;
	align-items: center;
	
	&.active {
		opacity: 1;
		z-index: 2;
		animation: fadeIn 1.3s ease forwards;
	}
	
	&.prev {
		opacity: 0;
		z-index: 1;
		animation: fadeOut 1.3s ease forwards;
	}
	
	&.no-transition {
		transition: none;
		animation: none;
	}
}

.swiper-image {
	width: 100%;
	height: 100%;
	object-fit: contain;
	display: block;
	background-color: #f5f5f5; /* 添加背景色，防止图片较小时容器空白 */
}

.indicator {
	position: absolute;
	bottom: 20rpx;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	gap: 16rpx;
	z-index: 3;
	padding: 8rpx 16rpx;
	border-radius: 30rpx;
	background-color: rgba(0, 0, 0, 0.2);
}

.dot {
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
	background-color: rgba(255, 255, 255, 0.5);
	transition: all 0.3s ease;
	cursor: pointer;
	
	&.active {
		background-color: #ffffff;
		transform: scale(1.3);
	}
}

/* 淡入淡出动画 */
@keyframes fadeIn {
	from { opacity: 0; }
	to { opacity: 1; }
}

@keyframes fadeOut {
	from { opacity: 1; }
	to { opacity: 0; }
}

/* 瀑布流样式 */
.waterfall-container {
	padding: 0rpx 2%;
	padding-top: 20rpx;
	box-sizing: border-box;
	width: 100%;
}

.waterfall-columns {
	display: flex;
	justify-content: space-between;
	width: 100%;
}

.waterfall-column {
	width: 48%; /* 两列，留间隙 */
}

.goods-item {
	margin-bottom: 30rpx; /* 增加卡片之间的间距 */
	border-radius: 16rpx;
	overflow: hidden;
	padding: 2rpx; /* 添加小间距，突出边框 */
}

.goods-card {
	background-color: #ffffff;
	border-radius: 16rpx;
	box-shadow: 0 10rpx 25rpx rgba(0, 0, 0, 0.12), 0 4rpx 10rpx rgba(0, 0, 0, 0.06);
	overflow: hidden;
	transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
	transform: translateZ(0) scale(1);
	border: 3rpx solid rgba(215, 215, 215, 0.95); /* 边框更粗且更明显 */
	position: relative;
	will-change: transform, box-shadow;
	
	/* 顶部边缘高光效果 */
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2rpx;
		background: linear-gradient(to right, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.5));
		z-index: 1;
	}
	
	/* 左右边缘阴影效果 */
	&::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 4rpx;
		background: linear-gradient(to right, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.03));
		z-index: 1;
	}
	
	/* 按下状态样式 */
	&.card-active {
		transform: translateZ(0) scale(0.95);
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.08), 0 2rpx 5rpx rgba(0, 0, 0, 0.04);
	}
}

.goods-image {
	width: 100%;
	height: auto;
	display: block;
	transition: transform 0.3s ease;
	
	&:active {
		transform: scale(0.98);
	}
}

.goods-info {
	padding: 24rpx 20rpx; /* 增加内部间距 */
	position: relative;
	
	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: 10%;
		right: 10%;
		height: 1rpx;
		background: linear-gradient(to right, transparent, rgba(200, 200, 200, 0.5), transparent);
	}
}

.goods-title {
	font-size: 28rpx;
	color: #333333;
	line-height: 1.5;
	font-weight: 600; /* 加粗标题 */
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	margin-bottom: 10rpx; /* 增加下方间距 */
}

.goods-desc {
	font-size: 24rpx;
	color: #999999;
	line-height: 1.3;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	margin-bottom: 8rpx;
}

.goods-price-box {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 16rpx; /* 增加上方间距 */
}

.goods-price {
	font-size: 36rpx; /* 增大价格字体 */
	color: #ff4400; /* 更鲜艳的价格颜色 */
	font-weight: bold;
	text-shadow: 0 2rpx 3rpx rgba(255, 68, 0, 0.15); /* 增强价格文字阴影 */
}

.goods-sales {
	font-size: 24rpx;
	color: #999999;
	background-color: rgba(245, 245, 245, 0.9);
	padding: 6rpx 12rpx; /* 增加内部填充 */
	border-radius: 20rpx;
	box-shadow: inset 0 1rpx 2rpx rgba(0, 0, 0, 0.05); /* 内阴影增加立体感 */
}

/* 加载状态样式 */
.loading-status {
	width: 100%;
	height: 80rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 20rpx 0;
}

.loading, .no-more {
	font-size: 26rpx;
	color: #999;
	text-align: center;
}

.loading {
	display: flex;
	align-items: center;
}

.no-more {
	padding: 10rpx 0;
}
</style>