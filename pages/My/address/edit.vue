<template>
  <view class="address-edit-page">
    <view class="form-container">
      <view class="form-item">
        <text class="label">收货人</text>
        <input type="text" v-model="addressInfo.name" placeholder="请输入收货人姓名" placeholder-class="placeholder" />
      </view>
      
      <view class="form-item">
        <text class="label">手机号码</text>
        <input type="number" v-model="addressInfo.phone" maxlength="11" placeholder="请输入手机号码" placeholder-class="placeholder" @blur="validatePhone" />
      </view>
      
      <view class="form-item location-item" @tap="showRegionPopup = true">
        <text class="label">所在地区</text>
        <view class="region-text">
          <text v-if="addressInfo.region">{{ addressInfo.region }}</text>
          <text v-else class="placeholder">请选择所在地区</text>
          <text class="arrow">></text>
        </view>
      </view>
      
      <view class="form-item">
        <text class="label">详细地址</text>
        <textarea 
          v-model="addressInfo.detail" 
          placeholder="请输入详细地址，如街道、门牌号、小区、楼栋号、单元室等" 
          placeholder-class="placeholder"
          :auto-height="true"
          :maxlength="100"
        />
      </view>
      
      <view class="form-item">
        <view class="label-container">
          <text class="label">设为默认地址</text>
        </view>
        <switch 
          :checked="addressInfo.isDefault" 
          @change="handleDefaultChange" 
          color="#2aeee6"
        />
      </view>
    </view>
    
    <view class="btn-section">
      <button class="save-btn" @tap="saveAddress">保存</button>
    </view>

    <!-- 地区选择弹出层 -->
    <up-picker
      v-model:show="showRegionPopup"
      ref="pickerRef"
      :columns="regionColumns"
      keyName="label"
      :defaultIndex="regionIndex"
      @change="onRegionChange"
      @confirm="onRegionConfirm"
    />
  </view>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useAddressStore } from '@/stores/address'

const addressStore = useAddressStore()
const { addAddress, updateAddress, setDefault } = addressStore

// 获取页面参数
const isEdit = ref(false)
const addressId = ref(null)

// 地址信息
const addressInfo = ref({
  id: null,
  name: '',
  phone: '',
  region: '',
  detail: '',
  isDefault: false
})

// 地区选择相关
const showRegionPopup = ref(false)
const cityData = ref([])
const regionColumns = ref([[], [], []])
const regionIndex = ref([0, 0, 0])
const tempRegion = ref('')
const pickerRef = ref(null)

// 页面初始化
onMounted(() => {
  // 1. 首先尝试通过页面对象获取数据
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  
  if (currentPage && currentPage.$scope && currentPage.$scope.eventChannel) {
    const eventChannel = currentPage.$scope.eventChannel;
    eventChannel.on('editAddress', handleEditAddressData);
  }
  
  // 2. 备用方案：监听全局事件
  uni.$on('editAddress', handleEditAddressData);
  
  // 页面卸载时清除事件监听
  onBeforeUnmount(() => {
    uni.$off('editAddress', handleEditAddressData);
  });

  // 测试弹窗
  console.log('页面加载完成，showRegionPopup:', showRegionPopup.value);

  fetchCityData()
  
})

// 处理编辑地址数据
function handleEditAddressData(data) {
  if (data && data.id) {
    isEdit.value = true;
    addressId.value = data.id;
    // 在实际项目中，这里会通过API获取地址信息
    // 这里模拟一下数据
    addressInfo.value = {
      id: data.id,
      name: data.name || '',
      phone: data.phone || '',
      region: data.region || '',
      detail: data.detail || '',
      isDefault: data.isDefault || false
    };
    
    // 如果有地区信息，尝试设置地区选择器的初始值
    if (data.region && cityData.value.length) {
      // 这里需要根据地区字符串查找对应的索引
      // 示例实现，实际需要根据数据结构调整
      const regions = data.region.split(' ');
      if (regions.length === 3) {
        // 查找省份索引
        const provinceIndex = cityData.value.findIndex(item => item.label === regions[0]);
        if (provinceIndex !== -1) {
          regionIndex.value[0] = provinceIndex;
          
          // 更新市级数据
          regionColumns.value[1] = cityData.value[provinceIndex].children || [];
          
          // 查找城市索引
          const cityIndex = cityData.value[provinceIndex].children.findIndex(item => item.label === regions[1]);
          if (cityIndex !== -1) {
            regionIndex.value[1] = cityIndex;
            
            // 更新区级数据
            regionColumns.value[2] = cityData.value[provinceIndex].children[cityIndex].children || [];
            
            // 查找区县索引
            const districtIndex = cityData.value[provinceIndex].children[cityIndex].children.findIndex(
              item => item.label === regions[2]
            );
            if (districtIndex !== -1) {
              regionIndex.value[2] = districtIndex;
            }
          }
        }
      }
    }
  }
}

