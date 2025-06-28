import { defineStore } from 'pinia'
import { ref } from 'vue'
import userApi from '@/api/user'

export const useUserStore = defineStore('user', () => {
	// state
	const isLogin = ref(false) // 用户登录状态
	const userInfo = ref(null) // 用户信息

	/**
	 * 设置登录状态和用户信息
	 * @param {boolean} status - 登录状态
	 * @param {Object|null} info - 用户信息对象
	 */
	const setLoginState = (status, info = null) => {
		isLogin.value = status
		userInfo.value = info
	}

	/**
	 * 用户登录
	 * @param {Object} wxUserInfo - 微信用户信息
	 * @returns {Promise<boolean>} 登录是否成功
	 * @throws {Error} 登录失败时抛出错误
	 */
	const login = async (wxUserInfo) => {
		try {
			// 调用登录接口
			const loginData = await userApi.login({
				userInfo: wxUserInfo
			})

			if (!loginData || !loginData.token) {
				throw new Error('登录失败，请重试')
			}

			// 保存token和userId
			uni.setStorageSync('token', loginData.token)
			uni.setStorageSync('userId', loginData.userId)

			// 保存并设置用户信息
			const newUserInfo = {
				...wxUserInfo,
				...(loginData?.userInfo || {})
			}
			setLoginState(true, newUserInfo)

			return true
		} catch (error) {
			setLoginState(false, null)
			throw error
		}
	}

	/**
	 * 退出登录
	 * 清除用户数据并重置登录状态
	 */
	const logout = () => {
		// 清除用户数据
		uni.removeStorageSync('token')
		uni.removeStorageSync('userInfo')
		setLoginState(false, null)
	}

	/**
	 * 检查登录状态
	 * 验证token并获取最新的用户信息
	 * @returns {Promise<boolean>} 是否已登录
	 */
	const checkLoginStatus = async () => {
		try {
			const token = uni.getStorageSync('token')
			if (!token) {
				setLoginState(false, null)
				return false
			}

			// 获取用户信息验证登录状态
			const userInfoData = await userApi.getUserInfo()
			setLoginState(true, userInfoData)
			return true
		} catch (error) {
			console.error('检查登录状态失败:', error)
			setLoginState(false, null)
			return false
		}
	}

	return {
		// state
		isLogin,
		userInfo,

		// actions
		setLoginState,
		login,
		logout,
		checkLoginStatus
	}
}) 