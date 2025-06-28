<template>
	<view class="order-container">
		<!-- 顶部搜索框 -->
		<view class="search-box">
			<view class="search-input">
				<text class="iconfont icon-search"></text>
				<input type="text" v-model="searchKeyword" placeholder="搜索订单" confirm-type="search" @confirm="handleSearch" />
				<text class="clear-icon" v-if="searchKeyword" @tap="clearSearch">×</text>
			</view>
		</view>
		
		<!-- 订单状态分类 -->
		<view class="order-tabs">
			<view 
				class="tab-item" 
				v-for="(tab, index) in tabs" 
				:key="index"
				:class="{ active: currentTab === tab.value }"
				@tap="switchTab(tab.value)"
			>
				<text>{{ tab.name }}</text>
				<view class="active-line" v-if="currentTab === tab.value"></view>
			</view>
		</view>
		
		<!-- 订单列表 -->
		<scroll-view 
			scroll-y 
			class="order-list" 
			refresher-enabled 
			@refresherrefresh="refreshOrders" 
			:refresher-triggered="refreshing"
		>
			<template v-if="filteredOrders.length > 0">
				<view 
					class="order-item" 
					v-for="(order, index) in filteredOrders" 
					:key="index" 
					@tap="goToOrderDetail(order.id)"
				>
					<!-- 订单头部 -->
					<view class="order-header">
						<view class="shop-info">
							<text class="shop-name">雪王冰淇淋</text>
							<text class="iconfont icon-right"></text>
						</view>
						<view class="order-status" :class="getStatusClass(order.status)">
							{{ getStatusText(order.status) }}
						</view>
					</view>
					
					<!-- 订单商品 -->
					<view class="order-goods">
						<image :src="order.goods[0].image" mode="aspectFill" class="goods-image"></image>
						<view class="goods-info">
							<view class="goods-name">{{ order.goods[0].name }}</view>
							<view class="goods-spec">{{ order.goods[0].spec }}</view>
							<view class="goods-price">
								<text class="price">¥{{ order.goods[0].price.toFixed(2) }}</text>
								<text class="count">x{{ order.goods[0].count }}</text>
							</view>
						</view>
					</view>
					
					<!-- 更多商品提示 -->
					<view class="more-goods" v-if="order.goods.length > 1">
						<text>共{{ order.goods.length }}件商品</text>
						<text class="iconfont icon-right"></text>
					</view>
					
					<!-- 订单底部 -->
					<view class="order-footer">
						<view class="order-total">
							<text>合计：</text>
							<text class="total-price">¥{{ order.totalAmount.toFixed(2) }}</text>
						</view>
						<view class="order-actions">
							<button 
								class="action-btn" 
								v-for="(action, actionIndex) in getOrderActions(order.status)" 
								:key="actionIndex"
								:class="{ primary: action.primary }"
								@tap.stop="handleOrderAction(action.type, order.id)"
							>
								{{ action.text }}
							</button>
						</view>
					</view>
				</view>
			</template>
			
			<!-- 空状态 -->
			<view class="empty-state" v-else>
				<image src="/static/icons/empty-order.png" mode="aspectFit" class="empty-icon"></image>
				<text class="empty-text">暂无相关订单</text>
				<button class="go-shopping-btn" @tap="goShopping">去逛逛</button>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// 搜索关键词
const searchKeyword = ref('')

// 标签页配置
const tabs = [
	{ name: '全部', value: 'all' },
	{ name: '待付款', value: 'pending-payment' },
	{ name: '待发货', value: 'pending-delivery' },
	{ name: '待收货', value: 'pending-receipt' },
	{ name: '退款/售后', value: 'after-sale' }
]

// 当前选中的标签
const currentTab = ref('all')

// 刷新状态
const refreshing = ref(false)