// 获取城市数据API
async function fetchCityData() {
  const res = await uni.request({
    url: 'https://restapi.amap.com/v3/config/district',
    method: 'GET',
    data: {
      key: 'c5ea5ba0e811fc365799e3f9bfa756f0',
      subdistrict: 3,
      extensions: 'all',
      level: 'country'
    }
  })
  console.log('高德API完整返回：', JSON.stringify(res.data))

  // ------- 解析省份 -------
  let provincesRaw = []
  const list = res.data?.districts || []
  if (list.length === 0) {
    console.error('districts 为空')
  } else {
    // 尝试找到 name 为 "中华人民共和国" 且带下级的对象
    const chinaNode = list.find(i => (i.name === '中华人民共和国' || i.name === '中国') && Array.isArray(i.districts) && i.districts.length)
    if (chinaNode) {
      provincesRaw = chinaNode.districts
    } else if (Array.isArray(list[0].districts) && list[0].districts.length) {
      // fallback: 取第0项的下级
      provincesRaw = list[0].districts
    }
  }

  if (!provincesRaw.length) {
    uni.showToast({ title: '省市区数据为空', icon: 'none' })
    return
  }

  const provinces = provincesRaw.map(province => ({
    label: province.name,
    value: province.adcode,
    children: (province.districts || []).map(city => ({
      label: city.name,
      value: city.adcode,
      children: (city.districts || []).map(area => ({
        label: area.name,
        value: area.adcode
      }))
    }))
  }))

  cityData.value = provinces
  regionColumns.value = [
    provinces,
    provinces[0]?.children || [],
    provinces[0]?.children?.[0]?.children || []
  ]

  console.log('解析得到省份数量:', provinces.length)
  console.log('regionColumns =', JSON.stringify(regionColumns.value))
}

// 显示地区选择器
function showRegionPicker() {
  console.log('点击了所在地区');
  showRegionPopup.value = true;
  console.log('showRegionPopup设置为:', showRegionPopup.value);
}

// 测试弹窗
function testPopup() {
  console.log('测试弹窗按钮被点击');
  showRegionPopup.value = true;
  console.log('showRegionPopup设置为:', showRegionPopup.value);
}

// 关闭地区选择器
function closeRegionPopup() {
  showRegionPopup.value = false;
}

// 地区选择变化事件
function onRegionChange(e) {
  const { columnIndex, index } = e
  if (columnIndex === 0) {
    // 更新第二列
    const cities = cityData.value[index].children || []
    const areas = cities[0]?.children || []
    regionColumns.value[1] = cities
    regionColumns.value[2] = areas
    // 让 picker 刷新列
    pickerRef.value && pickerRef.value.setColumnValues(1, cities)
    pickerRef.value && pickerRef.value.setColumnValues(2, areas)
    regionIndex.value = [index, 0, 0]
  } else if (columnIndex === 1) {
    const p = regionIndex.value[0]
    const areas = cityData.value[p].children[index].children || []
    regionColumns.value[2] = areas
    pickerRef.value && pickerRef.value.setColumnValues(2, areas)
    regionIndex.value[1] = index
    regionIndex.value[2] = 0
  } else if (columnIndex === 2) {
    regionIndex.value[2] = index
  }
  // 生成预览文本
  const p = regionIndex.value[0]
  const c = regionIndex.value[1]
  const d = regionIndex.value[2]
  const province = cityData.value[p]
  const city = province?.children?.[c]
  const district = city?.children?.[d]
  if (province && city && district) {
    tempRegion.value = `${province.label} ${city.label} ${district.label}`
  }
}

// 确认地区选择
function onRegionConfirm() {
  addressInfo.value.region = tempRegion.value
  showRegionPopup.value = false
}

// 处理默认地址开关变化
function handleDefaultChange(e) {
  addressInfo.value.isDefault = e.detail.value
}

