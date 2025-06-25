<!-- 论坛界面 -->
<template>
	<view class="container">
		<!-- 顶部搜索栏 -->
		<view class="search-bar">
			<view class="search-box">
				<image class="search-icon" src="/static/icons/Search.png" mode="aspectFit"></image>
				<input type="text" v-model="searchKeyword" placeholder="搜索帖子" />
			</view>
			<view class="post-btn" @tap="goToSearch">
				<text>搜索</text>
			</view>
		</view>

		<!-- 分类标签 -->
		<scroll-view class="category-scroll" scroll-x>
			<view class="category-list">
				<view 
					v-for="(item, index) in forumStore.categories" 
					:key="index"
					class="category-item"
					:class="{ active: forumStore.currentCategory === index }"
					@tap="handleCategoryChange(index)"
				>
					{{ item }}
				</view>
			</view>
		</scroll-view>

		<!-- 帖子列表 -->
		<scroll-view class="post-list" scroll-y @scrolltolower="loadMore">
			<view 
				class="post-item" 
				v-for="(item, index) in filteredPosts" 
				:key="index"
				@tap="goToDetail(item.id)"
			>
				<!-- 用户信息 -->
				<view class="post-header">
					<view class="user-info">
						<image class="avatar" :src="item.user.avatar" mode="aspectFill"></image>
						<view class="user-detail">
							<text class="username">{{ item.user.username }}</text>
							<text class="time">{{ item.time }}</text>
						</view>
					</view>
					<view class="category-tag">{{ item.category }}</view>
				</view>

				<!-- 帖子内容 -->
				<view class="post-content">
					<text class="title ellipsis-1">{{ item.title }}</text>
					<text class="content ellipsis-2">{{ item.content }}</text>
					<view class="image-list" v-if="item.images && item.images.length">
						<image 
							v-for="(img, imgIndex) in item.images" 
							:key="imgIndex" 
							:src="img" 
							mode="aspectFill"
							class="content-image"
						></image>
					</view>
				</view>

				<!-- 互动数据 -->
				<view class="post-footer">
					<view class="action-item">
						<image 
							:src="item.isLiked ? '/static/icons/Like-active.png' : '/static/icons/Like.png'" 
							mode="aspectFit" 
							class="action-icon"
							@tap.stop="handleLike(item)"
						></image>
						<text class="count">{{ item.likes }}</text>
					</view>
					<view class="action-item">
						<image 
							src="/static/icons/Comment.png" 
							mode="aspectFit" 
							class="action-icon"
							@tap.stop="handleComment(item)"
						></image>
						<text class="count">{{ item.comments }}</text>
					</view>
					<view class="action-item">
						<image 
							:src="item.isCollected ? '/static/icons/Collect-active.png' : '/static/icons/Collect.png'" 
							mode="aspectFit" 
							class="action-icon"
							@tap.stop="handleCollect(item)"
						></image>
						<text class="count">{{ item.collects || 0 }}</text>
					</view>
				</view>
			</view>

			<!-- 加载更多 -->
			<view class="loading" v-if="loading">
				<text>加载中...</text>
			</view>
		</scroll-view>

		<!-- 悬浮发帖按钮 -->
		<view class="float-btn" @tap="goToPost">
			<text class="iconfont icon-edit">✏️</text>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useForumStore } from '@/stores/forum.js'

// 获取论坛store
const forumStore = useForumStore()

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')

// 计算属性：根据当前分类过滤帖子
const filteredPosts = computed(() => {
	return forumStore.getFilteredPosts()
})

// 方法
const goToPost = () => {
	uni.navigateTo({
		url: './Post'
	})
}

const goToDetail = (postId) => {
	uni.navigateTo({
		url: `./Detail?id=${postId}`
	})
}

const handleCategoryChange = (index) => {
	forumStore.setCategory(index)
	// 可以在这里加载对应分类的帖子数据
	// loadPostsByCategory(index)
}

const handleLike = (post) => {
	forumStore.toggleLike(post.id)
}

const handleComment = (post) => {
	uni.navigateTo({
		url: `./Detail?id=${post.id}`
	})
}

const handleCollect = (post) => {
	forumStore.toggleCollection(post.id)
}

const loadMore = () => {
	if (loading.value) return
	loading.value = true
	
	// 模拟加载更多数据
	setTimeout(() => {
		loading.value = false
		// 在实际应用中，这里应该调用API加载更多帖子
		// forumStore.updatePagination(hasMore)
	}, 1000)
}

