<!-- 发帖界面 -->
<template>
	<view class="container">
		<!-- 发帖表单 -->
		<view class="post-form">
			<!-- 标题输入 -->
			<view class="form-item">
			<input 
				class="title-input" 
					type="text" 
					v-model="postForm.title" 
				placeholder="请输入标题（必填）"
				maxlength="50"
			/>
				<text class="char-count">{{ postForm.title.length }}/50</text>
				<view class="divider"></view>
			</view>

			<!-- 内容输入 -->
			<view class="form-item">
			<textarea 
				class="content-input" 
					v-model="postForm.content" 
					placeholder="请输入帖子内容（必填）"
				maxlength="2000"
			></textarea>
				<text class="char-count">{{ postForm.content.length }}/2000</text>
				<view class="divider"></view>
			</view>

			<!-- 图片上传 -->
			<view class="form-item">
				<view class="upload-title">
					<text>添加图片</text>
					<text class="upload-count">{{ postForm.images.length }}/9</text>
				</view>
				<view class="upload-list">
					<view 
						class="upload-item" 
						v-for="(item, index) in postForm.images" 
						:key="index"
					>
						<image class="upload-image" :src="item" mode="aspectFill"></image>
						<view class="delete-btn" @tap="removeImage(index)">
							<text class="iconfont">×</text>
						</view>
					</view>
					<view class="upload-btn" @tap="chooseImage" v-if="postForm.images.length < 9">
						<text class="iconfont">+</text>
					</view>
				</view>
				<view class="divider"></view>
			</view>

			<!-- 分类选择 -->
			<view class="form-item">
				<view class="select-title">选择分类</view>
				<view class="category-list">
					<view 
						class="category-item"
						v-for="(item, index) in categories"
						:key="index"
						:class="{ active: postForm.categoryId === index + 1 }"
						@tap="selectCategory(index + 1, item)"
					>
						{{ item }}
					</view>
				</view>
				<view class="divider"></view>
			</view>

			<!-- 标签输入 -->
			<view class="form-item">
				<view class="tag-title">
					<text>添加标签</text>
					<text class="tag-tip">（选填，最多5个，用空格分隔）</text>
				</view>
				<input 
					class="tag-input" 
					type="text" 
					v-model="tagInput" 
					placeholder="例如：养猫经验 新手必看"
					@blur="handleTagInput"
				/>
				<view class="tag-list" v-if="postForm.tags.length">
					<view 
						class="tag-item" 
						v-for="(tag, index) in postForm.tags" 
						:key="index"
					>
						<text>#{{ tag }}</text>
						<text class="delete-tag" @tap="removeTag(index)">×</text>
					</view>
				</view>
				<view class="divider"></view>
			</view>
		</view>

		<!-- 右下角发布按钮 -->
		<view class="float-publish-btn" @tap="publishPost" :class="{ disabled: !canPublish }">
			<text>发布</text>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useForumStore } from '@/stores/forum.js'

// 获取论坛store
const forumStore = useForumStore()

// 分类数据
const categories = forumStore.categories.slice(1) // 去掉"全部"分类

// 表单数据
const postForm = ref({
			title: '',
			content: '',
			images: [],
	categoryId: 0,
	category: '',
	tags: []
})

// 标签输入
const tagInput = ref('')

// 分类数据缓存
const categoryCache = ref({
	// 格式: { 分类ID: { posts: [...], page: 1, hasMore: true } }
})

// 计算是否可以发布
const canPublish = computed(() => {
	return postForm.value.title.trim() && 
		   postForm.value.content.trim() && 
		   postForm.value.categoryId > 0
})

// 选择分类
const selectCategory = (id, name) => {
	postForm.value.categoryId = id
	postForm.value.category = name
}

// 处理标签输入
const handleTagInput = () => {
	if (!tagInput.value.trim()) return
	
	const tags = tagInput.value.split(/\s+/).filter(tag => tag.trim())
	
	// 合并标签并去重
	const uniqueTags = [...new Set([...postForm.value.tags, ...tags])]
	
	// 限制最多5个标签
	postForm.value.tags = uniqueTags.slice(0, 5)
	
	// 清空输入
	tagInput.value = ''
}

// 移除标签
const removeTag = (index) => {
	postForm.value.tags.splice(index, 1)
}

// 选择图片
const chooseImage = () => {
	uni.chooseImage({
		count: 9 - postForm.value.images.length,
		sizeType: ['compressed'],
		sourceType: ['album', 'camera'],
		success: (res) => {
			// 合并图片数组
			postForm.value.images = [...postForm.value.images, ...res.tempFilePaths]
					}
				})
}

// 移除图片
const removeImage = (index) => {
	postForm.value.images.splice(index, 1)
			}