// 保存地址
function saveAddress() {
  // 表单验证
  if (!addressInfo.value.name) {
    return uni.showToast({ title: '请输入收货人姓名', icon: 'none' })
  }
  if (!addressInfo.value.phone) {
    return uni.showToast({ title: '请输入手机号码', icon: 'none' })
  }
  if (!/^1\d{10}$/.test(addressInfo.value.phone)) {
    return uni.showToast({ title: '手机号码格式不正确', icon: 'none' })
  }
  if (!addressInfo.value.region) {
    return uni.showToast({ title: '请选择所在地区', icon: 'none' })
  }
  if (!addressInfo.value.detail) {
    return uni.showToast({ title: '请输入详细地址', icon: 'none' })
  }
  // 调用 Pinia 的 addAddress 或 updateAddress 方法
  let realId
  if (isEdit.value) {
    updateAddress({ ...addressInfo.value })
    realId = addressInfo.value.id
  } else {
    // addAddress 返回新生成的 id
    realId = addAddress({ ...addressInfo.value })
    addressInfo.value.id = realId
  }

  // 如果勾选默认地址，将当前 id 设为默认
  if (addressInfo.value.isDefault) {
    setDefault(realId)
  }

  // ===== 新增：保存后通过全局事件同步包含 detail 字段的地址数据 =====
  uni.$emit('refreshAddressList', {
    type: isEdit.value ? 'edit' : 'add',
    data: { ...addressInfo.value }
  })
  // ===== End 新增 =====

  uni.showToast({
    title: isEdit.value ? '修改成功' : '添加成功',
    icon: 'success',
    success: () => {
      setTimeout(() => {
        uni.navigateBack({ delta: 1 })
      }, 400)
    }
  })
}

// 确认删除
function confirmDelete() {
  uni.showModal({
    title: '提示',
    content: '确定要删除该地址吗？',
    cancelText: '取消',
    confirmText: '删除',
    cancelColor: '#999999',
    confirmColor: '#FF3B30',
    success: (res) => {
      if (res.confirm) {
        // 在实际项目中，这里需要调用API删除地址
        uni.showLoading({ title: '删除中...' })
        
        setTimeout(() => {
          uni.hideLoading()
          uni.showToast({ 
            title: '删除成功', 
            icon: 'success',
            success: () => {
              // 通知地址列表页面删除该地址
              uni.$emit('refreshAddressList', {
                type: 'delete',
                id: addressId.value
              });
              
              // 返回上一页
              setTimeout(() => {
                uni.navigateBack({ delta: 1 });
              }, 500);
            }
          })
        }, 1000)
      }
    }
  })
}

function validatePhone() {
  const phone = addressInfo.value.phone.trim()
  if (!phone) return
  if (!/^1\d{10}$/.test(phone)) {
    uni.showToast({ title: '手机号码格式不正确', icon: 'none' })
  }
}
</script>

<style lang="scss" scoped>
.address-edit-page {
  min-height: 100vh;
  background: #f6f6f6;
  padding-bottom: 120rpx;
}

.form-container {
  background: #fff;
  padding: 0 30rpx;
  margin-top: 20rpx;
  border-radius: 16rpx;
}

.form-item {
  display: flex;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #eee;
  align-items: center;
  position: relative;
  
  &:last-child {
    border-bottom: none;
  }
  
  .label {
    width: 180rpx;
    font-size: 28rpx;
    color: #333;
  }
  
  input, textarea, .region-text {
    flex: 1;
    font-size: 28rpx;
    color: #333;
  }
  
  textarea {
    height: 80rpx;
    min-height: 80rpx;
    padding: 10rpx 0;
  }
  
  .placeholder {
    color: #ccc;
  }
  
  &.location-item {
    .arrow {
      color: #ccc;
      margin-left: 10rpx;
      font-family: 'Arial';
      transform: rotate(90deg);
      display: inline-block;
    }
  }
  
  .label-container {
    flex: 1;
  }
}

.btn-section {
  padding: 60rpx 40rpx;
  
  .save-btn, .delete-btn {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    font-size: 30rpx;
    color: #fff;
    border-radius: 40rpx;
    margin-bottom: 30rpx;
    border: none;
  }
  
  .save-btn {
    background: linear-gradient(90deg, #2aeee6 0%, #2ad3ee 100%);
  }
  
  .delete-btn {
    background: #fff;
    color: #ff3b30;
    border: 1rpx solid #ff3b30;
  }
}

// 地区选择弹出层样式
.region-popup-container {
  padding-bottom: 20rpx;
}

.region-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #eee;
  
  .title {
    font-size: 30rpx;
    font-weight: 500;
    color: #333;
  }
  
  .cancel-btn, .confirm-btn {
    font-size: 28rpx;
    padding: 10rpx;
  }
  
  .cancel-btn {
    color: #999;
  }
  
  .confirm-btn {
    color: #2ad3ee;
  }
}
</style> 