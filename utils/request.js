// 基础配置
const baseConfig = {
	baseURL: 'http://your-api-domain.com/api', // 替换为实际的API地址
	timeout: 10000,
	header: {
		'Content-Type': 'application/json'
	}
}

// 请求拦截器
const requestInterceptor = (config) => {
	// 获取token
	const token = uni.getStorageSync('token')
	if (token) {
		config.header['Authorization'] = `Bearer ${token}`
	}
	return config
}

// 响应拦截器
const responseInterceptor = (response) => {
	const { statusCode, data } = response
	
	// 请求成功
	if (statusCode === 200) {
		// 假设后端返回格式为 { code: 0, data: {}, message: '' }
		if (data.code === 0) {
			return data.data
		} else {
			// 业务错误
			const error = new Error(data.message || '业务处理失败')
			error.code = data.code
			throw error
		}
	}
	
	// 处理特定状态码
	if (statusCode === 401) {
		// token过期或未登录
		uni.removeStorageSync('token')
		uni.showToast({
			title: '请重新登录',
			icon: 'none'
		})
		// 可以在这里跳转到登录页
		setTimeout(() => {
			uni.navigateTo({
				url: '/pages/login/login'
			})
		}, 1500)
		throw new Error('未登录或登录已过期')
	}
	
	// 其他错误
	throw new Error(`网络请求失败：${statusCode}`)
}

// 请求函数
const request = (options) => {
	const config = {
		...baseConfig,
		...options,
		header: {
			...baseConfig.header,
			...options.header
		}
	}
	
	// 应用请求拦截器
	const finalConfig = requestInterceptor(config)
	
	// 返回Promise
	return new Promise((resolve, reject) => {
		uni.request({
			...finalConfig,
			success: (response) => {
				try {
					const result = responseInterceptor(response)
					resolve(result)
				} catch (error) {
					reject(error)
				}
			},
			fail: (error) => {
				reject(new Error('网络请求失败'))
			}
		})
	})
}

// 导出请求方法
export const http = {
	get: (url, params = {}) => {
		return request({
			url,
			method: 'GET',
			data: params
		})
	},
	
	post: (url, data = {}) => {
		return request({
			url,
			method: 'POST',
			data
		})
	},
	
	put: (url, data = {}) => {
		return request({
			url,
			method: 'PUT',
			data
		})
	},
	
	delete: (url, data = {}) => {
		return request({
			url,
			method: 'DELETE',
			data
		})
	}
}

export default http 