<!-- 论坛搜索结果页面 -->
<template>
	<view class="container">
		<!-- 顶部搜索栏 -->
		<view class="search-header">
			<view class="search-box">
				<image class="search-icon" src="/static/icons/Search.png" mode="aspectFit"></image>
				<input type="text" v-model="searchKeyword" placeholder="搜索帖子" @confirm="searchPosts" />
			</view>
			<view class="search-btn" @tap="searchPosts">
				<text>搜索</text>
			</view>
		</view>

		<!-- 搜索结果 -->
		<view class="search-result" v-if="searchResults.length > 0">
			<view class="result-header">
				<text class="result-count">共找到 {{ searchResults.length }} 条结果</text>
			</view>
			
			<!-- 帖子列表 -->
			<scroll-view class="post-list" scroll-y @scrolltolower="loadMore">
				<post-card 
					v-for="(item, index) in searchResults" 
					:key="index"
					:post="item"
					@detail="goToDetail"
				/>

				<!-- 加载更多 -->
				<view class="loading" v-if="loading">
					<text>加载中...</text>
				</view>
			</scroll-view>
		</view>
		
		<!-- 无搜索结果 -->
		<view class="empty-result" v-else>
			<image class="empty-icon" src="/static/icons/Empty.png" mode="aspectFit"></image>
			<text class="empty-text">没有找到相关内容</text>
			<text class="empty-tips">换个关键词试试吧</text>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useForumStore } from '@/stores/forum.js'
import PostCard from '../../components/common/PostCard.vue'

// 获取论坛store
const forumStore = useForumStore()

// 响应式数据
const searchKeyword = ref('')
const searchResults = ref([])
const loading = ref(false)

// 获取页面参数
onMounted(() => {
	console.log('SearchResult.vue - onMounted 被调用')
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	const options = currentPage.options
	
	console.log('SearchResult.vue - 当前页面参数:', options)
	
	if (options && options.keyword) {
		searchKeyword.value = decodeURIComponent(options.keyword)
		console.log('SearchResult.vue - 获取到搜索关键词:', searchKeyword.value)
		searchPosts()
	} else {
		console.log('SearchResult.vue - 未获取到搜索关键词')
	}
})

// 跳转到搜索页
const goToSearch = () => {
	console.log('SearchResult.vue - 返回到论坛页面')
	uni.redirectTo({
		url: './Forum'
	})
}

// 搜索帖子
const searchPosts = () => {
	console.log('SearchResult.vue - 开始搜索，关键词:', searchKeyword.value)
	
	if (!searchKeyword.value.trim()) {
		console.log('SearchResult.vue - 搜索关键词为空，不执行搜索')
		searchResults.value = []
		return
	}
	
	loading.value = true
	
	// 使用pinia中的搜索方法
	setTimeout(() => {
		console.log('SearchResult.vue - 调用 forumStore.searchPosts')
		const results = forumStore.searchPosts(searchKeyword.value)
		console.log('SearchResult.vue - 搜索结果数量:', results.length)
		console.log('SearchResult.vue - 搜索结果:', results)
		searchResults.value = results
		loading.value = false
		
		// 更新URL参数，不刷新页面
		const pages = getCurrentPages()
		const currentPage = pages[pages.length - 1]
		if (currentPage && currentPage.options) {
			currentPage.options.keyword = searchKeyword.value
			console.log('SearchResult.vue - 更新页面参数:', currentPage.options)
		}
	}, 300)
}

// 跳转到详情页
const goToDetail = (postId) => {
	uni.navigateTo({
		url: `./Detail?id=${postId}`
	})
}

// 加载更多
const loadMore = () => {
	if (loading.value) return
	loading.value = true
	
	// 模拟加载更多数据
	setTimeout(() => {
		loading.value = false
		// 实际应用中，这里应该调用API加载更多搜索结果
	}, 1000)
}
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background: #f5f5f5;
}

.search-header {
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

	.search-btn {
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
	}
}

.search-result {
	padding: 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	
	.result-header {
		width: 90%;
		padding: 10rpx 0;
		margin-bottom: 20rpx;
		
		.result-count {
			font-size: 26rpx;
			color: #999;
		}
	}
}

.post-list {
	height: calc(100vh - 180rpx);
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	
	box-sizing: border-box;
}

.empty-result {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-top: 200rpx;
	width: 100%;
	
	.empty-icon {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 40rpx;
	}
	
	.empty-text {
		font-size: 32rpx;
		color: #333;
		margin-bottom: 20rpx;
	}
	
	.empty-tips {
		font-size: 26rpx;
		color: #999;
	}
}

.loading {
	text-align: center;
	padding: 30rpx 0;
	color: #999;
	font-size: 26rpx;
}
</style> 