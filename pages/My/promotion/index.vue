<template>
	<view class="container">
		<!-- 顶部背景 -->
		<view class="header">
			<image class="header-bg" src="/static/distribution/header-bg.png" mode="aspectFill"></image>
			<view class="header-content">
				<text class="title">成为推广商</text>
				<text class="subtitle">加入我们，开启赚钱之旅</text>
			</view>
		</view>

		<!-- 特权介绍 -->
		<view class="privileges-section">
			<view class="section-title">
				<text class="title-text">推广商特权</text>
			</view>
			<view class="privileges-grid">
				<view class="privilege-item" v-for="(item, index) in privileges" :key="index">
					<image :src="item.icon" mode="aspectFit" class="privilege-icon"></image>
					<text class="privilege-name">{{ item.name }}</text>
					<text class="privilege-desc">{{ item.desc }}</text>
				</view>
			</view>
		</view>

		<!-- 申请条件 -->
		<view class="requirements-section">
			<view class="section-title">
				<text class="title-text">申请条件</text>
			</view>
			<view class="requirements-list">
				<view class="requirement-item" v-for="(item, index) in requirements" :key="index">
					<view class="requirement-dot"></view>
					<text class="requirement-text">{{ item }}</text>
				</view>
			</view>
		</view>

		<!-- 申请表单 -->
		<view class="form-section">
			<view class="section-title">
				<text class="title-text">申请信息</text>
			</view>
			<view class="form-content">
				<view class="form-item">
					<text class="label">姓名</text>
					<input type="text" v-model="formData.name" placeholder="请输入真实姓名" />
				</view>
				<view class="form-item">
					<text class="label">手机号</text>
					<input type="number" v-model="formData.phone" placeholder="请输入手机号" />
				</view>
				<view class="form-item">
					<text class="label">微信号</text>
					<input type="text" v-model="formData.wechat" placeholder="请输入微信号" />
				</view>
				<view class="form-item">
					<text class="label">申请理由</text>
					<textarea v-model="formData.reason" placeholder="请简单描述申请成为推广商的理由" />
				</view>
			</view>
		</view>

		<!-- 协议同意 -->
		<view class="agreement">
			<checkbox-group @change="handleAgreementChange">
				<label class="agreement-label">
					<checkbox value="agreed" color="#2aeee6" :checked="formData.agreed" />
					<text class="agreement-text">我已阅读并同意</text>
					<text class="agreement-link" @tap.stop="showAgreement">《推广商协议》</text>
				</label>
			</checkbox-group>
		</view>

		<!-- 提交按钮 -->
		<view class="submit-section">
			<button class="submit-btn" @tap="handleSubmit" :disabled="!formData.agreed">
				提交申请
			</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

// 特权数据
const privileges = ref([
	{
		icon: '/static/distribution/commission.png',
		name: '高额佣金',
		desc: '最高可享30%佣金'
	},
	{
		icon: '/static/distribution/team.png',
		name: '团队收益',
		desc: '发展团队享受额外奖励'
	},
	{
		icon: '/static/distribution/tools.png',
		name: '推广工具',
		desc: '专业推广物料支持'
	},
	{
		icon: '/static/distribution/support.png',
		name: '专属客服',
		desc: '一对一服务支持'
	}
])

// 申请条件
const requirements = ref([
	'年满18周岁',
	'需要实名认证',
	'近30天有效消费满99元',
	'认同平台价值观，愿意长期合作'
])

// 表单数据
const formData = ref({
	name: '',
	phone: '',
	wechat: '',
	reason: '',
	agreed: false
})

// 处理协议勾选
const handleAgreementChange = (e) => {
	formData.value.agreed = e.detail.value.length > 0
}

// 显示协议内容
const showAgreement = () => {
	uni.navigateTo({
		url: '/pages/My/promotion/agreement'
	})
}

