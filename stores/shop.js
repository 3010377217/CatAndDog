import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

// 商品（货品）相关的状态管理
export const useShopStore = defineStore('shop', () => {
	// ===== state =====
	// 默认商品数据（模拟数据库中的数据）
	const defaultGoods = [
		// 猫咪主粮
		{ id: 1,  categoryId: 1, name: '皇家成猫粮',   description: '1-7岁全价配方',     price: 199, image: '/static/picture/6.jpg', isNew: true,  num: 0, sales: 238 },
		{ id: 2,  categoryId: 1, name: '伟嘉成猫粮',   description: '营养均衡易消化',       price: 159, image: '/static/picture/7.jpg', isNew: false, num: 0, sales: 176 },
		{ id: 3,  categoryId: 1, name: '渴望无谷猫粮', description: '85%高蛋白肉含量',     price: 289, image: '/static/picture/8.jpg', isNew: false, num: 0, sales: 120 },
		{ id: 4,  categoryId: 1, name: '比瑞吉成猫粮', description: '深海鱼油亮泽毛发',     price: 139, image: '/static/picture/9.jpg', isNew: true,  num: 0, sales: 193 },
		{ id: 5,  categoryId: 1, name: '纽顿室内猫粮', description: '低敏配方呵护肠胃',     price: 219, image: '/static/picture/10.jpg', isNew: false, num: 0, sales: 156 },

		// 猫咪零食
		{ id: 6,  categoryId: 2, name: '妙鲜包金枪鱼', description: '鲜嫩多汁 美味加倍',     price: 15,  image: '/static/picture/7.jpg', isNew: true,  num: 0, sales: 487 },
		{ id: 7,  categoryId: 2, name: 'CIAO 吞拿肉泥', description: '日本人气猫条',        price: 25,  image: '/static/picture/6.jpg', isNew: false, num: 0, sales: 382 },
		{ id: 8,  categoryId: 2, name: '小佩冻干鸡肉',  description: '100%鸡胸肉冻干',     price: 49,  image: '/static/picture/9.jpg', isNew: true,  num: 0, sales: 213 },
		{ id: 9,  categoryId: 2, name: '喵鲜生零食罐', description: '纯肉无添加',          price: 18,  image: '/static/picture/11.jpg', isNew: false, num: 0, sales: 345 },
		{ id: 10, categoryId: 2, name: '爽歪歪猫薄荷', description: '天然猫薄荷提神醒脑',   price: 9,   image: '/static/picture/13.jpg', isNew: false, num: 0, sales: 498 },

		// 狗狗主粮
		{ id: 11, categoryId: 3, name: '皇家成犬粮',   description: '中型犬专用',         price: 299, image: '/static/picture/10.jpg', isNew: false, num: 0, sales: 183 },
		{ id: 12, categoryId: 3, name: '伯纳天纯无谷', description: '鲜肉+蔬果配方',       price: 349, image: '/static/picture/11.jpg', isNew: true,  num: 0, sales: 147 },
		{ id: 13, categoryId: 3, name: '冠能幼犬粮',   description: '含初乳保护肠胃',       price: 259, image: '/static/picture/12.jpg', isNew: false, num: 0, sales: 204 },
		{ id: 14, categoryId: 3, name: '爱肯拿鸭肉梨', description: '高蛋白低碳水',       price: 389, image: '/static/picture/13.jpg', isNew: false, num: 0, sales: 98 },
		{ id: 15, categoryId: 3, name: '比瑞吉小型犬', description: '呵护骨骼关节',       price: 189, image: '/static/picture/6.jpg', isNew: true,  num: 0, sales: 267 },

		// 狗狗零食
		{ id: 16, categoryId: 4, name: '洁齿棒',       description: '磨牙洁齿 口气清新',   price: 29,  image: '/static/picture/8.jpg', isNew: false, num: 0, sales: 423 },
		{ id: 17, categoryId: 4, name: '冻干鸡胸肉',   description: '100%鲜肉冻干',       price: 59,  image: '/static/picture/10.jpg', isNew: true,  num: 0, sales: 318 },
		{ id: 18, categoryId: 4, name: '罐头牛肉块',   description: '高蛋白易吸收',         price: 22,  image: '/static/picture/7.jpg', isNew: false, num: 0, sales: 186 },
		{ id: 19, categoryId: 4, name: '奶酪粒',       description: '天然奶酪钙质补充',     price: 35,  image: '/static/picture/9.jpg', isNew: false, num: 0, sales: 243 },
		{ id: 20, categoryId: 4, name: '鸭肉绕钙骨',   description: '低脂美味',             price: 42,  image: '/static/picture/11.jpg', isNew: true,  num: 0, sales: 156 },

		// 营养保健
		{ id: 21, categoryId: 5, name: '鱼油软胶囊',   description: '亮毛护肤',            price: 69,  image: '/static/picture/12.jpg', isNew: false, num: 0, sales: 127 },
		{ id: 22, categoryId: 5, name: '关节膏',       description: '加固关节软骨',        price: 99,  image: '/static/picture/13.jpg', isNew: true,  num: 0, sales: 95 },
		{ id: 23, categoryId: 5, name: '益生菌粉',     description: '调理肠胃',            price: 89,  image: '/static/picture/8.jpg', isNew: false, num: 0, sales: 264 },
		{ id: 24, categoryId: 5, name: '营养膏',       description: '术后恢复补充能量',    price: 75,  image: '/static/picture/7.jpg', isNew: false, num: 0, sales: 178 },
		{ id: 25, categoryId: 5, name: '美毛粉',       description: '靓丽毛发',            price: 55,  image: '/static/picture/6.jpg', isNew: true,  num: 0, sales: 312 },

		// 日用品
		{ id: 26, categoryId: 6, name: '封闭猫砂盆',   description: '防外溅 除味',         price: 89,  image: '/static/picture/10.jpg', isNew: true,  num: 0, sales: 246 },
		{ id: 27, categoryId: 6, name: '自动饮水机',   description: '大容量 循环过滤',     price: 159, image: '/static/picture/11.jpg', isNew: false, num: 0, sales: 173 },
		{ id: 28, categoryId: 6, name: '宠物围栏',     description: '可折叠 安全护栏',     price: 229, image: '/static/picture/12.jpg', isNew: false, num: 0, sales: 58 },
		{ id: 29, categoryId: 6, name: '指甲剪套装',   description: '安全防滑 手柄舒适',   price: 29,  image: '/static/picture/7.jpg', isNew: true,  num: 0, sales: 387 },
		{ id: 30, categoryId: 6, name: '宠物背包',     description: '透气太空舱',          price: 118, image: '/static/picture/13.jpg', isNew: false, num: 0, sales: 142 },

		// 玩具
		{ id: 31, categoryId: 7, name: '逗猫棒三件套', description: '互动必备',            price: 25,  image: '/static/picture/8.jpg', isNew: true,  num: 0, sales: 496 },
		{ id: 32, categoryId: 7, name: '猫抓板',       description: '瓦楞纸耐抓',          price: 39,  image: '/static/picture/9.jpg', isNew: false, num: 0, sales: 357 },
		{ id: 33, categoryId: 7, name: '发声球',       description: '内含铃铛耐咬',        price: 19,  image: '/static/picture/10.jpg', isNew: false, num: 0, sales: 412 },
		{ id: 34, categoryId: 7, name: '狗狗飞盘',     description: '软胶安全材质',        price: 28,  image: '/static/picture/11.jpg', isNew: true,  num: 0, sales: 275 },
		{ id: 35, categoryId: 7, name: '智力漏食球',   description: '磨牙益智两不误',      price: 45,  image: '/static/picture/12.jpg', isNew: false, num: 0, sales: 164 },

		// 清洁用品
		{ id: 36, categoryId: 8, name: '结团猫砂 6L',  description: '低尘除臭强',         price: 48,  image: '/static/picture/13.jpg', isNew: false, num: 0, sales: 328 },
		{ id: 37, categoryId: 8, name: '宠物洗澡香波', description: '天然椰子油配方',      price: 59,  image: '/static/picture/6.jpg', isNew: true,  num: 0, sales: 193 },
		{ id: 38, categoryId: 8, name: '除臭喷雾',     description: '快速分解异味',        price: 35,  image: '/static/picture/10.jpg', isNew: false, num: 0, sales: 274 },
		{ id: 39, categoryId: 8, name: '狗狗尿片',     description: '超强吸水无回渗',      price: 52,  image: '/static/picture/7.jpg', isNew: false, num: 0, sales: 219 },
		{ id: 40, categoryId: 8, name: '牙刷牙膏套装', description: '清新口气护牙龈',      price: 33,  image: '/static/picture/9.jpg', isNew: true,  num: 0, sales: 365 }
	]
	
	// 实际商品列表（可以通过接口更新）
	const goodsList = ref([])
	
	// 分页参数
	const pagination = reactive({
		page: 1,
		pageSize: 10,
		hasMore: true,
		loading: false
	})
	
	// 商品分类
	const categories = ref([
		{ id: 1, name: '猫咪主粮' },
		{ id: 2, name: '猫咪零食' },
		{ id: 3, name: '狗狗主粮' },
		{ id: 4, name: '狗狗零食' },
		{ id: 5, name: '营养保健' },
		{ id: 6, name: '日用品' },
		{ id: 7, name: '玩具' },
		{ id: 8, name: '清洁用品' }
	])
	
	// 当前选中的分类
	const currentCategory = ref(0)
	
	// ===== getters =====
	/**
	 * 根据商品ID获取商品详情
	 * @param {number} id 商品ID
	 * @returns {Object|undefined} 商品详情对象，不存在则返回undefined
	 */
	const getGoodsById = (id) => {
		return goodsList.value.find(item => item.id === id)
	}
	
	/**
	 * 获取当前分类下的商品
	 * @returns {Array} 过滤后的商品列表
	 */
	const getFilteredGoods = () => {
		if (currentCategory.value === 0) {
			// 全部商品
			return goodsList.value
		} else {
			// 特定分类
			return goodsList.value.filter(item => item.categoryId === currentCategory.value)
		}
	}
	
	/**
	 * 获取新品商品
	 * @returns {Array} 新品商品列表
	 */
	const getNewGoods = () => {
		return goodsList.value.filter(item => item.isNew)
	}

	// ===== actions =====
	/**
	 * 设置商品列表（会替换原有列表）
	 * @param {Array} newGoods 新的商品列表
	 */
	const setGoods = (newGoods) => {
		goodsList.value = newGoods
	}
	
	/**
	 * 添加商品到列表
	 * @param {Array} newGoods 要添加的商品数组
	 */
	const addGoods = (newGoods) => {
		goodsList.value.push(...newGoods)
	}
	
	/**
	 * 设置当前分类
	 * @param {number} categoryId 分类ID
	 */
	const setCategory = (categoryId) => {
		currentCategory.value = categoryId
		resetPagination()
	}
	
	/**
	 * 重置分页数据
	 */
	const resetPagination = () => {
		pagination.page = 1
		pagination.hasMore = true
	}
	
	/**
	 * 更新指定商品的购买数量
	 * @param {number} id 商品ID
	 * @param {number} delta 变化量（正数为增加，负数为减少）
	 */
	const updateGoodsNum = (id, delta) => {
		const index = goodsList.value.findIndex(item => item.id === id)
		if (index > -1) {
			const newNum = goodsList.value[index].num + delta
			if (newNum >= 0) {
				goodsList.value[index].num = newNum
			}
		}
	}

	/**
	 * 重置所有商品的购买数量
	 */
	const resetGoodsNum = () => {
		goodsList.value.forEach(item => (item.num = 0))
	}
	
	/**
	 * 模拟从后端获取商品数据
	 * @param {number} page 页码，从1开始
	 * @param {number} pageSize 每页数量，默认为10
	 * @param {number} categoryId 分类ID，可选，不传则获取全部
	 * @returns {Promise} 包含商品数据和分页信息的Promise
	 */
	const fetchGoods = (page = 1, pageSize = 10, categoryId = null) => {
		// 更新分页信息
		pagination.page = page
		pagination.loading = true
		
		// 模拟网络延迟
		return new Promise((resolve) => {
			setTimeout(() => {
				// 根据分类筛选数据
				let filteredData = [...defaultGoods]
				
				if (categoryId !== null && categoryId !== 0) {
					filteredData = filteredData.filter(item => item.categoryId === categoryId)
				}
				
				// 计算分页参数
				const start = (page - 1) * pageSize
				const end = start + pageSize
				const hasMore = end < filteredData.length
				
				// 获取当前页的数据
				const pageData = filteredData.slice(start, end)
				
				// 更新状态
				if (page === 1) {
					// 第一页，替换当前数据
					setGoods(pageData)
				} else {
					// 非第一页，追加数据
					addGoods(pageData)
				}
				
				// 更新分页状态
				pagination.hasMore = hasMore
				pagination.loading = false
				
				// 返回数据和分页信息
				resolve({
					data: pageData,
					pagination: {
						page,
						pageSize,
						hasMore,
						total: filteredData.length
					}
				})
			}, 1000) // 模拟1000ms网络延迟
		})
	}

	return {
		goodsList,
		categories,
		currentCategory,
		pagination,
		getGoodsById,
		getFilteredGoods,
		getNewGoods,
		setGoods,
		addGoods,
		setCategory,
		resetPagination,
		updateGoodsNum,
		resetGoodsNum,
		fetchGoods
	}
}) 