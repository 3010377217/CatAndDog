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

		<!-- 分类切换时的加载指示器 -->
		<view class="category-loading" v-if="loading">
			<view class="loading-spinner"></view>
			<text>加载中...</text>
		</view>

		<!-- 帖子列表 -->
		<scroll-view 
			class="post-list" 
			scroll-y 
			@scrolltolower="loadMore"
			refresher-enabled
			:refresher-triggered="refreshing"
			@refresherrefresh="onRefresh"
		>
			<post-card 
				v-for="(item, index) in filteredPosts" 
				:key="index"
				:post="item"
				@detail="goToDetail"
			/>

			<!-- 加载更多 -->
			<view class="loading" v-if="loading && !isChangingCategory">
				<text>加载中...</text>
			</view>
			
			<!-- 没有更多数据提示 -->
			<view class="no-more" v-if="!loading && !forumStore.pagination.hasMore && forumStore.posts.length > 0">
				<text>已经没有更多数据了QwQ</text>
			</view>
		</scroll-view>

		<!-- 悬浮发帖按钮 -->
		<view class="float-btn" @tap="goToPost">
			<text class="iconfont icon-edit">✏️</text>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useForumStore } from '@/stores/forum.js'
import PostCard from '../../components/common/PostCard.vue'

// 获取论坛store
const forumStore = useForumStore()

// 响应式数据
const loading = ref(false)
const refreshing = ref(false) // 下拉刷新状态
const searchKeyword = ref('')
const currentPage = ref(1) // 当前页码
const isChangingCategory = ref(false) // 是否正在切换分类

// 分类数据缓存
const categoryCache = ref({
	// 格式: { 分类ID: { posts: [...], page: 1, hasMore: true } }
})

// 计算属性：获取帖子列表
const filteredPosts = computed(() => {
	return forumStore.posts
})

// 首次加载数据
onMounted(async () => {
	console.log('Forum.vue - 页面加载，开始获取第一页数据')
	console.log('Forum.vue - 当前分类索引:', forumStore.currentCategory)
	loading.value = true
	try {
		const categoryId = forumStore.currentCategory === 0 ? null : forumStore.currentCategory
		console.log('Forum.vue - 首次加载分类ID:', categoryId)
		
		// 每页加载5条数据
		await forumStore.fetchPosts(1, 5, categoryId)
		currentPage.value = 1
		
		// 缓存首次加载的数据
		cacheCurrentCategoryData(categoryId)
		
		console.log('Forum.vue - 首次加载成功，帖子数量:', forumStore.posts.length)
		console.log('Forum.vue - 分页信息:', forumStore.pagination)
	} catch (error) {
		console.error('Forum.vue - 获取帖子数据失败:', error)
		uni.showToast({
			title: '获取数据失败，请重试',
			icon: 'none'
		})
	} finally {
		loading.value = false
	}
})

// 缓存当前分类的数据
const cacheCurrentCategoryData = (categoryId) => {
	const cacheKey = categoryId === null ? 0 : categoryId
	categoryCache.value[cacheKey] = {
		posts: [...forumStore.posts],
		page: currentPage.value,
		hasMore: forumStore.pagination.hasMore
	}
	console.log('Forum.vue - 缓存分类数据:', cacheKey, categoryCache.value[cacheKey])
}

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

// 下拉刷新方法
const onRefresh = async () => {
	console.log('Forum.vue - 触发下拉刷新')
	refreshing.value = true
	
	try {
		const categoryId = forumStore.currentCategory === 0 ? null : forumStore.currentCategory
		const currentPosts = forumStore.posts || []
		
		console.log('Forum.vue - 下拉刷新，当前帖子数量:', currentPosts.length)
		
		// 使用常规的fetchPosts方法，但在组件内实现随机获取逻辑
		if (currentPosts.length < 6) {
			// 当帖子少于6条时，需要确保刷新后的数据与当前数据不重复
			console.log('Forum.vue - 当前帖子少于6条，执行去重逻辑')
			
			// 获取当前帖子的ID数组
			const currentPostIds = currentPosts.map(post => post.id)
			console.log('Forum.vue - 当前帖子ID:', currentPostIds)
			
			// 先获取第一页数据
			await forumStore.fetchPosts(1, 5, categoryId)
			
			// 检查获取的新帖子中与当前帖子重复的数量
			const newPosts = forumStore.posts || []
			let duplicateCount = 0
			
			for (const post of newPosts) {
				if (currentPostIds.includes(post.id)) {
					duplicateCount++
				}
			}
			
			// 如果有重复的帖子，再获取更多数据进行替换
			if (duplicateCount > 0) {
				console.log('Forum.vue - 发现', duplicateCount, '条重复帖子，继续获取额外帖子')
				
				// 获取第二页数据用于替换重复的数据
				const nextPageResult = await forumStore.fetchPosts(2, duplicateCount, categoryId)
				
				if (nextPageResult.data.length > 0) {
					// 替换重复的帖子
					let uniquePosts = [...newPosts]
					let replacementIndex = 0
					
					// 删除重复的帖子
					uniquePosts = uniquePosts.filter(post => !currentPostIds.includes(post.id))
					
					// 添加新获取的帖子
					uniquePosts = [...uniquePosts, ...nextPageResult.data]
					
					// 更新帖子列表
					forumStore.setPosts(uniquePosts)
				}
			}
			
			console.log('Forum.vue - 去重后获取到', forumStore.posts.length, '条新帖子')
		} else {
			// 当帖子大于等于6条时，直接获取第一页数据
			console.log('Forum.vue - 当前帖子大于等于6条，直接获取新数据')
			
			// 获取一个随机的页码 (1-3之间)
			const randomPage = Math.floor(Math.random() * 3) + 1
			console.log('Forum.vue - 随机获取第', randomPage, '页数据')
			
			await forumStore.fetchPosts(randomPage, 5, categoryId)
		}
		
		// 重置页码
		currentPage.value = 1
		
		// 更新缓存
		cacheCurrentCategoryData(categoryId)
		
		console.log('Forum.vue - 下拉刷新成功，当前帖子数量:', forumStore.posts.length)
		uni.showToast({
			title: '刷新成功',
			icon: 'success',
			duration: 1500
		})
	} catch (error) {
		console.error('Forum.vue - 下拉刷新失败:', error)
		uni.showToast({
			title: '刷新失败，请重试',
			icon: 'none'
		})
	} finally {
		// 停止下拉刷新状态
		refreshing.value = false
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
		console.log('Forum.vue - 使用缓存数据，分类:', index)
		
		// 直接使用缓存数据，不显示加载状态
		forumStore.setPosts(categoryCache.value[cacheKey].posts)
		currentPage.value = categoryCache.value[cacheKey].page
		forumStore.pagination.hasMore = categoryCache.value[cacheKey].hasMore
		
		return
	}
	
	// 没有缓存数据，需要加载
	console.log('Forum.vue - 切换到新分类，开始加载数据:', index)
	
	// 设置正在切换分类状态
	isChangingCategory.value = true
	loading.value = true
	
	try {
		// 获取对应分类的帖子数据
		await forumStore.fetchPosts(1, 5, categoryId)
		currentPage.value = 1
		
		// 缓存数据
		cacheCurrentCategoryData(categoryId)
		
	} catch (error) {
		console.error('Forum.vue - 切换分类获取数据失败:', error)
		uni.showToast({
			title: '获取数据失败，请重试',
			icon: 'none'
		})
	} finally {
		loading.value = false
		isChangingCategory.value = false
	}
}