// 搜索方法
const goToSearch = () => {
	if (!searchKeyword.value.trim()) {
		uni.showToast({
			title: '请输入搜索关键词',
			icon: 'none'
		})
		return
	}
	
	uni.navigateTo({
		url: `./SearchResult?keyword=${encodeURIComponent(searchKeyword.value)}`
	})
}
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background: #f5f5f5;
}

.search-bar {
	position: sticky;
	top: 0;
	z-index: 100;
	display: flex;
	align-items: center;
	padding: 20rpx;
	background: #fff;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);

	.search-box {
		flex: 1;
		display: flex;
		align-items: center;
		height: 72rpx;
		padding: 0 30rpx;
		background: #f5f5f5;
		border-radius: 36rpx;
		margin-right: 20rpx;

		.search-icon {
			width: 32rpx;
			height: 32rpx;
			margin-right: 10rpx;
		}

		input {
			flex: 1;
			font-size: 28rpx;
			color: #333;
		}
	}

	.post-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 30rpx;
		height: 72rpx;
		background: #2aeee6;
		border-radius: 36rpx;
		color: #fff;
		font-size: 28rpx;
		min-width: 80rpx;

		.icon-search {
			font-size: 32rpx;
			margin-right: 8rpx;
		}
	}
}

.category-scroll {
	background: #fff;
	padding: 20rpx 0;
	white-space: nowrap;
	border-bottom: 1rpx solid #f0f0f0;

	.category-list {
		display: inline-flex;
		padding: 0 20rpx;

		.category-item {
			padding: 10rpx 30rpx;
			margin-right: 20rpx;
			background: #fff;
			border-radius: 10rpx;
			font-size: 26rpx;
			color: #666;
			transition: all 0.3s;
			border: 2rpx solid transparent;

			&.active {
				background: #fff;
				color: #2aeee6;
				border-color: #2aeee6;
			}

			&:not(.active):hover {
				border-color: rgba(42, 238, 230, 0.3);
				color: #2aeee6;
			}

			&:last-child {
				margin-right: 0;
			}
		}
	}
}

.post-list {
	height: calc(100vh - 240rpx);
	padding: 20rpx;

	.post-item {
		width: 90%;
		margin-bottom: 20rpx;
		padding: 20rpx;
		background: #fff;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.04), 0 8rpx 24rpx rgba(0,0,0,0.04);
		transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s;
		&:active {
			transform: translateY(4rpx);
			box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.08);
		}

		.post-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;

			.user-info {
				display: flex;
				align-items: center;

				.avatar {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin-right: 20rpx;
				}

				.user-detail {
					display: flex;
					flex-direction: column;

					.username {
						font-size: 28rpx;
						color: #333;
						font-weight: bold;
					}

					.time {
						font-size: 24rpx;
						color: #999;
						margin-top: 4rpx;
					}
				}
			}

			.category-tag {
				padding: 4rpx 16rpx;
				background: rgba(42, 238, 230, 0.1);
				border-radius: 20rpx;
				font-size: 24rpx;
				color: #2aeee6;
			}
		}

		.post-content {
			.title {
				font-size: 32rpx;
				color: #333;
				font-weight: bold;
				margin-bottom: 16rpx;
				display: block;
			}

			.content {
				font-size: 28rpx;
				color: #666;
				line-height: 1.6;
				margin-bottom: 20rpx;
				display: block;
			}
			
			.ellipsis-1 {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			
			.ellipsis-2 {
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.image-list {
				display: flex;
				flex-wrap: wrap;
				margin: 0 -10rpx;

				.content-image {
					width: calc(33.33% - 20rpx);
					height: 200rpx;
					margin: 10rpx;
					border-radius: 8rpx;
				}
			}
		}

		.post-footer {
			display: flex;
			justify-content: flex-end;
			margin-top: 20rpx;
			padding-top: 20rpx;
			border-top: 1rpx solid #f0f0f0;

			.action-item {
				display: flex;
				align-items: center;
				margin-left: 40rpx;

				.action-icon {
					width: 40rpx;
					height: 40rpx;
					margin-right: 8rpx;
				}

				.count {
					font-size: 26rpx;
					color: #999;
				}
			}
		}
	}
}

.loading {
	text-align: center;
	padding: 30rpx 0;
	color: #999;
	font-size: 26rpx;
}

.float-btn {
	position: fixed;
	right: 40rpx;
	bottom: 40rpx;
	width: 100rpx;
	height: 100rpx;
	background: #2aeee6;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 20rpx rgba(42, 238, 230, 0.3);

	.icon-edit {
		font-size: 48rpx;
		color: #fff;
	}
}
</style> 