import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useForumStore = defineStore('forum', () => {
	// state
	const posts = ref([
		{
			id: 1,
			user: {
				id: 101,
				username: '喵星人爱好者',
				avatar: '/static/logo.png'
			},
			time: '10分钟前',
			timestamp: Date.now() - 10 * 60 * 1000,
			category: '养猫经验',
			categoryId: 1,
			title: '新手养猫必看！关于猫咪的日常护理小技巧',
			content: '作为一个养猫新手，最开始也是手忙脚乱。现在和大家分享一下我的经验...',
			images: ['/static/picture/6.jpg', '/static/picture/9.jpg', '/static/picture/7.jpg'],
			likes: 128,
			comments: 32,
			collects: 15,
			isLiked: false,
			isCollected: false
		},
		{
			id: 2,
			user: {
				id: 102,
				username: '汪汪大师',
				avatar: '/static/logo.png'
			},
			time: '30分钟前',
			timestamp: Date.now() - 30 * 60 * 1000,
			category: '养狗经验',
			categoryId: 2,
			title: '狗狗不爱喝水怎么办？这些方法超有效！',
			content: '很多狗主人都会遇到狗狗不爱喝水的问题，今天教大家几个实用的方法...',
			images: ['/static/picture/12.jpg'],
			likes: 256,
			comments: 45,
			collects: 28,
			isLiked: false,
			isCollected: false
		},
		{
			id: 3,
			user: {
				id: 103,
				username: '宠物营养师',
				avatar: '/static/logo.png'
			},
			time: '2小时前',
			timestamp: Date.now() - 2 * 60 * 60 * 1000,
			category: '宠物美食',
			categoryId: 3,
			title: '自制猫粮配方大全，营养美味一次搞定',
			content: '很多铲屎官都担心市面上的猫粮不够营养，今天教大家几个自制猫粮的配方...',
			images: ['/static/picture/13.jpg', '/static/picture/11.jpg'],
			likes: 512,
			comments: 128,
			collects: 89,
			isLiked: false,
			isCollected: false
		}
	]) // 帖子列表
	
	const categories = ref(['全部', '养猫经验', '养狗经验', '宠物美食', '宠物医疗', '宠物用品'])
	const currentCategory = ref(0) // 当前选中的分类索引
	const pagination = reactive({
		page: 1, // 当前页码
		pageSize: 10, // 每页数量
		hasMore: true // 是否还有更多数据
	})
	const postDetails = reactive({}) // 帖子详情缓存，key为帖子ID
	const userInteractions = reactive({
		likes: [], // 用户点赞的帖子ID数组
		collections: [], // 用户收藏的帖子ID数组
		follows: [] // 用户关注的用户ID数组
	})

	// ===== Getters =====

	/**
	 * 根据帖子ID获取帖子详情
	 * @param {string|number} id - 帖子ID
	 * @returns {Object|undefined} 帖子详情对象，不存在则返回undefined
	 */
	const getPostById = (id) => {
		// 先从缓存中查找
		if (postDetails[id]) {
			return postDetails[id]
		}
		
		// 从帖子列表中查找
		const post = posts.value.find(p => p.id === id)
		if (post) {
			// 缓存帖子详情
			postDetails[id] = post
		}
		return post
	}

	/**
	 * 获取当前分类下的帖子列表
	 * @returns {Array} 过滤后的帖子列表
	 */
	const getFilteredPosts = () => {
		if (currentCategory.value === 0) {
			// 全部分类
			return posts.value
		} else {
			// 特定分类
			const categoryName = categories.value[currentCategory.value]
			return posts.value.filter(post => post.category === categoryName)
		}
	}

	/**
	 * 检查指定帖子是否被当前用户点赞
	 * @param {string|number} postId - 帖子ID
	 * @returns {boolean} 是否已点赞
	 */
	const isPostLiked = (postId) => {
		return userInteractions.likes.includes(postId)
	}

	/**
	 * 检查指定帖子是否被当前用户收藏
	 * @param {string|number} postId - 帖子ID
	 * @returns {boolean} 是否已收藏
	 */
	const isPostCollected = (postId) => {
		return userInteractions.collections.includes(postId)
	}

	/**
	 * 检查指定用户是否被当前用户关注
	 * @param {string|number} userId - 用户ID
	 * @returns {boolean} 是否已关注
	 */
	const isUserFollowed = (userId) => {
		return userInteractions.follows.includes(userId)
	}

	// ===== Actions =====

	/**
	 * 设置帖子列表（会替换原有列表）
	 * @param {Array} newPosts - 新的帖子列表
	 */
	const setPosts = (newPosts) => {
		posts.value = newPosts
	}

	/**
	 * 向帖子列表末尾添加新的帖子
	 * @param {Array} newPosts - 要添加的帖子数组
	 */
	const addPosts = (newPosts) => {
		posts.value.push(...newPosts)
	}

	/**
	 * 添加新帖子
	 * @param {Object} post - 帖子数据
	 */
	const addPost = (post) => {
		// 确保帖子有ID
		if (!post.id) {
			post.id = Date.now() // 使用时间戳作为临时ID
		}
		
		// 确保帖子有时间
		if (!post.time) {
			post.time = '刚刚'
		}
		
		if (!post.timestamp) {
			post.timestamp = Date.now()
		}
		
		// 添加到列表开头
		posts.value.unshift(post)
	}

	/**
	 * 缓存帖子详情数据
	 * @param {string|number} postId - 帖子ID
	 * @param {Object} detail - 帖子详情数据
	 */
	const setPostDetail = (postId, detail) => {
		postDetails[postId] = detail
	}

	/**
	 * 切换分类并重置分页数据
	 * @param {number} categoryIndex - 分类索引
	 */
	const setCategory = (categoryIndex) => {
		currentCategory.value = categoryIndex
		resetPagination()
	}

	/**
	 * 重置分页数据和帖子列表
	 * 通常在切换分类或重新加载数据时调用
	 */
	const resetPagination = () => {
		pagination.page = 1
		pagination.hasMore = true
	}

	/**
	 * 更新分页信息
	 * @param {boolean} hasMore - 是否还有更多数据
	 */
	const updatePagination = (hasMore) => {
		pagination.page++
		pagination.hasMore = hasMore
	}

	/**
	 * 切换帖子的点赞状态
	 * @param {string|number} postId - 帖子ID
	 */
	const toggleLike = (postId) => {
		const post = getPostById(postId)
		if (!post) return
		
		const index = userInteractions.likes.indexOf(postId)
		if (index > -1) {
			// 取消点赞
			userInteractions.likes.splice(index, 1)
			post.isLiked = false
			post.likes = Math.max(0, post.likes - 1)
		} else {
			// 添加点赞
			userInteractions.likes.push(postId)
			post.isLiked = true
			post.likes += 1
		}
		
		// 更新本地存储
		saveInteractions()
	}

	/**
	 * 切换帖子的收藏状态
	 * @param {string|number} postId - 帖子ID
	 */
	const toggleCollection = (postId) => {
		const post = getPostById(postId)
		if (!post) return
		
		const index = userInteractions.collections.indexOf(postId)
		if (index > -1) {
			// 取消收藏
			userInteractions.collections.splice(index, 1)
			post.isCollected = false
			post.collects = Math.max(0, post.collects - 1)
		} else {
			// 添加收藏
			userInteractions.collections.push(postId)
			post.isCollected = true
			post.collects += 1
		}
		
		// 更新本地存储
		saveInteractions()
	}

	/**
	 * 切换用户的关注状态
	 * @param {string|number} userId - 用户ID
	 */
	const toggleFollow = (userId) => {
		const index = userInteractions.follows.indexOf(userId)
		if (index > -1) {
			userInteractions.follows.splice(index, 1)
		} else {
			userInteractions.follows.push(userId)
		}
		// 更新本地存储
		saveInteractions()
	}

	/**
	 * 搜索帖子
	 * @param {string} keyword - 搜索关键词
	 * @returns {Array} 搜索结果
	 */
	const searchPosts = (keyword) => {
		if (!keyword) return []
		
		const lowerKeyword = keyword.toLowerCase()
		return posts.value.filter(post => 
			post.title.toLowerCase().includes(lowerKeyword) || 
			post.content.toLowerCase().includes(lowerKeyword)
		)
	}

	/**
	 * 将用户交互数据保存到本地存储
	 * 包括点赞、收藏、关注等数据
	 */
	const saveInteractions = () => {
		uni.setStorageSync('forum_interactions', userInteractions)
	}

	/**
	 * 从本地存储加载用户交互数据
	 * 在应用启动时调用，恢复用户的交互状态
	 */
	const loadInteractions = () => {
		const interactions = uni.getStorageSync('forum_interactions')
		if (interactions) {
			Object.assign(userInteractions, interactions)
			
			// 更新帖子的点赞和收藏状态
			posts.value.forEach(post => {
				post.isLiked = userInteractions.likes.includes(post.id)
				post.isCollected = userInteractions.collections.includes(post.id)
			})
		}
	}
	
	// 初始化时加载用户交互数据
	loadInteractions()

	return {
		// state
		posts,
		categories,
		currentCategory,
		pagination,
		postDetails,
		userInteractions,

		// getters
		getPostById,
		getFilteredPosts,
		isPostLiked,
		isPostCollected,
		isUserFollowed,

		// actions
		setPosts,
		addPosts,
		addPost,
		setPostDetail,
		setCategory,
		resetPagination,
		updatePagination,
		toggleLike,
		toggleCollection,
		toggleFollow,
		searchPosts,
		saveInteractions,
		loadInteractions
	}
}) 