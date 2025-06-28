<template>
	<view class="profile-container">
		<!-- 顶部导航栏 -->
		<view class="nav-bar">
			<view class="back-btn" @tap.stop="handleBack">
				<image class="back-icon" src="/static/icons/back.png" mode="aspectFit" />
			</view>
			<text class="title">个人资料</text>
		</view>
		
		<!-- 头像部分 -->
		<view class="avatar-section">
			<image class="avatar" :src="userInfo.avatar || '/static/logo.png'" mode="aspectFill" @tap="chooseAvatar" />
			<view class="camera-icon">
				<image src="/static/icons/camera.png" mode="aspectFit" />
			</view>
		</view>
		
		<!-- 表单部分 -->
		<view class="form-section">
			<!-- 昵称 -->
			<view class="form-item">
				<text class="label">昵称</text>
				<input type="text" v-model="userInfo.nickname" placeholder="请输入昵称" />
				<!-- <text class="edit-text">修改</text> -->
			</view>
			
			<!-- 手机号 -->
			<view class="form-item">
				<text class="label">手机</text>
				<input type="number" v-model="userInfo.phone" placeholder="请输入手机号" disabled />
				<text class="edit-text">修改</text>
			</view>
			
			<!-- 性别 -->
			<view class="form-item">
				<text class="label">性别</text>
				<view class="radio-group">
					<radio-group @change="handleGenderChange">
						<label class="radio">
							<radio value="male" :checked="userInfo.gender === 'male'" />
							<text>男</text>
						</label>
						<label class="radio">
							<radio value="female" :checked="userInfo.gender === 'female'" />
							<text>女</text>
						</label>
					</radio-group>
				</view>
			</view>
			
			<!-- 年龄 -->
			<view class="form-item">
				<text class="label">年龄</text>
				<input type="number" v-model="userInfo.age" placeholder="请输入年龄" min="0" max="200" @input="onAgeInput" />
			</view>
		</view>
		
		<!-- 隐私提示 -->
		<view class="privacy-notice">
			<text>根据未成年人保护相关法律法规的要求，我们不主动处理14周岁以下未成年人的个人信息。如果您为14周岁以下的用户，请勿填写您的个人资料。</text>
		</view>
		
		<!-- 保存按钮 -->
		<view class="button-section">
			<button class="save-btn" @tap="handleSave">保存</button>
		</view>
		
		<!-- 退出登录 -->
		<view class="logout-section">
			<text class="logout-btn" @tap="handleLogout">退出登录</text>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

// 获取用户 store
const userStore = useUserStore()

onMounted(() => {
	console.log('个人资料页面已加载')
})

// 用户信息
const userInfo = ref({
	avatar: userStore.userInfo?.avatarUrl || '',
	nickname: userStore.userInfo?.nickName || '',
	phone: userStore.userInfo?.phone || '158*****97',
	gender: userStore.userInfo?.gender || 'male',
	age: userStore.userInfo?.age || ''
})

// 返回上一页
const handleBack = () => {
	console.log('点击了返回按钮')
	try {
		uni.showToast({
			title: '正在返回...',
			icon: 'none'
		})
		setTimeout(() => {
			uni.navigateBack({
				delta: 1,
				success: () => {
					console.log('返回成功')
				},
				fail: (err) => {
					console.error('返回失败:', err)
					uni.switchTab({
						url: '/pages/My/index'
					})
				}
			})
		}, 500)
	} catch (error) {
		console.error('返回操作出错:', error)
	}
}

// 选择头像
const chooseAvatar = async () => {
	try {
		const res = await uni.chooseImage({
			count: 1,
			sizeType: ['compressed'],
			sourceType: ['album', 'camera']
		})
		userInfo.value.avatar = res.tempFilePaths[0]
	} catch (error) {
		console.error('选择头像失败:', error)
	}
}

// 性别选择
const handleGenderChange = (e) => {
	userInfo.value.gender = e.detail.value
}

// 年龄输入限制
const onAgeInput = (e) => {
	let val = e.detail.value.replace(/[^0-9]/g, '').slice(0, 3)
	if (val > 200) {
		val = 200
		uni.showToast({
			title: '您高寿',
			icon: 'none'
		})
	}
	userInfo.value.age = val
}

// 保存资料
const handleSave = () => {
	// TODO: 调用接口保存用户信息
	uni.showToast({
		title: '保存成功',
		icon: 'success'
	})
	setTimeout(() => {
		uni.navigateBack()
	}, 1500)
}

