<!-- 帖子详情界面 -->
<template>
	<view class="container">
		<!-- 帖子内容 -->
		<view class="post-content">
			<!-- 用户信息 -->
			<view class="user-info" v-if="post">
				<image class="avatar" :src="post.user.avatar" mode="aspectFill"></image>
				<view class="user-detail">
					<text class="username">{{ post.user.username }}</text>
					<text class="time">{{ post.time }}</text>
				</view>
				<button class="follow-btn" :class="{ following: isFollowing }" @tap="toggleFollow">
					{{ isFollowing ? '已关注' : '关注' }}
				</button>
			</view>

			<!-- 帖子标题和内容 -->
			<view class="main-content" v-if="post">
				<text class="title">{{ post.title }}</text>
				<text class="content">{{ post.content }}</text>
				<view class="image-list" v-if="post.images && post.images.length">
					<image 
						v-for="(img, index) in post.images" 
						:key="index" 
						:src="img" 
						mode="widthFix"
						class="content-image"
						@tap="previewImage(index)"
					></image>
				</view>
				<view class="tags" v-if="post.tags && post.tags.length">
					<text class="tag" v-for="(tag, index) in post.tags" :key="index">#{{ tag }}</text>
				</view>
			</view>

			<!-- 互动数据 -->
			<view class="interaction" v-if="post">
				<view class="action-item" @tap="handleLike">
					<text class="iconfont" :class="{ active: post.isLiked }">👍</text>
					<text class="count">{{ post.likes }}</text>
				</view>
				<view class="action-item">
					<text class="iconfont">💬</text>
					<text class="count">{{ post.comments }}</text>
				</view>
				<view class="action-item" @tap="handleCollect">
					<text class="iconfont" :class="{ active: post.isCollected }">⭐</text>
					<text class="count">{{ post.collects }}</text>
				</view>
				<view class="action-item" @tap="showShare">
					<text class="iconfont">↗️</text>
					<text class="count">分享</text>
				</view>
			</view>
		</view>

		<!-- 评论区 -->
		<view class="comments-section">
			<view class="section-title">
				<text class="title">评论 {{ post?.comments || 0 }}</text>
				<view class="sort-btn">
					<text :class="{ active: sortType === 'hot' }" @tap="changeSortType('hot')">最热</text>
					<text class="separator">|</text>
					<text :class="{ active: sortType === 'new' }" @tap="changeSortType('new')">最新</text>
				</view>
			</view>

			<!-- 评论列表 -->
			<scroll-view class="comment-list" scroll-y @scrolltolower="loadMoreComments">
				<view class="comment-item" v-for="(comment, index) in comments" :key="index">
					<image class="avatar" :src="comment.avatar" mode="aspectFill"></image>
					<view class="comment-content">
						<view class="comment-header">
							<text class="username">{{ comment.username }}</text>
							<text class="time">{{ comment.time }}</text>
						</view>
						<text class="text">{{ comment.content }}</text>
						<view class="comment-footer">
							<view class="like" @tap="handleLikeComment(comment)">
								<text class="iconfont" :class="{ active: comment.isLiked }">👍</text>
								<text class="count">{{ comment.likes }}</text>
							</view>
							<text class="reply-btn" @tap="showReplyInput(comment.username, comment.id)">回复</text>
						</view>
						
						<!-- 回复列表 -->
						<view class="replies" v-if="comment.replies && comment.replies.length">
							<view 
								class="reply-item"
								v-for="(reply, replyIndex) in comment.replies"
								:key="replyIndex"
							>
								<text class="username">{{ reply.username }}</text>
								<text class="reply-text">{{ reply.content }}</text>
							</view>
							<text class="more-replies" v-if="comment.totalReplies > comment.replies.length">
								查看全部{{ comment.totalReplies }}条回复 >
							</text>
						</view>
					</view>
				</view>

				<!-- 加载更多 -->
				<view class="loading" v-if="loading">
					<text>加载中...</text>
				</view>
			</scroll-view>
		</view>

		<!-- 底部评论框 -->
		<view class="comment-bar">
			<input 
				type="text" 
				v-model="commentText"
				:placeholder="replyTo ? `回复 ${replyTo}：` : '说点什么吧...'"
				:focus="showKeyboard"
				@blur="hideKeyboard"
			/>
			<button 
				class="send-btn" 
				:class="{ active: commentText.length > 0 }"
				@tap="submitComment"
			>发送</button>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useForumStore } from '@/stores/forum.js'

