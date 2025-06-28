<template>
	<view class="my-container">
		<!-- 未登录状态 -->
		<template v-if="!isLogin">
			<!-- 用户信息和功能区域 -->
			<view class="user-card">
				<!-- 顶部用户信息区域 -->
				<view class="user-info-section" @tap="handleLogin">
					<image src="/static/logo.png" mode="aspectFit" class="avatar"></image>
					<view class="user-details">
						<view class="login-group">
							<text class="nickname">请登录/注册您的账号</text>
							<view class="login-btn" @tap="handleLogin">
								<text>点击登录</text>
								<text class="iconfont icon-right"></text>
							</view>
						</view>
					</view>
					<view class="arrow-right">
						<text class="iconfont icon-right"></text>
					</view>
				</view>

				<!-- 功能区域 -->
				<view class="function-area">
					<view class="function-item">
						<text class="function-value">***</text>
						<text class="function-title">喵币</text>
					</view>
					<view class="function-item">
						<text class="function-value">***</text>
						<text class="function-title">优惠券</text>
					</view>
					<view class="function-item">
						<text class="function-value">登录后查看</text>
						<text class="function-title">礼品卡</text>
					</view>
				</view>
			</view>
		</template>
		
		<!-- 已登录状态 -->
		<template v-else>
			<!-- 用户信息和功能区域 -->
			<view class="user-card">
				<!-- 顶部用户信息区域 -->
				<view class="user-info-section" @tap="goToProfile">
					<image :src="userInfo.avatarUrl || '/static/logo.png'" mode="aspectFit" class="avatar"></image>
					<view class="user-details">
						<text class="nickname">{{ userInfo.nickName }}</text>
					</view>
					<view class="arrow-right">
						<text class="iconfont icon-right"></text>
					</view>
				</view>

				<!-- 功能区域 -->
				<view class="function-area">
					<view class="function-item">
						<text class="function-value">{{ userInfo.points || 0 }}</text>
						<text class="function-title">喵币</text>
					</view>
					<view class="function-item">
						<text class="function-value">{{ userInfo.coupons || 0 }}</text>
						<text class="function-title">优惠券</text>
					</view>
					<view class="function-item">
						<text class="function-value">{{ userInfo.giftCards || 0 }}</text>
						<text class="function-title">礼品卡</text>
					</view>
				</view>
			</view>

			<!-- 会员等级区域 -->
			<view class="vip-section">
				<view class="vip-title">
					<text class="vip-level">哈基咪</text>
					<text class="vip-progress">哈基值 666/1000</text>
					
				</view>
				<view class="vip-desc">
					<text>当前可享受的权益</text>
					<text class="vip-link">您已解锁12项特权 ></text>
				</view>
			</view>
		
			<!-- 订单状态卡片 -->
			<view class="order-section">
				<view class="order-header">
					<text class="order-title">我的订单</text>
					<view class="view-all" @tap="handleCellClick('orders')">
						<text>查看全部</text>
						<text class="iconfont icon-arrow"></text>
					</view>
				</view>
				<view class="order-status">
					<view class="status-item" @tap="handleCellClick('pending-payment')">
						<image src="/static/icons/DaiFuKuan.png" mode="aspectFit" class="status-icon"></image>
						<text class="status-text">待付款</text>
					</view>
					<view class="status-item" @tap="handleCellClick('pending-delivery')">
						<image src="/static/icons/DaiFaHuo.png" mode="aspectFit" class="status-icon"></image>
						<text class="status-text">待发货</text>
					</view>
					<view class="status-item" @tap="handleCellClick('pending-receipt')">
						<image src="/static/icons/DaiShouHuo.png" mode="aspectFit" class="status-icon"></image>
						<text class="status-text">待收货</text>
					</view>
					<view class="status-item" @tap="handleCellClick('after-sale')">
						<image src="/static/icons/Refund.png" mode="aspectFit" class="status-icon"></image>
						<text class="status-text">退款/售后</text>
					</view>
				</view>
			</view>
			
		</template>

		<!-- "我的服务"通用功能单元格，登录和未登录都显示 -->
		<view class="cells-section">
			<view class="section-title">我的服务</view>
			<view class="cells">
				<view class="cell-item" @tap="handleCellClick('profile')">
					<view class="cell-left">
						<image src="/static/icons/MyMessage.png" mode="aspectFit" class="cell-icon"></image>
						<text class="cell-title">个人资料</text>
					</view>
					<text class="iconfont icon-arrow"></text>
				</view>
				<view class="cell-item" @tap="handleCellClick('address')">
					<view class="cell-left">
						<image src="/static/icons/Address.png" mode="aspectFit" class="cell-icon"></image>
						<text class="cell-title">地址管理</text>
					</view>
					<text class="iconfont icon-arrow"></text>
				</view>
				<view class="cell-item" @tap="handleCellClick('posts')">
					<view class="cell-left">
						<image src="/static/icons/Post.png" mode="aspectFit" class="cell-icon"></image>
						<text class="cell-title">我的贴子</text>
					</view>
					<text class="iconfont icon-arrow"></text>
				</view>
				<view class="cell-item" @tap="handleCellClick('favorites')">
					<view class="cell-left">
						<image src="/static/icons/Collect-active.png" mode="aspectFit" class="cell-icon"></image>
						<text class="cell-title">我的收藏</text>
					</view>
					<text class="iconfont icon-arrow"></text>
				</view>
				<view class="cell-item" @tap="handleCellClick('promotion')">
					<view class="cell-left">
						<image src="/static/icons/Popularize.png" mode="aspectFit" class="cell-icon"></image>
						<text class="cell-title">成为推广商</text>
					</view>
					<text class="iconfont icon-arrow"></text>
				</view>
				
			</view>
		</view>
		<!-- 更多服务 -->
		<view class="more-services">
			<view class="section-title">更多服务</view>
			<view class="services-grid">
				<view class="service-item" v-for="service in services" :key="service.id" @tap="handleCellClick(service.id)">
					<view class="icon-wrapper">
						<image :src="service.icon" mode="aspectFit" class="service-icon"></image>
					</view>
					<text class="service-name">{{ service.name }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

// 当前选中的签到标签
const currentTab = ref('daily')

// 服务列表
const services = ref([
	{ 
		id: 'exchange',
		name: '兑换中心',
		icon: '/static/icons/Exchange.png'
	},
	{ 
		id: 'feedback',
		name: '问题反馈',
		icon: '/static/icons/Feedback.png'
	},
	{ 
		id: 'join',
		name: '加盟咨询',
		icon: '/static/icons/Join.png'
	},
	{ 
		id: 'about',
		name: '关于我们',
		icon: '/static/icons/AboutUs.png'
	}
])

// 获取用户 store
const userStore = useUserStore()
// 解构需要的状态，使用 storeToRefs 保持响应性
const { isLogin, userInfo } = storeToRefs(userStore)

// 获取用户信息
const getUserInfo = () => {
	return new Promise((resolve, reject) => {
		// #ifdef MP-WEIXIN
		console.log('【getUserInfo】进入微信小程序环境，准备调用wx.getUserProfile');
		wx.getUserProfile({
			lang: 'zh_CN',
			desc: '用于完善会员资料', 
			success: (res) => {
				console.log('【getUserInfo】wx.getUserProfile调用成功', res);
				if (res.userInfo) {
					console.log('【getUserInfo】昵称:', res.userInfo.nickName, '头像URL:', res.userInfo.avatarUrl);
				}
				resolve(res.userInfo)
			},
			fail: (err) => {
				console.log('【getUserInfo】wx.getUserProfile调用失败', err);
				reject(err)
			}
		})
		// #endif
		// #ifndef MP-WEIXIN
		console.log('【getUserInfo】非微信小程序环境，返回mock用户信息');
		resolve({
			nickName: '游客',
			avatarUrl: '/static/logo.png'
		})
		// #endif
	})
}

// 获取登录凭证
const getLogin = () => {
	return new Promise((resolve, reject) => {
		// #ifdef MP-WEIXIN
		wx.login({
			success(res) {
				resolve(res.code)
			},
			fail: (err) => {
				reject(err)
			}
		})
		// #endif
		// #ifndef MP-WEIXIN
		resolve('mock-code-for-non-weixin')
		// #endif
	})
}

// 处理登录事件
const handleLogin = async () => {
	// 如果已登录（本地有 token），直接返回，不再弹出授权
	if (isLogin.value) {
		uni.showToast({ title: '您已登录', icon: 'none' })
		return
	}

	// 防抖处理
	const now = Date.now()
	if (now - lastClickTime.value < 500) return
	lastClickTime.value = now

	if (loginLoading.value) return
	loginLoading.value = true

	try {
		// 只有未登录时才走微信授权
		const [userInfo, code] = await Promise.all([getUserInfo(), getLogin()])
		const res = await uniCloud.callFunction({
			name: 'user-login',
			data: {
				code,
				userInfo: {
					nickName: userInfo.nickName,
					avatarUrl: userInfo.avatarUrl
				}
			}
		})
		const result = res.result
		if (result.code === 0) {
			await userStore.login({
				...userInfo,
				...result.data.userInfo,
				token: result.data.token
			})
			uni.showToast({ title: '登录成功', icon: 'success' })
		} else {
			uni.showToast({ title: result.message || '登录失败', icon: 'none' })
		}
	} catch (error) {
		console.error('登录失败:', error)
		let errMsg = '登录失败'
		if (error.message && error.message.includes('url not in domain list')) {
			errMsg = '请配置云函数域名\\n小程序后台->开发设置->服务器域名'
		}
		uni.showModal({
			title: '提示',
			content: errMsg,
			showCancel: false
		})
	} finally {
		loginLoading.value = false
	}
}

// 在data()中添加状态变量
const loginLoading = ref(false)
const lastClickTime = ref(0)

// 跳转到个人资料页面
const goToProfile = () => {
	uni.navigateTo({
		url: '/pages/My/profile/index'
	})
}

// 页面加载时检查登录状态
onMounted(async () => {
	await userStore.checkLoginStatus()
})

// 单元格点击处理
const handleCellClick = (type) => {
	if (!isLogin.value) {
		uni.showToast({
			title: '请先登录',
			icon: 'none'
		})
		return
	}
	switch (type) {
		case 'profile':
			uni.navigateTo({
				url: '/pages/My/profile/index'
			});
			break;
		case 'address':
			uni.navigateTo({
				url: '/pages/My/address/index'
			});
			break;
		case 'posts':
			uni.navigateTo({
				url: '/pages/My/posts/index'
			});
			break;
		case 'favorites':
			uni.navigateTo({
				url: '/pages/My/favorites/index'
			});
			break;
		case 'promotion':
			uni.navigateTo({
				url: '/pages/My/promotion/index'
			});
			break;
		case 'exchange':
			uni.navigateTo({
				url: '/pages/My/exchange/index'
			});
			break;
		case 'feedback':
			uni.navigateTo({
				url: '/pages/My/feedback/index'
			});
			break;
		case 'join':
			uni.navigateTo({
				url: '/pages/My/join/index'
			});
			break;
		case 'about':
			uni.navigateTo({
				url: '/pages/My/about/index'
			});
			break;
		// 订单相关页面
		case 'orders':
			uni.navigateTo({
				url: '/pages/Order/index'
			});
			break;
		case 'pending-payment':
			uni.navigateTo({
				url: '/pages/Order/index?status=pending-payment'
			});
			break;
		case 'pending-delivery':
			uni.navigateTo({
				url: '/pages/Order/index?status=pending-delivery'
			});
			break;
		case 'pending-receipt':
			uni.navigateTo({
				url: '/pages/Order/index?status=pending-receipt'
			});
			break;
		case 'after-sale':
			uni.navigateTo({
				url: '/pages/Order/index?status=after-sale'
			});
			break;
	}
}
</script>

<style lang="scss" scoped>
.my-container {
	min-height: 100vh;
	background: linear-gradient(180deg, #F8F1FF 0%, #F5F5F5 100%);
	padding: 20rpx;
	display: flex;
	flex-direction: column;
	gap: 10rpx;
	box-sizing: border-box;
	
	.user-card {
		margin-top: 30rpx;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

		.user-info-section {
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;
			padding-bottom: 20rpx;
			border-bottom: 1rpx solid #f5f5f5;
			
			.avatar {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}
			
			.user-details {
				margin-left: 20rpx;  /* 添加左边距 */
			}

			.user-details {
				
				
				.nickname {
					font-size: 32rpx;
					font-weight: bold;
					color: #333;
					margin-bottom: 10rpx;
				}
				
				

				.login-group {
					display: flex;
					flex-direction: column;
					
					
					.nickname {
						margin-bottom: 10rpx;
					}
					
					.login-btn {
						width: 100rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 24rpx;
						color: #fff;
						padding: 8rpx 20rpx;
						background: linear-gradient(135deg, #2aeee6 0%, #1ac7c0 100%);
						border-radius: 10rpx;
						box-shadow: 0 4rpx 12rpx rgba(42, 238, 230, 0.3);
						
						.iconfont {
							font-size: 20rpx;
							margin-left: 6rpx;
						}
					}
				}
			}

			.arrow-right {
				color: #999;
				font-size: 24rpx;
				display: flex;
				align-items: center;
				
				.iconfont {
					font-size: 28rpx;
				}
			}
		}

		.function-area {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.function-item {
				flex: 1;
				text-align: center;
				position: relative;

				&:not(:last-child)::after {
					content: '';
					position: absolute;
					right: 0;
					top: 50%;
					transform: translateY(-50%);
					height: 40rpx;
					width: 1rpx;
					background-color: #f0f0f0;
				}

				.function-value {
					display: block;
					font-size: 32rpx;
					font-weight: bold;
					color: #333;
					margin-bottom: 6rpx;
				}

				.function-title {
					font-size: 24rpx;
					color: #666;
				}
			}
		}
	}
	
	.vip-section {
		background-color: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;

		.vip-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 10rpx;
			display: flex;
			justify-content: space-between;
			
			
			
			.vip-progress {
				font-size: 24rpx;
				color: #999;
			}
		}

		.vip-desc {
			font-size: 28rpx;
			color: #333;
		}

		.vip-link {
			font-size: 24rpx;
			color: #9c27b0;
		}
	}
	
	.order-section {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
		
		.order-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30rpx;
			
			.order-title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}
			
			.view-all {
				display: flex;
				align-items: center;
				font-size: 24rpx;
				color: #999;
				
				.iconfont {
					font-size: 24rpx;
					margin-left: 4rpx;
				}
			}
		}
		
		.order-status {
			display: flex;
			justify-content: space-between;
			
			.status-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				flex: 1;
				
				.status-icon {
					width: 60rpx;
					height: 60rpx;
					margin-bottom: 10rpx;
				}
				
				.status-text {
					font-size: 24rpx;
					color: #333;
				}
				
				&:active {
					opacity: 0.8;
				}
			}
		}
	}

	.sign-in-system {
		background-color: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		border-radius: 20rpx;
			padding: 30rpx;
		margin-bottom: 20rpx;

		.sign-in-tabs {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20rpx;

			.tab-item {
				padding: 10rpx 20rpx;
				border-radius: 20rpx;
				background-color: #f5f5f5;
				color: #333;
			font-size: 28rpx;
				font-weight: bold;
				
				&.active {
					background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
					color: #fff;
				}
			}
		}

		.sign-in-days {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20rpx;

			.day-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 10rpx;

				.day-name {
					font-size: 24rpx;
					color: #333;
				}

				.day-reward {
					font-size: 28rpx;
					color: #9c27b0;
				}
			}
		}
	}

	.task-system {
		background-color: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;

		.task-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;

			.task-title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}

			.task-progress {
				font-size: 24rpx;
				color: #999;
			}
		}

		.task-date {
			font-size: 28rpx;
			color: #333;
			margin-bottom: 20rpx;
		}

		.task-btn {
			display: inline-block;
			padding: 10rpx 30rpx;
			background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
			color: #fff;
			border-radius: 30rpx;
			font-size: 28rpx;
		}
	}

	.cells-section {
		background: #fff;
		border-radius: 20rpx;
		padding: 20rpx;
		margin-top: 10rpx;

		.section-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 20rpx;
			padding: 0 20rpx;
		}

		.cells {
			.cell-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 30rpx;
				background: #fff;
				border-bottom: 1rpx solid #f5f5f5;

				&:last-child {
					border-bottom: none;
				}

				.cell-left {
					display: flex;
					align-items: center;

					.cell-icon {
						width: 40rpx;
						height: 40rpx;
						margin-right: 20rpx;
					}

					.cell-title {
						font-size: 28rpx;
						color: #333;
					}
				}

				.icon-arrow {
					font-size: 24rpx;
					color: #999;
				}

				&:active {
					background-color: #f5f5f5;
				}
			}
		}

		.services-grid {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: 30rpx;
			padding: 10rpx 0;

			.service-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 10rpx;

				

				.service-name {
					font-size: 24rpx;
					color: #333;
					text-align: center;
				}
			}
		}
	}

	.about-section {
		background-color: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;

		.about-text {
			font-size: 28rpx;
			color: #333;
		}
	}

	.app-download {
		background-color: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		border-radius: 20rpx;
		padding: 30rpx;
		position: relative;

		.app-title {
			font-size: 28rpx;
			color: #333;
			display: block;
		}

		.app-subtitle {
			font-size: 24rpx;
			color: #999;
			margin-top: 10rpx;
			display: block;
		}

		.version-text {
			font-size: 24rpx;
			color: #999;
			position: absolute;
			right: 30rpx;
			bottom: 30rpx;
		}
	}

	.more-services {
		margin: 20rpx;
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx 20rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

		.section-title {
			font-size: 32rpx;
			font-weight: 600;
			color: #333;
			margin-bottom: 30rpx;
			padding-left: 10rpx;
		}

		.services-grid {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: 30rpx;
			padding: 10rpx;

			.service-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 16rpx;
				transition: all 0.3s;

				&:active {
					transform: scale(0.95);
				}

				.icon-wrapper {
					width: 90rpx;
					height: 90rpx;
					background: rgba(42, 238, 230, 0.1);
					display: flex;
					align-items: center;
					justify-content: center;
					transition: all 0.3s;

					.service-icon {
						width: 60rpx;
						height: 60rpx;
					}
				}

				.service-name {
					font-size: 26rpx;
					color: #333;
					font-weight: 500;
				}

				&:active .icon-wrapper {
					background: rgba(42, 238, 230, 0.2);
				}
			}
		}
	}
}
</style>