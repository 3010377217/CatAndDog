<template>
	<view class="container">
		<text>{{ title }}</text>
	</view>
</template>

<script setup>
import { ref } from 'vue'

// 响应式数据
const title = ref('订单页面')

// 方法
const handleClick = () => {
	console.log('点击事件')
}
</script>

<style>
.container {
	padding: 20px;
}
</style> 