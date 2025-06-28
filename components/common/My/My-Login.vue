<template>
	<view class="my-container">
		<!-- 用户信息区域 -->
		<view class="user-info">
			<view class="user-header">
				<view class="user-basic">
					<image class="avatar" src="/static/logo.png" mode="aspectFit" @click="goToProfile"></image>
					<view class="user-id">
						<text class="phone-number">158*****97</text>
						<view class="badge-list">
							<text class="badge-text">我的徽章</text>
							<text class="badge-time">6/45</text>
							<view class="badge-icons">
								🏆🎖️🎨🎭🎪🎯
							</view>
							<text class="badge-more">></text>
						</view>
					</view>
					<view class="sign-in-btn">签到</view>
				</view>
			</view>

			<!-- 会员等级区域 -->
			<view class="vip-section">
				<view class="vip-title">
					<text class="vip-level">大雪人</text>
					<text class="vip-progress">甜蜜值 362/1000</text>
				</view>
				<view class="vip-desc">
					<text>每升一级可享【限定特权】等15项权益</text>
					<text class="vip-link">您已解锁12项特权 ></text>
				</view>
			</view>

			

			<!-- 功能区域 -->
			<view class="function-area">
				<view class="function-item">
					<text class="function-value">180</text>
					<text class="function-title">雪王币</text>
				</view>
				<view class="function-item">
					<text class="function-value">0</text>
					<text class="function-title">优惠券</text>
				</view>
				<view class="function-item">
					<text class="function-title">礼品卡</text>
					<text class="function-link">点击查看</text>
				</view>
			</view>

			

			<!-- 更多服务 -->
			<view class="more-services">
				<view class="section-title">更多服务</view>
				<view class="services-grid">
					<view class="service-item" v-for="service in services" :key="service.id">
						<view class="service-icon" :class="service.iconClass">
							<image v-if="service.badge" class="badge" :src="service.badge" mode="aspectFit"></image>
						</view>
						<text class="service-name">{{ service.name }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

const currentTab = ref('daily')


const services = [
	{ 
		id: 'earn',
		name: '兑换中心',
		iconClass: 'icon-earn'
	},
	{ 
		id: 'feedback',
		name: '问题反馈',
		iconClass: 'icon-feedback'
	},
	{ 
		id: 'join',
		name: '加盟咨询',
		iconClass: 'icon-join'
	},
	{ 
		id: 'about',
		name: '关于我们',
		iconClass: 'icon-about'
	}
]

const goToProfile = () => {
	uni.navigateTo({
		url: '/pages/My/profile/index'
	})
}
</script>

<style lang="scss" scoped>
.my-container {
	min-height: 100vh;
	background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
	background-attachment: fixed;
	background-size: 100% 100%;
	padding-top: 7vh;
	box-sizing: border-box;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	overflow-y: auto;

	.user-info {
		
		backdrop-filter: blur(10px);
		border-radius: 20rpx;
		padding: 30rpx;

		.user-header {
			.user-basic {
				display: flex;
				align-items: center;
				gap: 20rpx;

				.avatar {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
				}

				.user-id {
					flex: 1;

					.phone-number {
						font-size: 32rpx;
						font-weight: bold;
						color: #333;
					}

					.badge-list {
						display: flex;
						align-items: center;
						gap: 10rpx;
						margin-top: 10rpx;
						font-size: 24rpx;
						color: #666;

						.badge-icons {
							display: flex;
							gap: 5rpx;
						}

						.badge-more {
							color: #999;
						}
					}
				}

				.sign-in-btn {
					padding: 10rpx 30rpx;
					background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
					color: #fff;
					border-radius: 30rpx;
					font-size: 28rpx;
				}
			}
		}

		.vip-section {
			background: linear-gradient(135deg, #9575cd 0%, #7e57c2 100%);
			border-radius: 20rpx;
			padding: 20rpx;
			margin-top: 20rpx;
			color: #fff;

			.vip-title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10rpx;

				.vip-level {
					font-size: 32rpx;
					font-weight: bold;
				}

				.vip-progress {
					font-size: 24rpx;
					opacity: 0.9;
				}
			}

			.vip-desc {
				font-size: 24rpx;
				opacity: 0.9;

				.vip-link {
					color: #fff;
					margin-left: 10rpx;
					text-decoration: underline;
				}
			}
		}

		.sign-in-system {
			background: #fff;
			border-radius: 20rpx;
			padding: 20rpx;
			margin-top: 20rpx;

			.sign-in-tabs {
				display: flex;
				gap: 20rpx;
				margin-bottom: 20rpx;
				border-bottom: 1px solid #eee;
				padding-bottom: 10rpx;

				.tab-item {
					font-size: 28rpx;
					color: #666;
					padding: 10rpx 20rpx;
					position: relative;
					
					&.active {
						color: #9c27b0;
						font-weight: bold;
						
						&::after {
							content: '';
							position: absolute;
							bottom: -11rpx;
							left: 20%;
							width: 60%;
							height: 4rpx;
							background: #9c27b0;
							border-radius: 2rpx;
						}
					}
				}
			}

			.sign-in-days {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				gap: 20rpx;

				.day-item {
					background: #f8f8f8;
					padding: 20rpx;
					border-radius: 15rpx;
					text-align: center;

					.day-name {
						font-size: 24rpx;
						color: #333;
						display: block;
						margin-bottom: 10rpx;
					}

					.day-reward {
						font-size: 24rpx;
						color: #9c27b0;
					}
				}
			}
		}

		.function-area {
			display: flex;
			justify-content: space-between;
			margin-top: 20rpx;
			background: #fff;
			border-radius: 20rpx;
			padding: 20rpx;

			.function-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 10rpx;
				flex: 1;
				position: relative;

				.function-title {
					font-size: 24rpx;
					color: #666;
				}

				.function-value {
					font-size: 32rpx;
					color: #333;
					font-weight: bold;
				}

				.function-link {
					font-size: 24rpx;
					color: #9c27b0;
				}
			}
		}

		.task-system {
			background: #fff;
			border-radius: 20rpx;
			padding: 20rpx;
			margin-top: 20rpx;

			.task-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10rpx;

				.task-title {
					font-size: 28rpx;
					color: #333;
				}

				.task-progress {
					color: #9c27b0;
					font-size: 24rpx;
				}
			}

			.task-date {
				font-size: 24rpx;
				color: #666;
				display: block;
				margin-bottom: 10rpx;
			}

			.task-btn {
				display: inline-block;
				padding: 10rpx 30rpx;
				background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
				color: #fff;
				border-radius: 30rpx;
				font-size: 24rpx;
			}
		}

		.more-services {
			background: #fff;
			border-radius: 20rpx;
			padding: 20rpx;
			margin-top: 20rpx;

			.section-title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 20rpx;
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

					.service-icon {
						width: 80rpx;
						height: 80rpx;
						background: #f5f5f5;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						position: relative;

						&.icon-earn::before {
							content: "⚡";
							font-size: 40rpx;
						}

						&.icon-group::before {
							content: "👥";
							font-size: 40rpx;
						}

						&.icon-feedback::before {
							content: "💬";
							font-size: 40rpx;
						}

						&.icon-join::before {
							content: "🤝";
							font-size: 40rpx;
						}

						&.icon-about::before {
							content: "ℹ️";
							font-size: 40rpx;
						}

						.badge {
							position: absolute;
							top: -10rpx;
							right: -10rpx;
							width: 30rpx;
							height: 30rpx;
						}
					}

					.service-name {
						font-size: 24rpx;
						color: #333;
						text-align: center;
					}
				}
			}
		}
	}
}
</style>
