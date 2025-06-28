<template>
	<view class="container">
		<!-- 收货地址 -->
		<view class="address-card" @tap="chooseAddress">
			<view v-if="currentAddress">
				<view class="addr-text">
					<view class="name">{{ currentAddress.name }} {{ currentAddress.phone }}</view>
					<view class="detail">{{ currentAddress.region }}</view>
					<view class="detail">{{ currentAddress.detail }}</view>
				</view>
				<view class="addr-arrow">
				<u-icon name="arrow-right" size="32" color="#999"></u-icon>
				</view>
			</view>
			<view v-else class="no-address">
				<text>请选择收货地址</text>
				<u-icon name="arrow-right" size="32" color="#999"></u-icon>
			</view>
		</view>

		<!-- 购物车商品列表 -->
		<view class="goods-list">
			<view class="goods-item" v-for="item in cartGoods" :key="item.id">
				<image :src="item.image" class="goods-image" mode="aspectFill" />
				<view class="goods-info">
					<text class="goods-name">{{ item.name }}</text>
					<text class="goods-spec">默认规格</text>
				</view>
				<view class="goods-ops">
					<text class="goods-price">¥{{ item.price }}</text>
					<view class="qty-box">
						<text class="qty-btn" @tap.stop="changeQty(item,-1)">-</text>
						<input class="qty-input" type="number" v-model.number="item.num" @blur="editQty(item)" />
						<text class="qty-btn" @tap.stop="changeQty(item,1)">+</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 支付方式 -->
		<view class="pay-section">
			<view class="section-title">支付方式</view>
			<view class="pay-item" @tap="payMethod='wechat'">
				<u-icon name="weixin-fill" size="48" color="#07c160"></u-icon>
				<text class="pay-text">微信支付</text>
				<u-icon name="checkbox-mark" size="40" color="#f01616" v-if="payMethod==='wechat'"></u-icon>
			</view>
		</view>

		<!-- 底部栏 -->
		<view class="footer">
			<text class="total-price">合计：¥{{ totalAmount }}</text>
			<button class="pay-btn" @tap="handlePay">立即支付</button>
		</view>
	</view>

	<!-- 地址选择弹窗 -->
	<u-popup v-model:show="addrPopupVisible" mode="center" round="14" safe-area-inset-bottom>
		<view class="address-popup">
			<view class="popup-title">选择收货地址</view>
			<!-- 地址列表：最多显示 3 条，高度超出可滚动 -->
			<view class="addr-list">
				<u-radio-group v-model="selectedAddrIndex">
					<view class="addr-row" v-for="(addr,idx) in addresses" :key="addr.id" @tap="selectAddr(idx)">
						<u-radio :name="idx" shape="circle" size="32" activeColor="#2aeee6"></u-radio>
						<view class="addr-info">
							<text class="addr-name">{{ addr.name }} {{ addr.phone }}</text>
							<text class="addr-region">{{ addr.region }}</text>
							<text class="addr-detail">{{ addr.detail }}</text>
						</view>
					</view>
				</u-radio-group>
			</view>
			<view class="popup-actions">
				<button class="add-addr-btn" @tap="goAddAddress">+ 添加新地址</button>
				<button class="popup-confirm" @tap="confirmAddress">确认</button>
			</view>
		</view>
	</u-popup>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useShopStore } from '@/stores/shop'
import { useAddressStore } from '@/stores/address'
import { storeToRefs } from 'pinia'

// 收货地址（后续可接入地址选择页）
const shopStore = useShopStore()
const { goodsList } = storeToRefs(shopStore)
const cartGoods = computed(() => goodsList.value.filter(g => g.num > 0))
const totalAmount = computed(() => cartGoods.value.reduce((sum, g) => sum + g.price * g.num, 0))

// 支付方式
const payMethod = ref('wechat')

// 地址选择逻辑 -- 数据全部来自 Pinia addressStore
const addressStore = useAddressStore()
const { addresses } = storeToRefs(addressStore)

const selectedAddrIndex = ref(0)
const currentAddress = computed(() => addresses.value[selectedAddrIndex.value] || null)
const addrPopupVisible = ref(false)

