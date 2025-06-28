<!-- 帖子卡片组件 -->
<template>
  <view 
    class="post-item" 
    @tap="goToDetail"
  >
    <!-- 用户信息 -->
    <view class="post-header">
      <view class="user-info">
        <image class="avatar" :src="post.user.avatar" mode="aspectFill"></image>
        <view class="user-detail">
          <text class="username">{{ post.user.username }}</text>
          <text class="time">{{ post.time }}</text>
        </view>
      </view>
      <view class="category-tag">{{ post.category }}</view>
    </view>

    <!-- 帖子内容 -->
    <view class="post-content">
      <text class="title ellipsis-1">{{ post.title }}</text>
      <text class="content ellipsis-2">{{ post.content }}</text>
      <view class="image-list" v-if="post.images && post.images.length">
        <image 
          v-for="(img, imgIndex) in post.images" 
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
          :src="post.isLiked ? '/static/icons/Like-active.png' : '/static/icons/Like.png'" 
          mode="aspectFit" 
          class="action-icon"
          @tap.stop="handleLike"
        ></image>
        <text class="count">{{ post.likes }}</text>
      </view>
      <view class="action-item">
        <image 
          src="/static/icons/Comment.png" 
          mode="aspectFit" 
          class="action-icon"
          @tap.stop="handleComment"
        ></image>
        <text class="count">{{ post.comments }}</text>
      </view>
      <view class="action-item">
        <image 
          :src="post.isCollected ? '/static/icons/Collect-active.png' : '/static/icons/Collect.png'" 
          mode="aspectFit" 
          class="action-icon"
          @tap.stop="handleCollect"
        ></image>
        <text class="count">{{ post.collects || 0 }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { useForumStore } from '@/stores/forum.js'

// 定义组件属性
const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

// 定义事件
const emit = defineEmits(['detail'])

// 获取论坛store
const forumStore = useForumStore()

// 跳转到详情页
const goToDetail = () => {
  emit('detail', props.post.id)
}

// 点赞
const handleLike = () => {
  forumStore.toggleLike(props.post.id)
}

// 评论
const handleComment = () => {
  emit('detail', props.post.id)
}

// 收藏
const handleCollect = () => {
  forumStore.toggleCollection(props.post.id)
}
</script>

<style lang="scss" scoped>
.post-item {
  width: 90%;
  margin: 0 auto;
  padding: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.04), 0 8rpx 24rpx rgba(0,0,0,0.04);
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s;
  &:active {
    transform: translateY(4rpx);
    box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.08);
  }
  margin-bottom: 20rpx;

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
</style> 