// 提交申请
const handleSubmit = () => {
	// 表单验证
	if (!formData.value.name.trim()) {
		uni.showToast({
			title: '请输入姓名',
			icon: 'none'
		})
		return
	}
	if (!formData.value.phone.trim()) {
		uni.showToast({
			title: '请输入手机号',
			icon: 'none'
		})
		return
	}
	if (!/^1\d{10}$/.test(formData.value.phone)) {
		uni.showToast({
			title: '请输入正确的手机号',
			icon: 'none'
		})
		return
	}
	if (!formData.value.wechat.trim()) {
		uni.showToast({
			title: '请输入微信号',
			icon: 'none'
		})
		return
	}
	if (!formData.value.reason.trim()) {
		uni.showToast({
			title: '请输入申请理由',
			icon: 'none'
		})
		return
	}
	if (!formData.value.agreed) {
		uni.showToast({
			title: '请同意推广商协议',
			icon: 'none'
		})
		return
	}

	// TODO: 发送申请到服务器
	console.log('提交申请:', formData.value)
	uni.showLoading({
		title: '提交中...'
	})

	// 模拟提交
	setTimeout(() => {
		uni.hideLoading()
		uni.showToast({
			title: '申请提交成功',
			icon: 'success'
		})
		// 延迟返回上一页
		setTimeout(() => {
			uni.navigateBack()
		}, 1500)
	}, 2000)
}
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 120rpx;
}

.header {
	position: relative;
	height: 300rpx;
	overflow: hidden;

	.header-bg {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 1;
	}

	.header-content {
		position: relative;
		z-index: 2;
		padding: 60rpx 40rpx;
		color: #fff;

		.title {
			font-size: 48rpx;
			font-weight: bold;
			margin-bottom: 20rpx;
			display: block;
		}

		.subtitle {
			font-size: 28rpx;
			opacity: 0.9;
		}
	}
}

.section-title {
	padding: 30rpx 40rpx 20rpx;
	
	.title-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		position: relative;
		padding-left: 24rpx;
		
		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 50%;
			transform: translateY(-50%);
			width: 6rpx;
			height: 28rpx;
			background: #2aeee6;
			border-radius: 3rpx;
		}
	}
}

.privileges-section {
	background: #fff;
	margin: 20rpx;
	border-radius: 16rpx;
	padding-bottom: 30rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);

	.privileges-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 30rpx;
		padding: 0 30rpx;

		.privilege-item {
			background: #f8f8f8;
			border-radius: 12rpx;
			padding: 30rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			.privilege-icon {
				width: 80rpx;
				height: 80rpx;
				margin-bottom: 20rpx;
			}

			.privilege-name {
				font-size: 28rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 10rpx;
			}

			.privilege-desc {
				font-size: 24rpx;
				color: #666;
				text-align: center;
			}
		}
	}
}

.requirements-section {
	background: #fff;
	margin: 20rpx;
	border-radius: 16rpx;
	padding-bottom: 30rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);

	.requirements-list {
		padding: 0 40rpx;

		.requirement-item {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;

			.requirement-dot {
				width: 12rpx;
				height: 12rpx;
				border-radius: 50%;
				background: #2aeee6;
				margin-right: 20rpx;
			}

			.requirement-text {
				font-size: 28rpx;
				color: #333;
			}
		}
	}
}

.form-section {
	background: #fff;
	margin: 20rpx;
	border-radius: 16rpx;
	padding-bottom: 30rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);

	.form-content {
		padding: 0 40rpx;

		.form-item {
			margin-bottom: 30rpx;

			.label {
				font-size: 28rpx;
				color: #333;
				margin-bottom: 16rpx;
				display: block;
			}

			input {
				width: 98%;
				height: 80rpx;
				background: #f5f5f5;
				border-radius: 8rpx;
				padding: 0 20rpx;
				font-size: 28rpx;
        border-radius: 50rpx;
			}

			textarea {
				width: 98%;
				height: 200rpx;
				background: #f5f5f5;
				border-radius: 8rpx;
				padding: 20rpx;
				font-size: 28rpx;
			}
		}
	}
}

.agreement {
	padding: 30rpx 40rpx;

	.agreement-label {
		display: flex;
		align-items: center;

		.agreement-text {
			font-size: 26rpx;
			color: #666;
			margin-left: 8rpx;
		}

		.agreement-link {
			font-size: 26rpx;
			color: #2aeee6;
		}
	}
}

.submit-section {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 20rpx 40rpx;
	background: #fff;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 100;

	.submit-btn {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		background: #2aeee6;
		color: #fff;
		font-size: 32rpx;
		border-radius: 40rpx;
		font-weight: bold;

		&:disabled {
			background: #ccc;
		}
	}
}
</style>