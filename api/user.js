import http from '@/utils/request'

// 用户相关接口
export const userApi = {
	// 调用云函数登录
	login: async (data) => {
		try {
			// 获取微信登录code
			const loginResult = await uni.login();
			if (!loginResult.code) {
				throw new Error('获取微信登录code失败');
			}

			// 调用云函数登录
			const res = await uniCloud.callFunction({
				name: 'user-login',
				data: {
					code: loginResult.code,
					userInfo: data.userInfo
				}
			});
			
			if (res.result.code !== 0) {
				throw new Error(res.result.msg || '登录失败');
			}
			
			// 存储用户信息到本地
			const userData = res.result.data;
			uni.setStorageSync('token', userData.token);
			uni.setStorageSync('userId', userData.userId);
			uni.setStorageSync('userInfo', userData.userInfo);
			
			return {
				token: userData.token,
				userId: userData.userId,
				userInfo: userData.userInfo
			};
		} catch (error) {
			console.error('登录失败:', error);
			throw error;
		}
	},
	
	// 获取用户信息
	getUserInfo: async () => {
		try {
			// 新增：本地校验token和userId
			const token = uni.getStorageSync('token');
			const userId = uni.getStorageSync('userId');
			if (!token || !userId) {
				throw new Error('未登录，缺少token或用户ID');
			}
			const res = await uniCloud.callFunction({
				name: 'user-get',
				data: {}  // 云函数会自动获取当前用户ID
			});
			
			if (res.result.code !== 0) {
				throw new Error(res.result.msg || '获取用户信息失败');
			}
			// 更新本地存储的用户信息
			uni.setStorageSync('userInfo', res.result.data);
			return res.result.data;
		} catch (error) {
			console.error('获取用户信息失败:', error);
			throw error;
		}
	},
	
	// 更新用户信息
	updateUserInfo: async (data) => {
		try {
			// 确保只更新允许的字段
			const updateData = {};
			const allowedFields = ['nickname', 'avatar', 'phone', 'gender'];
			
			allowedFields.forEach(field => {
				if (data[field] !== undefined) {
					updateData[field] = data[field];
				}
			});
			
			const res = await uniCloud.callFunction({
				name: 'user-update',
				data: updateData
			});
			
			if (res.result.code !== 0) {
				throw new Error(res.result.msg || '更新用户信息失败');
			}
			
			// 更新本地存储的用户信息
			const newUserInfo = res.result.data;
			uni.setStorageSync('userInfo', newUserInfo);
			
			return newUserInfo;
		} catch (error) {
			console.error('更新用户信息失败:', error);
			throw error;
		}
	},
	
	// 增加成长值
	addGrowthValue: async (value, reason) => {
		try {
			const res = await uniCloud.callFunction({
				name: 'user-growth',
				data: {
					value,
					reason
				}
			});
			
			if (res.result.code !== 0) {
				throw new Error(res.result.msg || '增加成长值失败');
			}
			
			return res.result.data;
		} catch (error) {
			console.error('增加成长值失败:', error);
			throw error;
		}
	},
	
	// 登出
	logout: async () => {
		try {
			// 清除本地存储的用户信息
			uni.removeStorageSync('userId');
			uni.removeStorageSync('userInfo');
			
			return { success: true };
		} catch (error) {
			console.error('登出失败:', error);
			return { success: false };
		}
	},
	
	// 检查登录状态
	checkLoginStatus: async () => {
		try {
			const userInfo = uni.getStorageSync('userInfo');
			const userId = uni.getStorageSync('userId');
			
			if (!userInfo || !userId) {
				return false;
			}
			
			// 验证用户信息是否有效
			const res = await uniCloud.callFunction({
				name: 'user-get',
				data: {}
			});
			
			return res.result.code === 0;
		} catch (error) {
			console.error('检查登录状态失败:', error);
			return false;
		}
	}
};

export default userApi;