// 模拟订单数据
const orders = ref([
	{
		id: '202405010001',
		status: 'pending-payment',
		createTime: '2024-05-01 14:30:25',
		goods: [
			{
				id: 'g001',
				name: '雪王经典香草冰淇淋',
				spec: '经典装 500ml',
				price: 29.9,
				count: 1,
				image: '/static/product/ice-cream1.jpg'
			}
		],
		totalAmount: 29.9
	},
	{
		id: '202405010002',
		status: 'pending-delivery',
		createTime: '2024-05-01 10:15:36',
		goods: [
			{
				id: 'g002',
				name: '雪王巧克力冰淇淋',
				spec: '家庭装 1L',
				price: 49.9,
				count: 1,
				image: '/static/product/ice-cream2.jpg'
			},
			{
				id: 'g003',
				name: '雪王草莓冰淇淋',
				spec: '经典装 500ml',
				price: 32.9,
				count: 2,
				image: '/static/product/ice-cream3.jpg'
			}
		],
		totalAmount: 115.7
	},
	{
		id: '202404300001',
		status: 'pending-receipt',
		createTime: '2024-04-30 16:45:12',
		goods: [
			{
				id: 'g004',
				name: '雪王芒果冰淇淋',
				spec: '经典装 500ml',
				price: 32.9,
				count: 1,
				image: '/static/product/ice-cream4.jpg'
			}
		],
		totalAmount: 32.9
	},
	{
		id: '202404290001',
		status: 'completed',
        createTime: '2024-04-29 15:20:33',
		goods: [
			{
				id: 'g005',
				name: '雪王抹茶冰淇淋',
                spec: '经典装 500ml',
                price: 35.9,
                count: 1,
                image: '/static/product/ice-cream5.jpg'
            },
            {
                id: 'g006',
                name: '雪王蓝莓冰淇淋',
				spec: '迷你装 200ml',
				price: 19.9,
                count: 2,
                image: '/static/product/ice-cream6.jpg'
			}
		],
        totalAmount: 75.7
    },
    {
        id: '202404280002',
        status: 'after-sale',
        createTime: '2024-04-28 09:45:18',
        goods: [
            {
                id: 'g007',
                name: '雪王牛奶冰淇淋',
                spec: '经典装 500ml',
                price: 29.9,
                count: 1,
                image: '/static/product/ice-cream7.jpg'
            }
        ],
        totalAmount: 29.9,
        afterSaleStatus: '退款处理中',
        afterSaleReason: '商品包装破损'
	},
	{
		id: '202404280001',
        status: 'completed',
        createTime: '2024-04-28 08:30:45',
		goods: [
			{
                id: 'g008',
                name: '雪王榴莲冰淇淋',
                spec: '尊享装 750ml',
                price: 59.9,
				count: 1,
                image: '/static/product/ice-cream8.jpg'
			}
		],
        totalAmount: 59.9
	}
])

// 根据当前标签和搜索关键词过滤订单
const filteredOrders = computed(() => {
	let result = orders.value
	
	// 根据标签过滤
	if (currentTab.value !== 'all') {
		result = result.filter(order => {
			if (currentTab.value === 'after-sale') {
				return order.status === 'after-sale' || order.afterSaleStatus
			}
			return order.status === currentTab.value
		})
	}
	
	// 根据关键词搜索
	if (searchKeyword.value) {
		const keyword = searchKeyword.value.toLowerCase()
		result = result.filter(order => {
			// 搜索订单号
			if (order.id.toLowerCase().includes(keyword)) return true
			
			// 搜索商品名称
			for (const goods of order.goods) {
				if (goods.name.toLowerCase().includes(keyword)) return true
			}
			
			return false
		})
	}
	
	return result
})

// 获取订单状态文本
const getStatusText = (status) => {
	const statusMap = {
		'pending-payment': '待付款',
		'pending-delivery': '待发货',
		'pending-receipt': '待收货',
		'completed': '已完成',
		'after-sale': '退款/售后'
	}
	return statusMap[status] || '未知状态'
}

// 获取订单状态样式类
const getStatusClass = (status) => {
	const classMap = {
		'pending-payment': 'status-warning',
		'pending-delivery': 'status-primary',
		'pending-receipt': 'status-primary',
		'completed': 'status-success',
		'after-sale': 'status-danger'
	}
	return classMap[status] || ''
}

// 获取订单操作按钮
const getOrderActions = (status) => {
	switch (status) {
		case 'pending-payment':
			return [
				{ text: '取消订单', type: 'cancel' },
				{ text: '去支付', type: 'pay', primary: true }
			]
		case 'pending-delivery':
			return [
				{ text: '申请退款', type: 'refund' },
				{ text: '提醒发货', type: 'remind', primary: true }
			]
		case 'pending-receipt':
			return [
				{ text: '查看物流', type: 'logistics' },
				{ text: '确认收货', type: 'confirm', primary: true }
			]
		case 'completed':
			return [
				{ text: '申请售后', type: 'after-sale' },
				{ text: '再次购买', type: 'rebuy', primary: true }
			]
		case 'after-sale':
			return [
				{ text: '查看详情', type: 'detail', primary: true }
			]
		default:
			return []
	}
}