// 获取论坛store
const forumStore = useForumStore()

// 响应式数据
const postId = ref(null)
const isFollowing = ref(false)
const sortType = ref('hot')
const loading = ref(false)
const showKeyboard = ref(false)
const commentText = ref('')
const replyTo = ref('')
const currentCommentId = ref(null) // 当前回复的评论ID

// 计算属性：获取帖子数据
const post = computed(() => {
	if (!postId.value) return null
	return forumStore.getPostById(postId.value)
})

// 计算属性：获取评论数据
const comments = computed(() => {
	if (!postId.value) return []
	
	const commentList = forumStore.getCommentsByPostId(postId.value)
	
	// 根据排序类型排序
	if (sortType.value === 'hot') {
		// 按点赞数排序
		return [...commentList].sort((a, b) => b.likes - a.likes)
	} else {
		// 按时间排序（新的在前）
		return [...commentList].sort((a, b) => b.timestamp - a.timestamp)
	}
})

// 生命周期钩子
onMounted(() => {
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	if (currentPage && currentPage.$page?.options?.id) {
		postId.value = parseInt(currentPage.$page.options.id)
		// 检查是否关注了帖子作者
		if (post.value && post.value.user) {
			isFollowing.value = forumStore.isUserFollowed(post.value.user.id)
		}
	}
})

// 方法
const toggleFollow = () => {
	if (!post.value || !post.value.user) return
	
	forumStore.toggleFollow(post.value.user.id)
	isFollowing.value = !isFollowing.value
}

const handleLike = () => {
	if (!post.value) return
	forumStore.toggleLike(post.value.id)
}

const handleCollect = () => {
	if (!post.value) return
	forumStore.toggleCollection(post.value.id)
}

const showShare = () => {
	// 实现分享功能
	uni.showShareMenu({
		withShareTicket: true,
		menus: ['shareAppMessage', 'shareTimeline']
	})
}

const changeSortType = (type) => {
	sortType.value = type
}

const loadMoreComments = () => {
	if (loading.value) return
	loading.value = true
	
	setTimeout(() => {
		loading.value = false
		// 实际应用中，这里应该调用API加载更多评论
	}, 500)
}

const handleLikeComment = (comment) => {
	if (!postId.value) return
	forumStore.likeComment(postId.value, comment.id)
}

const showReplyInput = (username, commentId) => {
	replyTo.value = username
	currentCommentId.value = commentId
	showKeyboard.value = true
}

const hideKeyboard = () => {
	showKeyboard.value = false
	replyTo.value = ''
	currentCommentId.value = null
}

const submitComment = () => {
	if (!commentText.value.trim()) {
		uni.showToast({
			title: '请输入评论内容',
			icon: 'none'
		})
		return
	}
	
	if (!postId.value) return
	
	if (currentCommentId.value) {
		// 添加回复
		const reply = {
			userId: 100, // 实际应用中应该使用当前登录用户的ID
			username: '当前用户', // 实际应用中应该使用当前登录用户的用户名
			avatar: '/static/logo.png',
			content: commentText.value,
			likes: 0
		}
		
		forumStore.addReply(postId.value, currentCommentId.value, reply)
	} else {
		// 添加评论
		const comment = {
			userId: 100, // 实际应用中应该使用当前登录用户的ID
			username: '当前用户', // 实际应用中应该使用当前登录用户的用户名
			avatar: '/static/logo.png',
			content: commentText.value,
			likes: 0,
			isLiked: false,
			replies: []
		}
		
		forumStore.addComment(postId.value, comment)
	}
	
	// 清空输入框并隐藏键盘
	commentText.value = ''
	hideKeyboard()
}

const previewImage = (index) => {
	if (!post.value || !post.value.images) return
	
	uni.previewImage({
		current: post.value.images[index],
		urls: post.value.images
	})
}
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background: #f5f5f5;
	padding-bottom: 120rpx;
}

