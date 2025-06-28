<template>
	<view class="container">
		<!-- 协议内容 -->
		<view class="content">
			<view class="section">
				<view class="section-title">一、总则</view>
				<view class="section-content">
					<text class="paragraph">1.1 本协议是推广商与平台之间关于推广商成为平台推广者，并进行产品或服务推广活动的各项约定。</text>
					<text class="paragraph">1.2 推广商是指通过平台审核，具有相应资质，在平台上进行产品或服务推广的个人或组织。</text>
					<text class="paragraph">1.3 推广商在申请成为平台推广者前，应当仔细阅读本协议，并同意遵守本协议的全部条款。</text>
				</view>
			</view>
			
			<view class="section">
				<view class="section-title">二、推广商权利与义务</view>
				<view class="section-content">
					<text class="paragraph">2.1 推广商有权根据本协议约定获得相应的推广佣金。</text>
					<text class="paragraph">2.2 推广商应当遵守国家法律法规和平台规则，不得从事任何违法违规活动。</text>
					<text class="paragraph">2.3 推广商应当如实提供身份信息和相关资质，不得提供虚假信息。</text>
					<text class="paragraph">2.4 推广商应当维护平台形象，不得发布虚假宣传信息，不得误导消费者。</text>
					<text class="paragraph">2.5 推广商不得以任何方式干扰平台正常运营，不得从事任何损害平台利益的行为。</text>
				</view>
			</view>
			
			<view class="section">
				<view class="section-title">三、佣金规则</view>
				<view class="section-content">
					<text class="paragraph">3.1 推广商通过专属推广链接或推广码带来的有效订单，可获得相应佣金。</text>
					<text class="paragraph">3.2 一级推广佣金比例为订单金额的20%，二级推广佣金比例为订单金额的5%。</text>
					<text class="paragraph">3.3 佣金计算规则：以实际支付金额为基数，不含运费、税费等其他费用。</text>
					<text class="paragraph">3.4 佣金结算周期：每月1日结算上月佣金，佣金将在T+7个工作日内转入推广商绑定的账户。</text>
					<text class="paragraph">3.5 如遇退款、取消订单等情况，相应佣金将被扣除。</text>
				</view>
			</view>
			
			<view class="section">
				<view class="section-title">四、推广规范</view>
				<view class="section-content">
					<text class="paragraph">4.1 推广商不得使用虚假宣传、虚假承诺等方式进行推广。</text>
					<text class="paragraph">4.2 推广商不得以平台官方名义进行推广，应当明确表明推广商身份。</text>
					<text class="paragraph">4.3 推广商不得在未经授权的情况下使用平台商标、logo等知识产权。</text>
					<text class="paragraph">4.4 推广商不得发布含有色情、暴力、赌博、诈骗等违法违规内容。</text>
					<text class="paragraph">4.5 推广商不得通过作弊手段刷单、刷佣金。</text>
				</view>
			</view>
			
			<view class="section">
				<view class="section-title">五、违约责任</view>
				<view class="section-content">
					<text class="paragraph">5.1 如推广商违反本协议约定，平台有权视情节轻重采取警告、暂停结算佣金、降低佣金比例、取消推广资格等措施。</text>
					<text class="paragraph">5.2 如推广商的违约行为给平台造成损失，推广商应当承担赔偿责任。</text>
					<text class="paragraph">5.3 如推广商存在刷单、虚假交易等严重违规行为，平台有权永久取消其推广资格，并追回已结算的佣金。</text>
				</view>
			</view>
			
			<view class="section">
				<view class="section-title">六、协议变更与终止</view>
				<view class="section-content">
					<text class="paragraph">6.1 平台有权根据业务需要修改本协议，修改后的协议将在平台公布。</text>
					<text class="paragraph">6.2 如推广商不同意修改后的协议，应当停止使用推广服务，否则视为接受修改后的协议。</text>
					<text class="paragraph">6.3 推广商可随时申请终止本协议，但需结清所有待结算的佣金。</text>
					<text class="paragraph">6.4 如推广商连续90天无推广活动，平台有权终止本协议。</text>
				</view>
			</view>
			
			<view class="section">
				<view class="section-title">七、其他条款</view>
				<view class="section-content">
					<text class="paragraph">7.1 本协议的解释权归平台所有。</text>
					<text class="paragraph">7.2 本协议适用中华人民共和国法律。</text>
					<text class="paragraph">7.3 因本协议引起的争议，双方应当友好协商解决；协商不成的，任何一方均可向平台所在地有管辖权的人民法院提起诉讼。</text>
					<text class="paragraph">7.4 本协议自推广商通过平台审核成为正式推广商之日起生效。</text>
				</view>
			</view>
		</view>
		
		<!-- 底部按钮 -->
		<view class="footer">
			<button class="agree-btn" @tap="agreeAndBack">同意并返回</button>
		</view>
	</view>
</template>

<script setup>
// 同意并返回
const agreeAndBack = () => {
	uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background-color: #fff;
	padding-bottom: 120rpx;
}

.content {
	padding: 30rpx 40rpx;
	
	.section {
		margin-bottom: 40rpx;
		
		.section-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 20rpx;
		}
		
		.section-content {
			.paragraph {
				font-size: 28rpx;
				color: #666;
				line-height: 1.6;
				margin-bottom: 20rpx;
				display: block;
			}
		}
	}
}

.footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 20rpx 40rpx;
	background: #fff;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	
	.agree-btn {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		background: #2aeee6;
		color: #fff;
		font-size: 32rpx;
		border-radius: 40rpx;
		font-weight: bold;
	}
}
</style>