// 发布帖子
const publishPost = () => {
	if (!canPublish.value) {
		uni.showToast({
			title: '请完善帖子信息',
			icon: 'none'
		})
		return
	}

	// 显示加载提示
			uni.showLoading({
				title: '发布中...'
			})

	// 构建帖子数据
	const newPost = {
		// 帖子ID会在store中自动生成
		user: {
			id: 100, // 实际应用中应该使用当前登录用户的ID
			username: '当前用户', // 实际应用中应该使用当前登录用户的用户名
			avatar: '/static/logo.png' // 实际应用中应该使用当前登录用户的头像
		},
		title: postForm.value.title,
		content: postForm.value.content,
		images: postForm.value.images,
		category: postForm.value.category,
		categoryId: postForm.value.categoryId,
		tags: postForm.value.tags,
		time: '刚刚',
		likes: 0,
		comments: 0,
		collects: 0,
		isLiked: false,
		isCollected: false
	}
	
	// 模拟网络请求延迟
			setTimeout(() => {
		// 添加到store
		forumStore.addPost(newPost)
		
		// 隐藏加载提示
				uni.hideLoading()
		
		// 显示成功提示
				uni.showToast({
					title: '发布成功',
					icon: 'success'
				})
		
		// 返回论坛页面
		setTimeout(() => {
				uni.navigateBack()
			}, 1500)
	}, 1000)
}

// 返回上一页
const goBack = () => {
	uni.navigateBack()
}

const cacheCurrentCategoryData = (categoryId) => {
	const cacheKey = categoryId === null ? 0 : categoryId
	categoryCache.value[cacheKey] = {
		posts: [...forumStore.posts],
		page: currentPage.value,
		hasMore: forumStore.pagination.hasMore
				}
}

const handleCategoryChange = async (index) => {
	// 如果点击的是当前分类，不做任何操作
	if (forumStore.currentCategory === index) return
	
	// 设置新的分类
	forumStore.setCategory(index)
	
	// 获取分类ID
	const categoryId = index === 0 ? null : index
	const cacheKey = categoryId === null ? 0 : categoryId
	
	// 检查是否有缓存数据
	if (categoryCache.value[cacheKey]) {
		// 使用缓存数据
		forumStore.setPosts(categoryCache.value[cacheKey].posts)
		currentPage.value = categoryCache.value[cacheKey].page
		forumStore.pagination.hasMore = categoryCache.value[cacheKey].hasMore
		return
	}
	
	// 没有缓存数据，需要加载
	loading.value = true
	// ... 加载数据的逻辑 ...
}
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background: #fff;
	position: relative;
}

.float-publish-btn {
	position: fixed;
	right: 40rpx;
	bottom: 40rpx;
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	background: #ff4400;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	box-shadow: 0 4rpx 20rpx rgba(255, 68, 0, 0.3);
	z-index: 999;
	
	&.disabled {
		background: #ccc;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
	}
}

.post-form {
	padding: 30rpx;

	.form-item {
		margin-bottom: 50rpx;
		position: relative;

		.divider {
			position: absolute;
			bottom: -20rpx;
			left: 0;
			right: 0;
			height: 1rpx;
			background-color: #f0f0f0;
		}

	.title-input {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

		.char-count {
		font-size: 24rpx;
		color: #999;
		text-align: right;
		display: block;
		margin-bottom: 30rpx;
	}

	.content-input {
		font-size: 28rpx;
		line-height: 1.6;
		min-height: 200rpx;
		width: 100%;
		margin-bottom: 30rpx;
	}

		.upload-title {
			font-size: 28rpx;
			font-weight: bold;
			margin-bottom: 10rpx;
		}

		.upload-count {
			font-size: 24rpx;
			color: #999;
		}

		.upload-list {
		display: flex;
		flex-wrap: wrap;
		margin: 0 -10rpx;

			.upload-item {
			width: calc(33.33% - 20rpx);
			margin: 10rpx;
			position: relative;

			image {
				width: 100%;
				height: 200rpx;
				border-radius: 8rpx;
			}

			.delete-btn {
				position: absolute;
				top: -20rpx;
				right: -20rpx;
				width: 40rpx;
				height: 40rpx;
				line-height: 40rpx;
				text-align: center;
				background: rgba(0,0,0,0.5);
				color: #fff;
				border-radius: 50%;
				font-size: 32rpx;
			}
		}

		.upload-btn {
			width: calc(33.33% - 20rpx);
			height: 200rpx;
			margin: 10rpx;
			background: #f5f5f5;
			border-radius: 8rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.iconfont {
				font-size: 48rpx;
				color: #999;
				margin-bottom: 10rpx;
			}
	}
}

		.select-title {
			font-size: 28rpx;
			font-weight: bold;
			margin-bottom: 10rpx;
}

.category-list {
	display: flex;
	flex-wrap: wrap;
	margin: 0 -10rpx;

	.category-item {
		width: calc(33.33% - 20rpx);
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		background: #f5f5f5;
		border-radius: 8rpx;
		margin: 10rpx;
		font-size: 26rpx;
		color: #666;

		&.active {
			background: #ff4400;
			color: #fff;
				}
			}
		}

		.tag-title {
			font-size: 28rpx;
			font-weight: bold;
			margin-bottom: 10rpx;
		}

		.tag-tip {
			font-size: 24rpx;
			color: #999;
		}

		.tag-input {
			font-size: 28rpx;
			line-height: 1.6;
			min-height: 80rpx;
			width: 100%;
			margin-bottom: 30rpx;
		}

		.tag-list {
			display: flex;
			flex-wrap: wrap;
			margin: 0 -10rpx;

			.tag-item {
				padding: 10rpx 30rpx;
				background: #f5f5f5;
				border-radius: 30rpx;
				font-size: 26rpx;
				color: #666;
				margin: 10rpx;

				&:last-child {
					margin-right: 0;
				}
			}
		}
	}
}
</style> 