// 处理订单操作
const handleOrderAction = (type, orderId) => {
	console.log('处理订单操作:', type, orderId)
	
	switch (type) {
		case 'pay':
			uni.showToast({ title: '跳转支付...', icon: 'none' })
			break
		case 'cancel':
			uni.showModal({
				title: '提示',
				content: '确定要取消该订单吗？',
				success: (res) => {
					if (res.confirm) {
						uni.showToast({ title: '订单已取消', icon: 'success' })
					}
				}
			})
			break
		case 'refund':
			uni.navigateTo({ url: `/pages/Order/refund?id=${orderId}` })
			break
		case 'remind':
			uni.showToast({ title: '已提醒商家发货', icon: 'success' })
			break
		case 'logistics':
			uni.navigateTo({ url: `/pages/Order/logistics?id=${orderId}` })
			break
		case 'confirm':
			uni.showModal({
				title: '提示',
				content: '确认已收到商品？',
				success: (res) => {
					if (res.confirm) {
						uni.showToast({ title: '确认收货成功', icon: 'success' })
					}
				}
			})
			break
		case 'after-sale':
			uni.navigateTo({ url: `/pages/Order/afterSale?id=${orderId}` })
			break
		case 'rebuy':
			uni.showToast({ title: '正在添加到购物车...', icon: 'none' })
			break
		case 'detail':
			uni.navigateTo({ url: `/pages/Order/detail?id=${orderId}` })
			break
	}
}

// 清除搜索关键词
const clearSearch = () => {
	searchKeyword.value = ''
}

// 处理搜索
const handleSearch = () => {
	console.log('搜索订单:', searchKeyword.value)
}

// 刷新订单列表
const refreshOrders = () => {
	refreshing.value = true
	
	// 模拟刷新
	setTimeout(() => {
		refreshing.value = false
		uni.showToast({ title: '刷新成功', icon: 'success' })
	}, 1000)
}

// 跳转到订单详情
const goToOrderDetail = (orderId) => {
	uni.navigateTo({
		url: `/pages/Order/detail?id=${orderId}`
	})
}

// 去购物
const goShopping = () => {
	uni.switchTab({
		url: '/pages/Home/Home'
	})
}

// 切换标签
const switchTab = (tab) => {
	currentTab.value = tab
}

// 页面加载时根据URL参数设置当前标签
const onLoad = (options) => {
    console.log('订单页面参数:', options);
    if (options?.status) {
        const validTab = tabs.find(tab => tab.value === options.status);
        if (validTab) {
            console.log('切换到标签:', options.status);
            currentTab.value = options.status;
            // 触发一次订单过滤
            nextTick(() => {
                console.log('已过滤的订单:', filteredOrders.value.length);
            });
        }
    }
}

// 导出页面生命周期钩子
defineExpose({
    onLoad
});

// 页面显示时刷新订单列表
const onShow = () => {
    console.log('页面显示，当前标签:', currentTab.value);
    // 可以在这里刷新订单列表
    
    // 确保有订单数据显示
    if (orders.value.length > 0) {
        console.log('订单数据已加载，共', orders.value.length, '条');
    } else {
        console.log('订单数据为空，重新初始化');
        // 如果没有数据，重新初始化订单数据
        initOrderData();
    }
};

// 初始化订单数据
const initOrderData = () => {
    // 这里可以调用API获取订单数据
    // 现在使用模拟数据
    console.log('初始化订单数据');
    
    // 确保订单数据被正确设置
    nextTick(() => {
        console.log('订单数据初始化完成，共', orders.value.length, '条');
        console.log('当前标签:', currentTab.value);
        console.log('过滤后订单数:', filteredOrders.value.length);
    });
};

// 页面初始化时调用
onMounted(() => {
    console.log('订单页面已挂载');
    // 初始化数据
    initOrderData();
    
    // 尝试从URL获取参数
    const pages = getCurrentPages();
    if (pages.length > 0) {
        const currentPage = pages[pages.length - 1];
        if (currentPage && currentPage.options) {
            const options = currentPage.options;
            console.log('从getCurrentPages获取参数:', options);
            if (options.status) {
                switchTab(options.status);
            }
		}
	}
});
</script>