.post-content {
	background: #fff;
	padding: 30rpx;
	margin-bottom: 20rpx;

	.user-info {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;

		.avatar {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}

		.user-detail {
			flex: 1;

			.username {
				font-size: 28rpx;
				color: #333;
				font-weight: bold;
				display: block;
			}

			.time {
				font-size: 24rpx;
				color: #999;
				margin-top: 4rpx;
			}
		}

		.follow-btn {
			padding: 10rpx 30rpx;
			background: #ff4400;
			border-radius: 30rpx;
			font-size: 24rpx;
			color: #fff;
			border: none;

			&.following {
				background: #f5f5f5;
				color: #666;
			}
		}
	}

	.main-content {
		.title {
			font-size: 36rpx;
			color: #333;
			font-weight: bold;
			margin-bottom: 20rpx;
			display: block;
		}

		.content {
			font-size: 28rpx;
			color: #666;
			line-height: 1.8;
			margin-bottom: 30rpx;
			display: block;
		}

		.image-list {
			margin-bottom: 30rpx;

			.content-image {
				width: 80%;
				max-width: 600rpx;
				display: block;
				margin: 0 auto 20rpx;
				border-radius: 12rpx;

				&:last-child {
					margin-bottom: 0;
				}
			}
		}

		.tags {
			display: flex;
			flex-wrap: wrap;

			.tag {
				font-size: 24rpx;
				color: #ff4400;
				background: #fff5f0;
				padding: 6rpx 20rpx;
				border-radius: 20rpx;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
			}
		}
	}

	.interaction {
		display: flex;
		justify-content: space-around;
		padding-top: 30rpx;
		border-top: 1rpx solid #f0f0f0;

		.action-item {
			display: flex;
			align-items: center;

			.iconfont {
				font-size: 36rpx;
				color: #999;
				margin-right: 10rpx;

				&.active {
					color: #ff4400;
				}
			}

			.count {
				font-size: 26rpx;
				color: #999;
			}
		}
	}
}

.comments-section {
	background: #fff;

	.section-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid #f0f0f0;

		.title {
			font-size: 30rpx;
			color: #333;
			font-weight: bold;
		}

		.sort-btn {
			font-size: 26rpx;

			text {
				color: #999;
				padding: 0 20rpx;

				&.active {
					color: #333;
					font-weight: bold;
				}
			}

			.separator {
				color: #eee;
			}
		}
	}

	.comment-list {
		height: calc(100vh - 800rpx);

		.comment-item {
			display: flex;
			padding: 30rpx;
			border-bottom: 1rpx solid #f0f0f0;

			.avatar {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}

			.comment-content {
				flex: 1;

				.comment-header {
					display: flex;
					align-items: center;
					margin-bottom: 10rpx;

					.username {
						font-size: 26rpx;
						color: #333;
						font-weight: bold;
						margin-right: 20rpx;
					}

					.time {
						font-size: 24rpx;
						color: #999;
					}
				}

				.text {
					font-size: 28rpx;
					color: #666;
					line-height: 1.6;
					margin-bottom: 16rpx;
				}

				.comment-footer {
					display: flex;
					align-items: center;
					margin-bottom: 16rpx;

					.like {
						display: flex;
						align-items: center;
						margin-right: 40rpx;

						.iconfont {
							font-size: 32rpx;
							color: #999;
							margin-right: 6rpx;

							&.active {
								color: #ff4400;
							}
						}

						.count {
							font-size: 24rpx;
							color: #999;
						}
					}

					.reply-btn {
						font-size: 24rpx;
						color: #999;
					}
				}

				.replies {
					background: #f8f8f8;
					border-radius: 8rpx;
					padding: 20rpx;

					.reply-item {
						font-size: 26rpx;
						color: #666;
						margin-bottom: 16rpx;

						.username {
							color: #333;
							font-weight: bold;
							margin-right: 10rpx;
						}

						&:last-child {
							margin-bottom: 0;
						}
					}

					.more-replies {
						font-size: 24rpx;
						color: #999;
						margin-top: 16rpx;
						display: block;
					}
				}
			}
		}
	}
}

.comment-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	padding: 20rpx;
	background: #fff;
	box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);

	input {
		flex: 1;
		height: 72rpx;
		padding: 0 30rpx;
		background: #f5f5f5;
		border-radius: 36rpx;
		font-size: 28rpx;
		margin-right: 20rpx;
	}

	.send-btn {
		width: 120rpx;
		height: 72rpx;
		line-height: 72rpx;
		text-align: center;
		background: #ccc;
		border-radius: 36rpx;
		font-size: 28rpx;
		color: #fff;
		border: none;

		&.active {
			background: #ff4400;
		}
	}
}

.loading {
	text-align: center;
	padding: 30rpx 0;
	color: #999;
	font-size: 26rpx;
}
</style> 