// 退出登录
const handleLogout = () => {
	console.log('退出登录')
	uni.showModal({
		title: '提示',
		content: '确定要退出登录吗？',
		success: (res) => {
			if (res.confirm) {
				// 调用 store 的退出登录方法
				userStore.logout()
				
				// 返回我的页面
				uni.navigateBack({
					delta: 1,
					success: () => {
						uni.showToast({
							title: '已退出登录',
							icon: 'success'
						})
					}
				})
			}
		}
	})
}
</script>

<style lang="scss" scoped>
.profile-container {
	min-height: 100vh;
	background: linear-gradient(135deg, #f8fafc 0%, #f5f5f5 100%);
	
	.nav-bar {
		background: #fff;
		height: 88rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		padding: 0 30rpx;
		box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
		
		.back-btn {
			position: absolute;
			left: 30rpx;
			top: 50%;
			transform: translateY(-50%);
			padding: 20rpx;
			z-index: 10;
			
			.back-icon {
				width: 40rpx;
				height: 40rpx;
				display: block;
			}
		}
		
		.title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			letter-spacing: 2rpx;
		}
	}
	
	.avatar-section {
		background: transparent;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 40rpx 0 20rpx 0;
		position: relative;
		margin-top: 20rpx;
		
		.avatar {
			width: 180rpx;
			height: 180rpx;
			border-radius: 50%;
			background-color: #fff;
			box-shadow: 0 4rpx 24rpx rgba(156,39,176,0.08);
			border: 4rpx solid #fff;
			transition: transform 0.2s;
			
			&:active {
				transform: scale(0.96);
			}
		}
		
		.camera-icon {
			position: absolute;
			bottom: 38rpx;
			right: 50%;
			transform: translateX(60rpx);
			width: 48rpx;
			height: 48rpx;
			background: #fff;
			border-radius: 50%;
			box-shadow: 0 2rpx 8rpx rgba(156,39,176,0.08);
			display: flex;
			justify-content: center;
			align-items: center;
			
			image {
				width: 60%;
				height: 60%;
			}
		}
	}
	
	.form-section {
		margin-top: 10rpx;
		background-color: #fff;
		border-radius: 24rpx;
		box-shadow: 0 2rpx 12rpx rgba(156,39,176,0.04);
		padding: 0 30rpx;
		
		.form-item {
			display: flex;
			align-items: center;
			padding: 32rpx 0;
			border-bottom: 1rpx solid #f0e6f6;
			
			&:last-child {
				border-bottom: none;
			}
			
			.label {
				width: 120rpx;
				color: #333;
				font-size: 28rpx;
				font-weight: 500;
			}
			
			input {
				flex: 1;
				font-size: 28rpx;
				background: transparent;
				border: none;
				outline: none;
				color: #222;
				padding: 0 10rpx;
				transition: box-shadow 0.2s;
				
				&:focus {
					box-shadow: 0 2rpx 8rpx #e1bee7;
				}
			}
			
			.edit-text {
				color: #b39ddb;
				font-size: 28rpx;
				margin-left: 10rpx;
				transition: color 0.2s;
				
				&:active {
					color: #7b1fa2;
				}
			}
			
			.radio-group {
				flex: 1;
				
				.radio {
					margin-right: 40rpx;
					font-size: 28rpx;
				}
			}
		}
	}
	
	.privacy-notice {
		padding: 30rpx;
		font-size: 24rpx;
		color: #bdbdbd;
		line-height: 1.6;
		text-align: center;
	}
	
	.button-section {
		padding: 40rpx 30rpx 0 30rpx;
		
		.save-btn {
			width: 100%;
			height: 88rpx;
			line-height: 88rpx;
			text-align: center;
			background: linear-gradient(135deg, #b39ddb 0%, #7b1fa2 100%);
			color: #fff;
			border-radius: 44rpx;
			font-size: 32rpx;
			font-weight: bold;
			box-shadow: 0 4rpx 16rpx rgba(156,39,176,0.10);
			transition: background 0.2s, transform 0.2s;
			
			&:active {
				background: linear-gradient(135deg, #7b1fa2 0%, #b39ddb 100%);
				transform: scale(0.97);
			}
		}
	}
	
	.logout-section {
		text-align: center;
		padding: 30rpx 0 10rpx 0;
		
		.logout-btn {
			color: #e57373;
			font-size: 28rpx;
			font-weight: 500;
			letter-spacing: 2rpx;
			transition: color 0.2s;
			
			&:active {
				color: #b71c1c;
			}
		}
	}
}
</style> 