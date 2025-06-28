<template>
	<view class="container">
		<!-- 顶部搜索栏 -->
		<view class="search-header">
			<view class="search-box">
				<image class="search-icon" src="/static/icons/Search.png" mode="aspectFit"></image>
				<input 
					type="text" 
					v-model="searchKeyword" 
					placeholder="茉莉奶绿" 
					confirm-type="search"
					@confirm="handleSearch"
					focus
				/>
			</view>
			<text class="cancel-btn" @tap="goBack">取消</text>
		</view>

		<!-- 搜索历史和热门搜索 -->
		<view class="search-content" v-if="!searchKeyword">
			<!-- 热门搜索 -->
			<view class="search-section">
				<view class="section-title">
					<text>热门搜索</text>
					<text class="fire-icon">🔥</text>
				</view>
				<view class="tag-list">
					<text 
						class="tag-item hot" 
						v-for="(item, index) in hotSearches" 
						:key="index"
						@tap="selectTag(item)"
					>
						{{ item }}
					</text>
				</view>
			</view>

			<!-- 搜索历史 -->
			<view class="search-section" v-if="searchHistory.length > 0">
				<view class="section-title">
					<text>搜索历史</text>
					<text class="clear-icon" @tap="clearHistory">清空</text>
				</view>
				<view class="tag-list">
					<text 
						class="tag-item" 
						v-for="(item, index) in searchHistory" 
						:key="index"
						@tap="selectTag(item)"
					>
						{{ item }}
					</text>
				</view>
			</view>
		</view>

		<!-- 搜索结果 -->
		<view class="search-result" v-else>
			<view class="result-item" v-for="(item, index) in searchResults" :key="index">
				<text>{{ item }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 响应式数据
const searchKeyword = ref('')
const hotSearches = ref(['茉莉奶绿', '冰鲜柠檬水', '草莓慕斯', '葡萄冰美式', '美式咖啡', '雪王拿铁咖啡', '珍珠奶茶'])
const searchHistory = ref([])
const searchResults = ref([])

// 生命周期钩子
onMounted(() => {
	// 从本地存储加载搜索历史
	try {
		const history = uni.getStorageSync('searchHistory')
		if (history) {
			searchHistory.value = JSON.parse(history)
		}
	} catch (e) {
		console.error('Failed to load search history:', e)
	}
})

// 方法
const goBack = () => {
	uni.navigateBack()
}

const handleSearch = () => {
	if (!searchKeyword.value.trim()) return
	
	// 添加到搜索历史
	if (!searchHistory.value.includes(searchKeyword.value)) {
		searchHistory.value.unshift(searchKeyword.value)
		if (searchHistory.value.length > 10) {
			searchHistory.value.pop()
		}
		// 保存到本地存储
		uni.setStorage({
			key: 'searchHistory',
			data: JSON.stringify(searchHistory.value)
		})
	}

	// TODO: 实现搜索逻辑
	uni.navigateTo({
		url: `./SearchResult?keyword=${encodeURIComponent(searchKeyword.value)}`
	})
}

const selectTag = (keyword) => {
	searchKeyword.value = keyword
	handleSearch()
}

const clearHistory = () => {
	uni.showModal({
		title: '提示',
		content: '确定要清空搜索历史吗？',
		success: (res) => {
			if (res.confirm) {
				searchHistory.value = []
				uni.removeStorage({
					key: 'searchHistory'
				})
			}
		}
	})
}
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background: #fff;
}

.search-header {
	display: flex;
	align-items: center;
	padding: 20rpx;
	background: #fff;
	border-bottom: 1rpx solid #f5f5f5;
	
	.search-box {
		flex: 1;
		display: flex;
		align-items: center;
		padding: 15rpx 20rpx;
		background: #f5f5f5;
		border-radius: 30rpx;
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
	
	.cancel-btn {
		font-size: 28rpx;
		color: #666;
	}
}

.search-content {
	padding: 30rpx;
}

.search-section {
	margin-bottom: 40rpx;
	
	.section-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		font-size: 28rpx;
		color: #333;
		
		.fire-icon {
			margin-left: 10rpx;
		}
		
		.clear-icon {
			color: #999;
			font-size: 26rpx;
		}
	}
	
	.tag-list {
		display: flex;
		flex-wrap: wrap;
		
		.tag-item {
			padding: 10rpx 30rpx;
			background: #f5f5f5;
			border-radius: 30rpx;
			margin: 0 20rpx 20rpx 0;
			font-size: 26rpx;
			color: #666;
			
			&.hot {
				background: #fff5f0;
				color: #ff4400;
			}
		}
	}
}

.search-result {
	padding: 20rpx;
	
	.result-item {
		padding: 20rpx;
		border-bottom: 1rpx solid #f5f5f5;
		font-size: 28rpx;
		color: #333;
	}
}
</style> 