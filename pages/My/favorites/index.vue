<template>
  <view class="posts-page">
    <!-- 搜索框 -->
    <view class="search-bar">
      <input v-model="searchQuery" placeholder="搜索收藏标题/内容" placeholder-class="placeholder" @input="handleSearch" />
      <image src="/static/icons/Search.png" mode="aspectFit" class="search-icon" />
    </view>

    <!-- 批量删除顶部操作栏 -->
    <view class="batch-header" :class="{ show: isBatchDelete }">
      <view class="cancel-btn" @tap="toggleBatchDelete">取消</view>
      <view class="select-all-btn" @tap="toggleSelectAll">{{ isAllSelected ? '取消全选' : '全选' }}</view>
    </view>

    <!-- 收藏列表 -->
    <view class="post-list" :class="{ 'batch-mode': isBatchDelete }">
      <view
        class="post-item"
        v-for="item in filteredFavorites"
        :key="item.id"
        :class="{ 'batch-mode': isBatchDelete, selected: item.checked }"
        @tap="isBatchDelete && toggleSelect(item.id)"
      >
        <!-- 选择圈 -->
        <view
          class="select-circle"
          v-if="isBatchDelete"
          :class="{ selected: item.checked }"
          @tap.stop="toggleSelect(item.id)"
        ></view>

        <view class="post-header">
          <view class="title">{{ item.title }}</view>
          <view class="delete-icon" v-if="!isBatchDelete" @tap.stop="confirmDelete(item.id)">
            <image src="/static/icons/Delete.png" mode="aspectFit" />
          </view>
        </view>
        <view class="post-content">{{ item.content }}</view>
        <view class="post-footer">
          <text class="date">{{ item.date }}</text>
          <view class="stat-group">
            <image src="/static/icons/like.png" class="stat-icon" mode="aspectFit" />
            <text class="stat-text">{{ item.likes }}</text>
            <image src="/static/icons/comment.png" class="stat-icon" mode="aspectFit" style="margin-left: 24rpx;" />
            <text class="stat-text">{{ item.comments }}</text>
            <image src="/static/icons/Collect.png" class="stat-icon" mode="aspectFit" style="margin-left: 24rpx;" />
            <text class="stat-text">{{ item.favorites }}</text>
          </view>
        </view>
      </view>
      <view v-if="filteredFavorites.length === 0" class="empty-tip">暂无收藏~</view>
    </view>

    <!-- 底部按钮区域 -->
    <view class="btn-section">
      <button class="delete-batch-btn" @tap="isBatchDelete ? confirmDeleteBatch() : toggleBatchDelete()">
        <text>{{ isBatchDelete ? '删除选中' : '批量删除' }}</text>
      </button>
      <button class="cancel-btn" v-if="isBatchDelete" @tap="toggleBatchDelete">取消</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onBackPress } from '@dcloudio/uni-app'

// 收藏示例数据
const favorites = ref([
  { id: 101, title: '超萌猫咪表情包', content: '收藏于 2025-06-15', date: '2025-06-15', likes: 22, comments: 4, favorites: 15, checked: false },
  { id: 102, title: '狗狗日常搞笑合集', content: '收藏于 2025-06-14', date: '2025-06-14', likes: 10, comments: 0, favorites: 9, checked: false },
  { id: 103, title: '关于宠物饮食的 5 个小窍门', content: '收藏于 2025-06-10', date: '2025-06-10', likes: 7, comments: 2, favorites: 3, checked: false }
])

// 搜索关键字
const searchQuery = ref('')
const filteredFavorites = computed(() => {
  if (!searchQuery.value.trim()) return favorites.value
  const q = searchQuery.value.trim().toLowerCase()
  return favorites.value.filter(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q))
})
function handleSearch() {}

// 批量删除逻辑
const isBatchDelete = ref(false)
function toggleBatchDelete() {
  isBatchDelete.value = !isBatchDelete.value
  if (!isBatchDelete.value) {
    favorites.value.forEach(p => (p.checked = false))
  }
}
function toggleSelect(id) {
  const item = favorites.value.find(p => p.id === id)
  if (item) item.checked = !item.checked
}
const isAllSelected = computed(() => filteredFavorites.value.length > 0 && filteredFavorites.value.every(p => p.checked))
function toggleSelectAll() {
  const status = !isAllSelected.value
  filteredFavorites.value.forEach(p => (p.checked = status))
}
function confirmDeleteBatch() {
  uni.showModal({
    title: '提示',
    content: '确认删除选中的收藏吗？',
    success: res => {
      if (res.confirm) {
        favorites.value = favorites.value.filter(p => !p.checked)
        isBatchDelete.value = false
        uni.showToast({ title: '已删除', icon: 'success' })
      }
    }
  })
}
function confirmDelete(id) {
  uni.showModal({
    title: '提示',
    content: '确定删除该收藏？',
    success: res => {
      if (res.confirm) deleteFavorite(id)
    }
  })
}
function deleteFavorite(id) {
  favorites.value = favorites.value.filter(p => p.id !== id)
  uni.showToast({ title: '已删除', icon: 'success' })
}