<style lang="scss" scoped>
.order-container {
	height: 100vh;
	background-color: #f5f5f5;
	display: flex;
	flex-direction: column;
	
	.search-box {
		background-color: #fff;
		padding: 20rpx 30rpx;
		flex-shrink: 0;
		
		.search-input {
			display: flex;
			align-items: center;
			background-color: #f5f5f5;
			border-radius: 40rpx;
			padding: 0 20rpx;
			height: 70rpx;
			
			.iconfont {
				font-size: 32rpx;
				color: #999;
				margin-right: 10rpx;
			}
			
			input {
				flex: 1;
				height: 70rpx;
				font-size: 28rpx;
			}
			
			.clear-icon {
				font-size: 36rpx;
				color: #999;
				padding: 0 10rpx;
			}
		}
	}
	
	.order-tabs {
		display: flex;
		background-color: #fff;
		border-bottom: 1rpx solid #eee;
		flex-shrink: 0;
		
		.tab-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 80rpx;
			font-size: 28rpx;
			color: #333;
			position: relative;
			
			&.active {
				color: #2aeee6;
				font-weight: bold;
				
				.active-line {
					position: absolute;
					bottom: 0;
					width: 40rpx;
					height: 4rpx;
					background-color: #2aeee6;
					border-radius: 2rpx;
				}
			}
		}
	}
	
	.order-list {
		flex: 1;
		padding: 20rpx;
		margin: 0 auto;
		width: 100%;
		max-width: 750rpx;
		box-sizing: border-box;
		height: 0; /* 关键属性：让scroll-view正确计算高度 */
		
		.order-item {
			background-color: #fff;
			border-radius: 16rpx;
			margin: 0 auto 20rpx;
			padding: 30rpx;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
			max-width: 690rpx; /* 750rpx - 左右padding(30rpx * 2) */
			box-sizing: border-box;
			
			.order-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20rpx;
				
				.shop-info {
					display: flex;
					align-items: center;
					
					.shop-name {
						font-size: 28rpx;
						font-weight: bold;
						color: #333;
					}
					
					.iconfont {
						font-size: 24rpx;
						color: #999;
						margin-left: 6rpx;
					}
				}
				
				.order-status {
					font-size: 26rpx;
					
					&.status-warning {
						color: #ff9800;
					}
					
					&.status-primary {
						color: #2aeee6;
					}
					
					&.status-success {
						color: #4caf50;
					}
					
					&.status-danger {
						color: #f44336;
					}
				}
			}
			
			.order-goods {
				display: flex;
				padding: 20rpx 0;
				border-bottom: 1rpx solid #f5f5f5;
				
				.goods-image {
					width: 140rpx;
					height: 140rpx;
					border-radius: 8rpx;
					margin-right: 20rpx;
					background-color: #f5f5f5;
				}
				
				.goods-info {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					
					.goods-name {
						font-size: 28rpx;
						color: #333;
						margin-bottom: 10rpx;
					}
					
					.goods-spec {
						font-size: 24rpx;
						color: #999;
						margin-bottom: 10rpx;
					}
					
					.goods-price {
						display: flex;
						justify-content: space-between;
						
						.price {
							font-size: 28rpx;
							color: #333;
							font-weight: bold;
						}
						
						.count {
							font-size: 24rpx;
							color: #999;
						}
					}
				}
			}
			
			.more-goods {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				padding: 16rpx 0;
				font-size: 24rpx;
				color: #999;
				
				.iconfont {
					font-size: 24rpx;
					margin-left: 6rpx;
				}
			}
			
			.order-footer {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-top: 20rpx;
				
				.order-total {
					font-size: 26rpx;
					color: #666;
					
					.total-price {
						font-size: 30rpx;
						font-weight: bold;
						color: #333;
					}
				}
				
				.order-actions {
					display: flex;
					gap: 20rpx;
					
					.action-btn {
						font-size: 24rpx;
						padding: 0 30rpx;
						height: 60rpx;
						line-height: 60rpx;
						border-radius: 30rpx;
						background-color: #fff;
						color: #333;
						border: 1rpx solid #ddd;
						
						&.primary {
							background-color: #2aeee6;
							color: #fff;
							border: none;
						}
					}
				}
			}
		}
		
		.empty-state {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 100rpx 0;
			
			.empty-icon {
				width: 200rpx;
				height: 200rpx;
				margin-bottom: 30rpx;
			}
			
			.empty-text {
				font-size: 28rpx;
				color: #999;
				margin-bottom: 40rpx;
			}
			
			.go-shopping-btn {
				font-size: 28rpx;
				padding: 0 60rpx;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 40rpx;
				background-color: #2aeee6;
				color: #fff;
			}
		}
	}
}
</style>