const loadMore = async () => {
	console.log('Forum.vue - 触发加载更多，当前页码:', currentPage.value)
	console.log('Forum.vue - 当前加载状态:', loading.value)
	console.log('Forum.vue - 是否还有更多数据:', forumStore.pagination.hasMore)
	console.log('Forum.vue - 当前帖子列表长度:', forumStore.posts.length)
	
	if (loading.value || !forumStore.pagination.hasMore) {
		console.log('Forum.vue - 加载中或没有更多数据，跳过加载')
		return
	}
	
	loading.value = true
	console.log('Forum.vue - 开始加载下一页数据')
	
	try {
		// 加载下一页数据
		const nextPage = currentPage.value + 1
		const categoryId = forumStore.currentCategory === 0 ? null : forumStore.currentCategory
		console.log('Forum.vue - 请求加载第', nextPage, '页数据，分类ID:', categoryId)
		
		// 每页加载5条数据
		const result = await forumStore.fetchPosts(nextPage, 5, categoryId)
		console.log('Forum.vue - 获取到的数据:', result)
		
		if (result.data.length > 0) {
			currentPage.value = nextPage
			console.log('Forum.vue - 加载更多成功，当前页码更新为:', currentPage.value)
			console.log('Forum.vue - 当前帖子列表长度:', forumStore.posts.length)
			console.log('Forum.vue - 获取到的新数据:', result.data)
			
			// 更新缓存
			cacheCurrentCategoryData(categoryId)
		} else {
			console.log('Forum.vue - 没有更多数据了')
			uni.showToast({
				title: '没有更多数据了',
				icon: 'none'
			})
		}
	} catch (error) {
		console.error('Forum.vue - 加载更多失败:', error)
		uni.showToast({
			title: '加载更多失败，请重试',
			icon: 'none'
		})
	} finally {
		loading.value = false
		console.log('Forum.vue - 加载完成，重置loading状态')
	}
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
	
	console.log('Forum.vue - 发起搜索，关键词:', searchKeyword.value)
	
	// 将搜索关键词添加到URL参数中
	const url = `./SearchResult?keyword=${encodeURIComponent(searchKeyword.value)}`
	console.log('Forum.vue - 跳转URL:', url)
	
	uni.navigateTo({
		url: url,
		success: function() {
			console.log('Forum.vue - 页面跳转成功')
		},
		fail: function(err) {
			console.error('Forum.vue - 页面跳转失败:', err)
		}
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

.category-loading {
				display: flex;
				align-items: center;
	justify-content: center;
	padding: 20rpx 0;
	background: #f5f5f5;
	border-bottom: 1rpx solid #f0f0f0;

	.loading-spinner {
		width: 36rpx;
		height: 36rpx;
		margin-right: 10rpx;
		border: 3rpx solid #f0f0f0;
		border-top: 3rpx solid #2aeee6;
					border-radius: 50%;
		animation: spin 1s linear infinite;
				}

	text {
					font-size: 26rpx;
					color: #999;
				}
			}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
	}

.post-list {
	height: calc(100vh - 240rpx);
	margin: 30rpx auto;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.loading {
	text-align: center;
	padding: 30rpx 0;
	color: #999;
	font-size: 26rpx;
}

.no-more {
	text-align: center;
	padding: 30rpx 0;
	color: #999;
	font-size: 26rpx;
	border-top: 1rpx solid #f0f0f0;
	margin-top: 10rpx;
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