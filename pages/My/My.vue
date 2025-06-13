<template>
	<view class="User">
		<!-- 用户信息 -->
		<view class="User-info">
			<view class="User-info-top">
			<view class="User-info-text">
				<text class="User-info-text-title">欢迎回来</text>
				<text class="User-info-text-name">张三</text>
				<view class="User-info-text-button">立即登录</view>
			</view>
			<view class="User-info-img">
				<image src="/static/logo.png" mode="widthFix" class="User-info-img-img"></image>
			</view>
			</view>
			<view class="User-info-wallet">
				<view class="User-info-wallet-balance">
					<text>0.00</text>
					<text>余额</text>
				</view>
				<view class="User-info-wallet-Integral">
					<text>0</text>
					<text>积分</text>
				</view>
				<view class="User-info-wallet-coupon">
					<text>0</text>
					<text>优惠券</text>
				</view>
			</view>
		</view>
		<!-- 订单 -->
		<view class="User-order">
			<view class="User-order-title">
				<text class="User-order-title-text">我的订单</text>
				<view class="User-order-subtitle">
					查看全部订单>
				</view>
			</view>
			<view class="User-order-list">
				<view class="User-order-list-item" v-for="item in 5" :key="item">
					<view class="User-order-list-item-img">
						<image src="/static/logo.png" mode="widthFix" class="User-order-list-item-img-img"></image>
					</view>
					<view class="User-order-list-item-text">
						<text>待XX</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

// 响应式数据
const title = ref('我的页面')

// 方法
const handleClick = () => {
	console.log('点击事件')
}
</script>

<style lang="scss" scoped>
.User {
	width: 100vw;
	min-height: 100vh;
	background-color: rgb(245, 245, 245);
	padding-top: 50rpx;
	.User-info {
		width: 95%;
		margin: 0 auto;
		height: 400rpx;
		background-color: #fff;
		margin-top: 0;
		border:1px solid #000;
		border-radius: 20rpx;
		.User-info-top {
			margin-top: 30rpx;
			margin-left: 20rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			.User-info-text{
				display: flex;
				flex-direction: column;
				height: 100px;
				.User-info-text-title {
					font-size: 40rpx;
					color: #000;
				}
				.User-info-text-name {
					font-size: 55rpx;
					color: #000;
				}
				.User-info-text-button {
					width: 100px;
					height: 40px;
					background-color: #000;
					color: #fff;
					border-radius: 40rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-top: 10rpx;
				}
			}
			.User-info-img {
				width: 80px;
				height: 80px;
				margin-right: 20rpx;
				.User-info-img-img {
					width: 100%;
					height: 100%;
				}
			}
		}
		.User-info-wallet {
			margin-top: 20rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			.User-info-wallet-balance,
			.User-info-wallet-Integral,
			.User-info-wallet-coupon {
				margin-top: 20rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				width: 33.33%;
				height: 50px;
				
			}
		}
	}
	.User-order {
		width: 95%;
		margin: 0 auto;
		height: 250rpx;
		background-color: #fff;
		margin-top: 20rpx;
		border-radius: 20rpx;
		.User-order-title {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			.User-order-title-text {
				padding: 20rpx;
				font-size: 32rpx;
				color: #000;
			}
			.User-order-subtitle {
				padding: 20rpx;
				font-size: 24rpx;
				color: rgb(175, 170, 167);
			}
		}
		.User-order-list {
			height: 50%;
			display: grid;
			grid-template-columns: repeat(5, 1fr);
			gap: 10rpx;
			padding: 10rpx;
			
			.User-order-list-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				border:1px solid rgb(245, 245, 245);
				background-color: rgb(245, 245, 245);
				border-radius: 20rpx;
				justify-content: center;
				gap: 10rpx;
				.User-order-list-item-img {
					width: 35rpx;
					height: 35rpx;
					.User-order-list-item-img-img {
						width: 100%;
						height: 100%;
					}
				}
				.User-order-list-item-text {
					font-size: 32rpx;
					color: #000;
				}
			}
		}
	}
}
</style> 