onBackPress(() => {
  if (isBatchDelete.value) {
    isBatchDelete.value = false
    return true
  }
  return false
})
</script>

<style lang="scss" scoped>
// 复用帖子页面样式
.posts-page {
  min-height: 100vh;
  background: #f6f6f6;
  padding-bottom: 120rpx;
  position: relative;
}

.search-bar {
  width: 80%;
  margin: 20rpx auto 0 auto;
  display: flex;
  align-items: center;
  background: #fff;
  padding: 20rpx 30rpx;
  border: 1rpx solid #eee;
  border-radius: 50rpx;
  box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.03);
  input {
    flex: 1;
    font-size: 28rpx;
    color: #333;
  }
  .search-icon {
    width: 34rpx;
    height: 34rpx;
    margin-left: 20rpx;
  }
  .placeholder {
    color: #bbb;
  }
}

.batch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 0 30rpx;
  height: 0;
  overflow: hidden;
  opacity: 0;
  transform: translateY(-100%);
  transition: all 0.4s ease;
  &.show {
    padding: 20rpx 30rpx;
    height: 80rpx;
    opacity: 1;
    transform: translateY(0);
  }
  .cancel-btn,
  .select-all-btn {
    font-size: 28rpx;
  }
  .select-all-btn {
    color: #2aeee6;
  }
}

.post-list {
  padding: 24rpx 20rpx 0 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: padding-left 0.3s ease;
  &.batch-mode {
    padding-left: 100rpx;
    align-items: flex-end;
  }
}

.post-item {
  width: 90%;
  max-width: 650rpx;
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  margin-bottom: 24rpx;
  padding: 24rpx 24rpx 18rpx;
  position: relative;
  border: 1rpx solid #f0f0f0;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  &.batch-mode {
    width: 95%;
    transform: translateX(10rpx) scale(0.97);
    &.selected {
      background-color: #e6fcfb;
      border-color: #2aeee6;
    }
  }
}

.select-circle {
  position: absolute;
  left: -65rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 2rpx solid #ccc;
  background: #fff;
  &.selected {
    background: #2aeee6;
    border-color: #2aeee6;
    &:after {
      content: '';
      position: absolute;
      left: 12rpx;
      top: 6rpx;
      width: 12rpx;
      height: 20rpx;
      border-right: 2rpx solid #fff;
      border-bottom: 2rpx solid #fff;
      transform: rotate(45deg);
    }
  }
}
.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    font-size: 30rpx;
    color: #222;
    font-weight: 500;
  }
  .delete-icon {
    width: 40rpx;
    height: 40rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
}
.post-content {
  font-size: 26rpx;
  color: #555;
  margin: 12rpx 0 0;
  line-height: 38rpx;
}
.post-footer {
  margin-top: 18rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .date {
    font-size: 24rpx;
    color: #999;
  }
  .stat-group {
    display: flex;
    align-items: center;
    .stat-icon {
      width: 28rpx;
      height: 28rpx;
    }
    .stat-text {
      font-size: 24rpx;
      color: #999;
      margin-left: 8rpx;
    }
  }
}
.empty-tip {
  text-align: center;
  color: #bbb;
  font-size: 28rpx;
  margin: 60rpx 0;
}

.btn-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.06);
  padding: 24rpx 30rpx;
  display: flex;
  justify-content: center;
  gap: 20rpx;
  .delete-batch-btn,
  .cancel-btn {
    width: 33%;
    font-size: 28rpx;
    font-weight: bold;
    border-radius: 40rpx;
    height: 80rpx;
    line-height: 80rpx;
    border: none;
  }
  .delete-batch-btn {
    background: linear-gradient(90deg, #ff6b6b 0%, #e53935 100%);
    color: #fff;
  }
  .cancel-btn {
    background: #f5f5f5;
    color: #666;
    border: 1rpx solid #e0e0e0;
  }
}
</style> 