// 初始化默认地址索引（本地缓存优先，其次按 isDefault 标记）
onMounted(() => {
	const defIdx = uni.getStorageSync('defaultAddrIndex')
	if (typeof defIdx === 'number' && addresses.value[defIdx]) {
		selectedAddrIndex.value = defIdx
	} else {
		const defaultIndex = addresses.value.findIndex(a => a.isDefault)
		if (defaultIndex > -1) selectedAddrIndex.value = defaultIndex
	}

	uni.$on('refreshAddressList', handleRefreshAddress)
})

onBeforeUnmount(() => {
	uni.$off('refreshAddressList', handleRefreshAddress)
})

function handleRefreshAddress({ type, data, id }) {
	if (type === 'add' && data) {
		// store 已经插入，只需切换选中项
		const idx = addresses.value.findIndex(a => a.id === data.id)
		if (idx > -1) selectedAddrIndex.value = idx
	} else if (type === 'edit' && data) {
		const idx = addresses.value.findIndex(a => a.id === data.id)
		if (idx > -1) selectedAddrIndex.value = idx
	} else if (type === 'delete' && id) {
		const idx = addresses.value.findIndex(a => a.id === id)
		if (idx > -1 && selectedAddrIndex.value === idx) {
			selectedAddrIndex.value = 0
		}
	}
}

function goAddAddress() {
	uni.navigateTo({ url: '/pages/My/address/edit' })
}

function confirmAddress() {
	addrPopupVisible.value = false
	// 保存选中索引到本地
	uni.setStorage({ key: 'defaultAddrIndex', data: selectedAddrIndex.value })
}

const chooseAddress = () => {
	if (addresses.value.length === 0) {
		goAddAddress()
	} else {
		addrPopupVisible.value = true
	}
}

const handlePay = () => {
	if (!currentAddress.value) {
		uni.showToast({ title: '请先选择收货地址', icon: 'none' })
		return
	}
	if (cartGoods.value.length === 0) {
		uni.showToast({ title: '购物车为空', icon: 'none' })
		return
	}
	// TODO: 调起微信支付
	uni.showToast({ title: '支付功能暂未接入', icon: 'none' })
}

// 根据目标数量与现有数量的差值，调用 store 更新
function adjustGoodsNum(item, newNum) {
	const diff = newNum - item.num
	if (diff !== 0) {
		shopStore.updateGoodsNum(item.id, diff)
	}
}

// 点击 + / - 按钮
function changeQty(item, delta) {
	if (delta === -1 && item.num === 1) {
		// 减到 0 需确认是否删除
		uni.showModal({
			title: '提示',
			content: '是否将该商品从购物车删除？',
			success: res => {
				if (res.confirm) {
					adjustGoodsNum(item, 0) // 设为 0 即视为删除
				}
			}
		})
		return
	}

	const target = item.num + delta
	if (target < 1) return // 理论不会到这，但保险起见
	adjustGoodsNum(item, target)
}

// 选择地址卡片
function selectAddr(i) {
	selectedAddrIndex.value = i
}

// 输入框失焦后处理
function editQty(item) {
	let val = Number(item.num)
	if (!val || val < 0) {
		val = 1 // 负数或空设 1
	}

	if (val === 0) {
		uni.showModal({
			title: '提示',
			content: '是否将该商品从购物车删除？',
			success: res => {
				if (res.confirm) {
					adjustGoodsNum(item, 0)
				} else {
					adjustGoodsNum(item, 1)
				}
			}
		})
	} else {
		adjustGoodsNum(item, val)
	}
}
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background: #f5f5f5;
	display: flex;
	flex-direction: column;
}

.address-card {
	background: #fff;
	padding: 40rpx 36rpx; // 更宽敞
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-radius: 16rpx;
	margin: 20rpx 24rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.04);
	position: relative;
}

.addr-arrow {
	position: absolute;
	right: 24rpx;
	top: 50%;
	transform: translateY(-50%);
}

.goods-list {
	background: #fff;
	padding: 0 24rpx 24rpx;
	margin-bottom: 20rpx;
	max-height: 880rpx; /* 5 张商品卡片高度，超出可滚动 */
	overflow-y: auto;
}

