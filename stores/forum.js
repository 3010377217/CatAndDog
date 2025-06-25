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
			content: '作为一个养猫新手，最开始也是手忙脚乱。现在和大家分享一下我的经验：\n\n1. 猫咪的日常清洁\n每天要帮猫咪梳理毛发，这不仅能保持毛发整洁，还能增进感情。建议使用专业的猫咪梳子，动作要轻柔。\n\n2. 营养均衡\n选择优质猫粮很重要，要根据猫咪的年龄和身体状况选择合适的粮食。建议定时定量投喂，避免过度肥胖。\n\n3. 活动空间\n准备猫爬架和玩具，让猫咪有充足的活动空间和娱乐设施，保持身心健康。\n\n4. 定期体检\n每年带猫咪去宠物医院做一次全面体检，及时发现健康问题。',
			images: ['/static/picture/6.jpg', '/static/picture/9.jpg', '/static/picture/7.jpg'],
			likes: 128,
			comments: 32,
			collects: 15,
			isLiked: false,
			isCollected: false,
			tags: ['养猫经验', '新手必看', '日常护理']
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
			content: '很多狗主人都会遇到狗狗不爱喝水的问题，今天教大家几个实用的方法：\n\n1. 使用流动水碗\n很多狗狗更喜欢喝流动的水，可以考虑购买宠物饮水机。流动的水更新鲜，也更能引起狗狗的兴趣。\n\n2. 添加少量肉汤\n在狗狗的水碗中加入少量无盐的肉汤，增加水的香味，诱导狗狗多喝水。但注意不要放太多，以免影响正常饮食。\n\n3. 多次提供新鲜水\n每天多次更换水碗中的水，保持水的新鲜度。尤其是夏天，水容易变质。\n\n4. 选择合适的水碗\n有些狗狗不喜欢金属碗发出的声音，可以尝试使用陶瓷或塑料碗。',
			images: ['/static/picture/12.jpg'],
			likes: 256,
			comments: 45,
			collects: 28,
			isLiked: false,
			isCollected: false,
			tags: ['养狗经验', '健康饮水', '狗狗护理']
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
			content: '很多铲屎官都担心市面上的猫粮不够营养，今天教大家几个自制猫粮的配方：\n\n1. 鸡肉蔬菜配方\n材料：\n- 去皮鸡胸肉 200g\n- 胡萝卜 50g\n- 西兰花 50g\n- 鸡蛋 1个\n- 少量猫咪专用营养补充剂\n\n做法：\n1) 将鸡肉煮熟后切碎\n2) 蔬菜煮熟后切碎\n3) 鸡蛋煮熟后切碎\n4) 将所有材料混合，加入营养补充剂\n5) 分成小份冷冻保存\n\n2. 牛肉糙米配方\n材料：\n- 牛肉碎 150g\n- 煮熟的糙米 100g\n- 煮熟的胡萝卜 30g\n- 猫咪专用鱼油 适量\n\n做法：\n1) 牛肉煎至七分熟\n2) 与其他材料混合均匀\n3) 冷却后分装保存\n\n注意：自制猫粮应当作为商业猫粮的补充，不建议完全替代。',
			images: ['/static/picture/13.jpg', '/static/picture/11.jpg'],
			likes: 512,
			comments: 128,
			collects: 89,
			isLiked: false,
			isCollected: false,
			tags: ['猫咪食谱', '自制猫粮', '宠物营养']
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
	
	// 评论数据，key为帖子ID
	const postComments = reactive({
		1: [
			{
				id: 101,
				userId: 201,
				username: '小橘猫',
				avatar: '/static/logo.png',
				content: '感谢分享，对新手很有帮助！',
				time: '5分钟前',
				timestamp: Date.now() - 5 * 60 * 1000,
				likes: 12,
				isLiked: false,
				replies: []
			},
			{
				id: 102,
				userId: 202,
				username: '猫咪爱好者',
				avatar: '/static/logo.png',
				content: '建议补充一下猫砂的选择和使用方法',
				time: '10分钟前',
				timestamp: Date.now() - 10 * 60 * 1000,
				likes: 8,
				isLiked: false,
				replies: [
					{
						id: 1021,
						userId: 101,
						username: '喵星人爱好者',
						avatar: '/static/logo.png',
						content: '好的，我会在下一篇详细讲解',
						time: '8分钟前',
						timestamp: Date.now() - 8 * 60 * 1000,
						likes: 3
					}
				],
				totalReplies: 1
			},
			{
				id: 103,
				userId: 203,
				username: '铲屎官小李',
				avatar: '/static/logo.png',
				content: '我家猫咪特别不喜欢梳毛，有什么好方法吗？',
				time: '15分钟前',
				timestamp: Date.now() - 15 * 60 * 1000,
				likes: 5,
				isLiked: false,
				replies: [
					{
						id: 1031,
						userId: 204,
						username: '猫咪训练师',
						avatar: '/static/logo.png',
						content: '可以尝试在梳毛前先玩一会，等猫咪放松了再开始梳理，动作要轻柔，每次时间不要太长。',
						time: '12分钟前',
						timestamp: Date.now() - 12 * 60 * 1000,
						likes: 7
					}
				],
				totalReplies: 1
			}
		],
		2: [
			{
				id: 201,
				userId: 205,
				username: '狗狗健康专家',
				avatar: '/static/logo.png',
				content: '补充一点，可以在狗狗的食物中添加一些含水量高的食材，比如西瓜、黄瓜等，增加水分摄入。',
				time: '20分钟前',
				timestamp: Date.now() - 20 * 60 * 1000,
				likes: 15,
				isLiked: false,
				replies: []
			},
			{
				id: 202,
				userId: 206,
				username: '金毛麻麻',
				avatar: '/static/logo.png',
				content: '我家狗狗就是不爱喝水，试了流动水碗效果很好，推荐！',
				time: '25分钟前',
				timestamp: Date.now() - 25 * 60 * 1000,
				likes: 10,
				isLiked: false,
				replies: []
			}
		],
		3: [
			{
				id: 301,
				userId: 207,
				username: '猫粮DIY达人',
				avatar: '/static/logo.png',
				content: '我一直在给猫咪做自制猫粮，效果很好，毛发亮丽，精神状态也好。',
				time: '1小时前',
				timestamp: Date.now() - 60 * 60 * 1000,
				likes: 20,
				isLiked: false,
				replies: []
			},
			{
				id: 302,
				userId: 208,
				username: '营养学研究生',
				avatar: '/static/logo.png',
				content: '自制猫粮一定要注意营养均衡，特别是猫咪必需的牛磺酸等营养素，建议添加专业的猫咪营养补充剂。',
				time: '1.5小时前',
				timestamp: Date.now() - 90 * 60 * 1000,
				likes: 18,
				isLiked: false,
				replies: [
					{
						id: 3021,
						userId: 103,
						username: '宠物营养师',
						avatar: '/static/logo.png',
						content: '非常同意，自制猫粮最好作为商业猫粮的补充，不要完全替代。',
						time: '1小时前',
						timestamp: Date.now() - 60 * 60 * 1000,
						likes: 12
					}
				],
				totalReplies: 1
			}
		]
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

	/**
	 * 获取帖子评论
	 * @param {string|number} postId - 帖子ID
	 * @returns {Array} 评论数组
	 */
	const getCommentsByPostId = (postId) => {
		return postComments[postId] || []
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

	/**
	 * 添加评论
	 * @param {string|number} postId - 帖子ID
	 * @param {Object} comment - 评论数据
	 */
	const addComment = (postId, comment) => {
		// 确保评论有ID
		if (!comment.id) {
			comment.id = Date.now()
		}
		
		// 确保评论有时间
		if (!comment.time) {
			comment.time = '刚刚'
		}
		
		if (!comment.timestamp) {
			comment.timestamp = Date.now()
		}
		
		// 初始化评论数组（如果不存在）
		if (!postComments[postId]) {
			postComments[postId] = []
		}
		
		// 添加到评论列表开头
		postComments[postId].unshift(comment)
		
		// 更新帖子评论数
		const post = getPostById(postId)
		if (post) {
			post.comments++
		}
	}
	
	/**
	 * 添加回复
	 * @param {string|number} postId - 帖子ID
	 * @param {string|number} commentId - 评论ID
	 * @param {Object} reply - 回复数据
	 */
	const addReply = (postId, commentId, reply) => {
		// 确保回复有ID
		if (!reply.id) {
			reply.id = Date.now()
		}
		
		// 确保回复有时间
		if (!reply.time) {
			reply.time = '刚刚'
		}
		
		if (!reply.timestamp) {
			reply.timestamp = Date.now()
		}
		
		// 查找评论
		const comments = postComments[postId] || []
		const comment = comments.find(c => c.id === commentId)
		
		if (comment) {
			// 初始化回复数组（如果不存在）
			if (!comment.replies) {
				comment.replies = []
			}
			
			// 添加回复
			comment.replies.push(reply)
			
			// 更新总回复数
			comment.totalReplies = (comment.totalReplies || 0) + 1
			
			// 更新帖子评论数
			const post = getPostById(postId)
			if (post) {
				post.comments++
			}
		}
	}
	
	/**
	 * 点赞评论
	 * @param {string|number} postId - 帖子ID
	 * @param {string|number} commentId - 评论ID
	 */
	const likeComment = (postId, commentId) => {
		const comments = postComments[postId] || []
		const comment = comments.find(c => c.id === commentId)
		
		if (comment) {
			comment.isLiked = !comment.isLiked
			comment.likes += comment.isLiked ? 1 : -1
		}
	}

	return {
		// state
		posts,
		categories,
		currentCategory,
		pagination,
		postDetails,
		userInteractions,
		postComments,

		// getters
		getPostById,
		getFilteredPosts,
		isPostLiked,
		isPostCollected,
		isUserFollowed,
		getCommentsByPostId,

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
		loadInteractions,
		addComment,
		addReply,
		likeComment
	}
}) 