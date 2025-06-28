<template>
	<view class="evaluate-container">
		<image class="evaluate-container-image" src="/static/CatAndDog.png" mode="aspectFill"></image>
		<view class="title-text animate__animated animate__fadeInDown">请选择您的宠物</view>
		<view class="button-group">
			<view class="anime-button dog-button" @tap="evaluateDog">
				<text class="button-text">选择哈基汪</text>
				<view class="button-shine"></view>
			</view>
			<view class="anime-button cat-button" @tap="evaluateCat">
				<text class="button-text">选择哈基咪</text>
				<view class="button-shine"></view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import 'animate.css'
const evaluateDog = () => {
	// 狗狗评价逻辑
	uni.showToast({
		title: '即将开始狗狗评价',
		icon: 'none'
	})
}

const evaluateCat = () => {
	// 猫咪评价逻辑
	uni.showToast({
		title: '即将开始猫咪评价',
		icon: 'none'
	})
}
</script>

<style lang="scss" scoped>
.evaluate-container {
	position: relative;
	width: 100%;
	min-height: 100vh;
	background-color: #fff5f0;
	
	.evaluate-container-image {
		position: fixed;
		width: 100%;
		height: 100%;
		opacity: 1;
		z-index: 1;
	}

	.title-text {
		position: fixed;
		top: 40%;
		left: 10%;
		transform: translateX(-50%);
		z-index: 2;
		font-size: 80rpx;
		font-weight: bold;
		color: #333;
		text-shadow: 2rpx 2rpx 4rpx rgba(255,255,255,0.8);
		background: linear-gradient(45deg, #ff9a9e, #6b8afd);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		padding: 20rpx 20rpx;
		white-space: nowrap;
	}

	.button-group {
		position: fixed;
		bottom: 60rpx;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		gap: 60rpx;
		z-index: 2;
		padding: 0 40rpx;

		.anime-button {
			position: relative;
			width: 240rpx;
			height: 80rpx;
			border-radius: 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			overflow: hidden;
			box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.1);
			transition: transform 0.3s;

			&::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3));
				z-index: 1;
			}

			.button-text {
				position: relative;
				z-index: 2;
				font-size: 28rpx;
				font-weight: bold;
				color: #ffffff;
			}

			.button-shine {
				position: absolute;
				top: -100%;
				left: -100%;
				width: 200%;
				height: 200%;
				background: linear-gradient(
					45deg,
					transparent,
					rgba(255,255,255,0.2),
					transparent
				);
				transform: rotate(45deg);
				animation: shine 3s infinite;
			}

			&:active {
				transform: scale(0.95);
			}
		}

		.dog-button {
			background: linear-gradient(45deg, #6b8afd, #8b9fff);
		}

		.cat-button {
			background: linear-gradient(45deg, #ff9a9e, #fad0c4);
		}
	}
}

@keyframes shine {
	0% {
		left: -100%;
		top: -100%;
	}
	20%, 100% {
		left: 100%;
		top: 100%;
	}
}
</style>