.goods-item {
	display: flex;
	margin-top: 24rpx;
	background: #fff;
	border-radius: 16rpx;
	/* 双重阴影营造卡片浮起感 */
	box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.04),
				0 8rpx 24rpx rgba(0,0,0,0.06);
	padding: 20rpx;
	transition: transform .15s ease, box-shadow .15s ease;

	/* 按下时略微缩放并减弱阴影，加强层次互动感 */
	&:active {
		transform: translateY(2rpx);
		box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.08);
	}

	.goods-image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 12rpx;
		margin-right: 24rpx;
	}

	.goods-info {
		flex: 1;
		display: flex;
		flex-direction: column;

		.goods-name {
			font-size: 30rpx;
		}
		.goods-spec {
			margin-top: 6rpx;
		}
	}

	.goods-ops {
		display: flex;
		flex-direction: column; /* 垂直排列：上价格，下数量 */
		justify-content: center; /* 在商品卡片高度内垂直居中 */
		align-items: center;     /* 水平居中对齐 */
		margin-left: auto;
		padding-right: 10rpx;

		.goods-price {
			margin-bottom: 16rpx; /* 与数量区分一些间距 */
		}

		.qty-box {
			display: flex;
			align-items: center;
			border: 1rpx solid #f0f0f0;
			border-radius: 8rpx;
			padding: 4rpx 12rpx;

			.qty-btn {
				width: 40rpx;
				text-align: center;
			}

			.qty-input {
				width: 60rpx;
				text-align: center;
			}
		}
	}
}

.pay-section {
	background: #fff;
	padding: 24rpx 32rpx 30rpx; // 预留底部按钮高度
	border-top: 1rpx solid #f0f0f0;

	.section-title {
		font-size: 28rpx;
		margin-bottom: 20rpx;
		color: #333;
	}

	.pay-item {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
		border-radius: 12rpx;
		background: #f9f9f9;
	}

	.pay-item u-icon:first-child {
		margin-right: 20rpx;
	}

	.pay-text {
		flex: 1;
		font-size: 28rpx;
		margin-left: 20rpx;
	}
}

.footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	padding: 0 30rpx;
	.total-price { margin-right: auto; }
	height: 100rpx;
	background: #fff;
	box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);

	.total-price {
		font-size: 32rpx;
		font-weight: bold;
		color: #f01616;
	}

	.pay-btn {
		width: 220rpx;
		height: 70rpx;
		line-height: 70rpx;
		background: #f01616;
		color: #fff;
		font-size: 28rpx;
		border-radius: 35rpx;
	}
}

.address-popup {
	background:#fff;
	width: 600rpx;
	max-height: 80vh;
	border-radius: 14rpx;
	padding: 30rpx 30rpx 0rpx 30rpx;
	display:flex;
	flex-direction:column;
	.popup-title{
		font-size:32rpx;
		font-weight:bold;
		text-align:center;
		margin-bottom:10rpx;
	}
	/* 地址列表容器，控制最多 3 行高度 */
	.addr-list {
		max-height: 600rpx; /* 约 4 条地址高度，可按需调整 */
		overflow-y: auto;
		margin-bottom: 10rpx;
	}

	.addr-row{
		margin: 0 auto;
		display:flex;
		align-items:center; /* 使单选按钮垂直居中 */
		width: 90%; /* 宽度占满弹窗 */
		background:#ffffff;
		border-radius: 16rpx;
		padding: 24rpx 28rpx; /* 恢复原来的卡片高度 */
		margin-bottom: 24rpx;
		/* 多层阴影带来更强立体感 */
		box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.04),
					0 6rpx 18rpx rgba(0,0,0,0.08);

		.addr-info{
			margin-left:24rpx;
			display:flex;
			flex-direction:column;

			.addr-name{font-size:30rpx;font-weight:600;color:#333;}
			.addr-region{font-size:26rpx;color:#666;margin-top:12rpx;}
			.addr-detail{font-size:26rpx;color:#666;margin-top:6rpx;line-height:1.4;}
		}
	}
	.popup-actions{
		display:flex;
		justify-content:space-between;
		margin-top:10rpx;
		margin-bottom:10rpx;
	}

	.add-addr-btn,
	.popup-confirm{
		flex: 1 1 0;
		height:90rpx;
		font-size:30rpx;
		border-radius:45rpx;
	}

	.add-addr-btn{
		margin-right:20rpx;
		border:1rpx dashed #2aeee6;
		background:#f5fefe;
		color:#2aeee6;
	}

	.popup-confirm{
		background:#2aeee6;
		color:#fff;
	}
}

// 收货地址文字样式
.addr-text {
	.name {
		font-size: 32rpx;
		font-weight: 600;
	}
	.detail {
		font-size: 26rpx;
		margin-top: 8rpx;
		line-height: 1.4;
	}
}
</style> 