<template>
  <view class="address-manage-page">
    <!-- 批量删除模式顶部操作栏 -->
    <view class="batch-header" :class="{ 'show': isBatchDelete }">
      <view class="cancel-btn" @tap="toggleBatchDelete">取消</view>
      <view class="select-all-btn" @tap="toggleSelectAll">{{ isAllSelected ? '取消全选' : '全选' }}</view>
    </view>
    
    <view class="address-list" :class="{ 'batch-mode': isBatchDelete }">
      <view
        class="address-item"
        v-for="(item, idx) in addressList"
        :key="item.id"
        :class="{ 'batch-mode': isBatchDelete, 'selected': item.checked }"
        @tap="isBatchDelete && toggleSelect(item.id)"
      >
        <!-- 选择圈 -->
        <view 
          class="select-circle" 
          v-if="isBatchDelete" 
          :class="{ 'selected': item.checked }"
          @tap.stop="toggleSelect(item.id)"
        ></view>
        
        <view class="address-header">
          <view>
            <text class="name">{{ item.name }}</text>
            <text class="phone">{{ item.phone }}</text>
          </view>
          <view class="delete-icon" @tap.stop="confirmDelete(item.id)" v-if="!isBatchDelete">
            <image src="/static/icons/Delete.png" mode="aspectFit"></image>
          </view>
        </view>
        <view class="address-detail">
          {{ item.region }}{{ item.detail }}
        </view>
        <view class="address-footer">
          <label class="default-radio">
            <radio
              :checked="item.isDefault"
              color="#2aeee6"
              @tap="setDefault(item.id)"
            />
            <text>默认</text>
          </label>
          <view class="btn-group">
            <button class="copy-btn" @tap="copyAddress(item.id)">复制</button>
            <button class="edit-btn" @tap="editAddress(item.id)">修改</button>
          </view>
        </view>
      </view>
      <view v-if="addressList.length === 0" class="empty-tip">
        暂无地址，请点击下方按钮添加
      </view>
    </view>
    <view class="add-btn-section">
      <button 
        class="delete-batch-btn" 
        @tap="isBatchDelete ? confirmDeleteBatch() : toggleBatchDelete()"
      >
        <text>{{ isBatchDelete ? '删除选中' : '批量删除' }}</text>
      </button>
      <button class="add-btn" @tap="addAddress" v-if="!isBatchDelete">
        <text class="add-icon">＋</text> 添加新地址
      </button>
      <button class="cancel-btn" @tap="toggleBatchDelete" v-else>
        <text>取消</text>
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAddressStore } from '@/stores/address'
import { storeToRefs } from 'pinia'

const addressStore = useAddressStore()
const { addresses: addressList } = storeToRefs(addressStore)

// 是否处于批量删除状态
const isBatchDelete = ref(false)

// 计算是否全选
const isAllSelected = computed(() => {
  return addressList.value.length > 0 && addressList.value.every(item => item.checked)
})

// 切换批量删除状态
function toggleBatchDelete() {
  isBatchDelete.value = !isBatchDelete.value
  if (!isBatchDelete.value) {
    // 退出批量删除状态时，清空选中
    addressList.value.forEach(item => {
      item.checked = false
    })
  }
}

// 切换选中状态
function toggleSelect(id) {
  const item = addressList.value.find(item => item.id === id)
  if (item) {
    item.checked = !item.checked
  }
}

// 切换全选状态
function toggleSelectAll() {
  const newStatus = !isAllSelected.value
  addressList.value.forEach(item => {
    item.checked = newStatus
  })
}

// 确认批量删除
function confirmDeleteBatch() {
  uni.showModal({
    title: '提示',
    content: '确定要删除选中的地址吗？',
    success: (res) => {
      if (res.confirm) {
        // 执行删除
        addressList.value = addressList.value.filter(item => !item.checked)
        // 删除后退出批量删除模式
        isBatchDelete.value = false
        
        uni.showToast({
          title: '删除成功',
          icon: 'success'
        })
      }
    }
  })
}

// 设置默认地址方法
function setDefault(id) {
  // 调用 Pinia action 统一处理
  addressStore.setDefault(id)
  uni.showToast({ title: '已设为默认地址', icon: 'none' })
}

// 确认删除单个地址
function confirmDelete(id) {
  uni.showModal({
    title: '提示',
    content: '确定要删除该地址吗？',
    cancelText: '取消',
    confirmText: '删除',
    cancelColor: '#999999',
    confirmColor: '#FF3B30',
    success: (res) => {
      if (res.confirm) {
        deleteAddress(id);
      }
    }
  });
}

// 删除单个地址
function deleteAddress(id) {
  // 查找要删除的地址
  const deletedAddress = addressList.value.find(item => item.id === id);
  const isDefault = deletedAddress && deletedAddress.isDefault;
  
  // 从地址列表中移除该地址
  addressList.value = addressList.value.filter(item => item.id !== id);
  
  // 如果删除的是默认地址，且删除后还有其他地址
  if (isDefault && addressList.value.length > 0) {
    // 将第一个地址设为默认地址
    addressList.value[0].isDefault = true;
    
    // 显示提示
    uni.showToast({
      title: '已自动设置新的默认地址',
      icon: 'none',
      duration: 2000
    });
  } else {
    // 提示用户删除成功
    uni.showToast({
      title: '删除成功',
      icon: 'success'
    });
  }
}

// 编辑地址
function editAddress(id) {
  const item = addressList.value.find(item => item.id === id);
  if (!item) return;
  
  // 跳转到编辑页面，并通过全局事件传递数据
  uni.navigateTo({
    url: '/pages/My/address/edit',
    success: function(res) {
      // 如果获取到了页面对象
      if (res.eventChannel) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('editAddress', item);
      } else {
        // 备用方案：通过全局状态传递
        uni.$emit('editAddress', item);
      }
    }
  });
}

// 添加地址
function addAddress() {
  uni.navigateTo({
    url: '/pages/My/address/edit'
  });
}

// 复制地址
function copyAddress(id) {
  const item = addressList.value.find(item => item.id === id);
  if (!item) return;
  
  const fullAddress = `${item.name} ${item.phone} ${item.region}${item.detail}`;
  
  uni.setClipboardData({
    data: fullAddress,
    success: () => {
      uni.showToast({
        title: '地址已复制',
        icon: 'success'
      });
    }
  });
}

// 页面初始化时，设置事件监听
onMounted(() => {
  // 获取当前页面实例
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  
  // 监听地址列表刷新事件
  uni.$on('refreshAddressList', handleRefreshAddressList);
  
  // 页面卸载时移除监听
  onBeforeUnmount(() => {
    uni.$off('refreshAddressList', handleRefreshAddressList);
  });
});

// 处理地址列表刷新事件
function handleRefreshAddressList(data) {
  if (data.type === 'edit') {
    // 更新地址列表中的地址
    const index = addressList.value.findIndex(item => item.id === data.data.id);
    if (index !== -1) {
      addressList.value[index] = data.data;
    }
    
    // 如果设置了默认地址，需要更新其他地址的默认状态
    if (data.data.isDefault) {
      addressList.value.forEach(item => {
        if (item.id !== data.data.id) {
          item.isDefault = false;
        }
      });
    }
  } else if (data.type === 'add') {
    // 生成新的ID
    const newId = addressList.value.length > 0 
      ? Math.max(...addressList.value.map(item => item.id)) + 1 
      : 1;
    
    // 添加新地址到列表
    const newAddress = {
      ...data.data,
      id: newId
    };
    
    addressList.value.push(newAddress);
    
    // 如果设置了默认地址，需要更新其他地址的默认状态
    if (newAddress.isDefault) {
      addressList.value.forEach(item => {
        if (item.id !== newAddress.id) {
          item.isDefault = false;
        }
      });
    }
  } else if (data.type === 'delete') {
    // 删除地址
    deleteAddress(data.id);
  }
}
</script>

<style lang="scss" scoped>
.address-manage-page {
  min-height: 100vh;
  background: #f6f6f6;
  padding-bottom: 120rpx;
  padding-top: 10rpx;
  position: relative;
}

// 批量删除模式的顶部操作栏
.batch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
  
  /* 添加动画效果 */
  opacity: 0;
  transform: translateY(-100%);
  transition: opacity 0.5s ease, transform 0.5s ease;
  height: 0;
  overflow: hidden;
  padding: 0 30rpx;
  
  &.show {
    opacity: 1;
    transform: translateY(0);
    height: auto;
    padding: 20rpx 30rpx;
  }
  
  .cancel-btn, .select-all-btn {
    font-size: 28rpx;
    padding: 10rpx;
  }
  
  .cancel-btn {
    color: #666;
  }
  
  .select-all-btn {
    color: #2aeee6;
  }
}

.address-list {
  padding: 24rpx 20rpx 0 20rpx;
  transition: padding-left 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  &.batch-mode {
    padding-left: 100rpx;
    align-items: flex-end;
  }
}

.address-item {
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
  margin-bottom: 24rpx;
  padding: 24rpx 24rpx 18rpx 24rpx;
  position: relative;
  border: 1rpx solid #f0f0f0;
  transform: translateZ(0);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  width: 90%;
  max-width: 650rpx;
  
  &.batch-mode {
    width: 95%;
    margin-left: 0;
    margin-right: 0;
    transform: translateX(10rpx) scale(0.97);
    box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08);
    
    // 批量删除模式下鼠标悬停效果
    &:active {
      background-color: #f9f9f9;
    }
    
    // 批量删除模式下选中效果
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
  z-index: 2;
  
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

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .name {
    font-size: 30rpx;
    color: #222;
    font-weight: 500;
    margin-right: 16rpx;
  }
  .phone {
    font-size: 28rpx;
    color: #222;
  }
}

.delete-icon {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 40rpx;
  height: 40rpx;
  z-index: 10;
  
  image {
    width: 100%;
    height: 100%;
  }
}

.address-detail {
  font-size: 26rpx;
  color: #444;
  margin: 12rpx 0 0 0;
  word-break: break-all;
}

.address-footer {
  display: flex;
  align-items: center;
  margin-top: 18rpx;
  .default-radio {
    display: flex;
    align-items: center;
    color: #888;
    font-size: 26rpx;
    margin-right: 30rpx;
    radio {
      transform: scale(0.8);
      margin-right: 8rpx;
      
    }
  }
  .btn-group {
    margin-left: auto;
    display: flex;
    gap: 16rpx;
    button {
      font-size: 26rpx;
      border-radius: 8rpx;
      padding: 0 28rpx;
      height: 48rpx;
      line-height: 48rpx;
      border: 1rpx solid #e0e0e0;
      background: #f5f5f5;
      color: #666;
      &.copy-btn {
        color: #888;
        border-color: #e0e0e0;
        background: #f5f5f5;
      }
      &.edit-btn {
        color: #fff;
        background: linear-gradient(90deg, #2aeee6 0%, #2ad3ee 100%);
        border: none;
      }
    }
  }
}

.empty-tip {
  text-align: center;
  color: #bbb;
  font-size: 28rpx;
  margin: 60rpx 0 0 0;
}

.add-btn-section {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  box-shadow: 0 -4rpx 12rpx rgba(0,0,0,0.06);
  padding: 24rpx 30rpx;
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
  
  .delete-batch-btn {
    width: 45%;
    background: linear-gradient(90deg, #ff6b6b 0%, #e53935 100%);
    color: #fff;
    font-size: 28rpx;
    font-weight: bold;
    border-radius: 40rpx;
    padding: 0;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    border: none;
    
    &:active {
      opacity: 0.9;
    }
  }
  
  .add-btn, .cancel-btn {
    width: 45%;
    font-size: 28rpx;
    font-weight: bold;
    border-radius: 40rpx;
    padding: 0;
    height: 80rpx;
    line-height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
  }
  
  .add-btn {
    background: linear-gradient(90deg, #2aeee6 0%, #2ad3ee 100%);
    color: #fff;
    
    .add-icon {
      font-size: 36rpx;
      margin-right: 10rpx;
    }
  }
  
  .cancel-btn {
    background: #f5f5f5;
    color: #666;
    border: 1rpx solid #e0e0e0;
  }
}
</style> 