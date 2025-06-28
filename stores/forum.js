import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useForumStore = defineStore('forum', () => {
	// 默认帖子数据（模拟后端数据库）
	const defaultPosts = [
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
		},
		{
			id: 4,
			user: {
				id: 104,
				username: '猫语者',
				avatar: '/static/logo.png'
			},
			time: '5小时前',
			timestamp: Date.now() - 5 * 60 * 60 * 1000,
			category: '猫咪行为',
			categoryId: 1,
			title: '猫咪为什么会突然发疯乱跑？这里有答案！',
			content: '很多铲屎官可能都遇到过这种情况：猫咪突然像疯了一样在家里狂奔，上蹿下跳，跑完后又若无其事地舔毛或睡觉。这种行为专业术语叫"疯狂半小时"(Zoomies)，是完全正常的行为！\n\n为什么会这样呢？主要有以下几个原因：\n\n1. 能量释放\n猫咪是天生的猎手，如果平时活动太少，积累了太多能量，就会通过这种方式释放。\n\n2. 本能使然\n野外的猫咪会有定时的狩猎活动，家猫虽然不需要狩猎，但这种本能依然存在。\n\n3. 快乐表达\n有时候这只是单纯的快乐表达，特别是年轻的猫咪。\n\n4. 排解压力\n某些情况下，这也可能是排解压力或焦虑的方式。\n\n如何应对？其实不需要特别处理，只要确保家中环境安全，没有尖锐物品或易碎品放在猫咪可能跑动的路线上即可。定期陪猫咪玩耍，提供足够的玩具和活动空间，也能减少这种行为的频率。',
			images: ['/static/picture/8.jpg'],
			likes: 345,
			comments: 67,
			collects: 42,
			isLiked: false,
			isCollected: false,
			tags: ['猫咪行为', '猫咪心理', '宠物护理']
		},
		{
			id: 5,
			user: {
				id: 105,
				username: '汪星研究员',
				avatar: '/static/logo.png'
			},
			time: '8小时前',
			timestamp: Date.now() - 8 * 60 * 60 * 1000,
			category: '狗狗训练',
			categoryId: 2,
			title: '一周搞定狗狗基础训练，这些命令最实用！',
			content: '想让你的狗狗更听话更好沟通吗？基础训练是必不可少的，而且并不像你想象的那么难！只要方法正确，一周时间就能看到明显效果。\n\n以下是最实用的几个基础命令训练方法：\n\n1. "坐下"命令\n- 手持零食放在狗狗鼻子前面\n- 慢慢将零食举高并向后移动\n- 狗狗自然会坐下\n- 立即表扬并给予零食奖励\n- 同时说出"坐下"指令\n- 重复10-15次，每天练习3-4次\n\n2. "待命"命令\n- 先让狗狗"坐下"\n- 手掌对着狗狗，说"待命"\n- 后退一步，如果狗狗没动，立即奖励\n- 逐渐增加距离和时间\n\n3. "过来"命令\n- 蹲下来，张开双臂\n- 用愉快的语气说"过来"\n- 狗狗过来后立即奖励\n- 从短距离开始，逐渐增加难度\n\n4. "放下"命令\n- 当狗狗叼着玩具时\n- 拿出零食，放在鼻子前\n- 说"放下"\n- 狗狗放下玩具后立即给予零食奖励\n\n记住：训练要有耐心，每次训练时间不要太长（15-20分钟为宜），保持积极正面的态度，多使用奖励而非惩罚。',
			images: ['/static/picture/1.jpg', '/static/picture/2.jpg'],
			likes: 412,
			comments: 89,
			collects: 76,
			isLiked: false,
			isCollected: false,
			tags: ['狗狗训练', '基础命令', '宠物教育']
		},
		{
			id: 6,
			user: {
				id: 106,
				username: '宠物医生小王',
				avatar: '/static/logo.png'
			},
			time: '昨天',
			timestamp: Date.now() - 24 * 60 * 60 * 1000,
			category: '宠物健康',
			categoryId: 3,
			title: '猫狗常见皮肤问题解析与家庭护理方法',
			content: '皮肤问题是猫狗最常见的健康问题之一，作为宠物医生，我每天都会接诊很多皮肤病患宠。今天和大家分享一些常见皮肤问题的识别和家庭护理方法。\n\n1. 跳蚤感染\n症状：频繁挠痒、不安、皮肤上有黑点（跳蚤粪便）\n护理方法：\n- 使用专业除跳蚤产品（喷剂、滴剂等）\n- 彻底清洁宠物窝及周围环境\n- 定期使用预防药物\n\n2. 真菌感染（癣）\n症状：圆形脱毛区域，可能有轻微发红和鳞片\n护理方法：\n- 需要兽医确诊并开具抗真菌药物\n- 保持感染区域干燥清洁\n- 使用专业药用洗浴产品\n- 注意！某些真菌可传染给人类\n\n3. 过敏性皮炎\n症状：发红、瘙痒、可能有丘疹\n护理方法：\n- 找出并避开过敏原\n- 使用兽医推荐的抗过敏药物\n- 可能需要特殊饮食\n\n4. 干燥皮肤\n症状：皮屑增多、皮肤发干、轻度瘙痒\n护理方法：\n- 增加饮食中的欧米茄-3脂肪酸\n- 使用温和无刺激的洗浴产品\n- 避免过度洗澡\n\n重要提示：如果宠物出现严重或持续的皮肤问题，一定要及时就医。自行用药可能会延误病情或加重症状。',
			images: ['/static/picture/3.jpg', '/static/picture/4.jpg', '/static/picture/5.jpg'],
			likes: 287,
			comments: 53,
			collects: 64,
			isLiked: false,
			isCollected: false,
			tags: ['皮肤护理', '宠物健康', '家庭护理']
		},
		{
			id: 7,
			user: {
				id: 107,
				username: '冒险猫咪',
				avatar: '/static/logo.png'
			},
			time: '前天',
			timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
			category: '猫咪生活',
			categoryId: 1,
			title: '如何安全地带猫咪外出探险？这些装备必不可少！',
			content: '作为一个经常带猫出门冒险的铲屎官，我想分享一些安全带猫外出的经验和必备装备。\n\n首先，并不是所有猫咪都适合外出，性格胆小或年龄太小/太大的猫咪可能不适合。要根据自己猫咪的性格特点决定。\n\n必备装备清单：\n\n1. 专业猫咪牵引绳和胸背带\n- 选择H型胸背带，更安全不易挣脱\n- 牵引绳最好有一定弹性，避免猫咪突然跑动时的拉扯\n\n2. 便携式猫包/背包\n- 选择透气、视野好的款式\n- 最好有扩展空间，让猫咪可以稍微活动\n\n3. 便携水碗和水\n- 折叠式硅胶碗最为方便\n- 长时间外出一定要带足够的水\n\n4. 猫咪零食\n- 有助于安抚紧张情绪\n- 可用于奖励好行为\n\n5. 猫咪湿巾\n- 清洁爪子和毛发上的灰尘\n\n6. 猫咪身份牌\n- 刻有联系方式，以防万一\n\n外出注意事项：\n- 第一次外出时间不宜过长，10-15分钟即可\n- 选择安静、人少的环境开始尝试\n- 密切观察猫咪状态，如有不适立即返回\n- 避开大型犬活动的区域\n- 不要在极端天气下外出\n\n外出前先在家中让猫咪适应胸背带，循序渐进增加外出时间和探索范围。每次外出后及时奖励，建立正面联系。',
			images: ['/static/picture/10.jpg', '/static/picture/14.jpg'],
			likes: 356,
			comments: 71,
			collects: 58,
			isLiked: false,
			isCollected: false,
			tags: ['猫咪外出', '宠物装备', '猫咪探险']
		}
	]
	
	// state
	// 将posts设置为空数组，模拟初始无数据状态
	const posts = ref([]) // 帖子列表
	
	const categories = ref(['全部', '养猫经验', '养狗经验', '宠物美食', '宠物医疗', '宠物用品'])
	const currentCategory = ref(0) // 当前选中的分类索引
	const pagination = reactive({
		page: 1, // 当前页码
		pageSize: 5, // 每页数量
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

	// 添加额外的测试帖子数据
	for (let i = 8; i <= 20; i++) {
		// 分配给不同分类
		const categoryId = (i % 3) + 1  // 在1、2、3之间循环
		const category = categories.value[categoryId]
		
		defaultPosts.push({
			id: i,
			user: {
				id: 100 + i,
				username: `测试用户${i}`,
				avatar: '/static/logo.png'
			},
			time: `${i}小时前`,
			timestamp: Date.now() - i * 60 * 60 * 1000,
			category: category,
			categoryId: categoryId,
			title: `测试帖子${i} - ${category}分类的内容`,
			content: `这是一个测试帖子，用于测试分页加载功能。这是第${i}个测试帖子，属于${category}分类。\n\n这里有一些随机内容，确保帖子有足够的长度以便测试显示效果。帖子ID: ${i}`,
			images: ['/static/picture/6.jpg', '/static/picture/9.jpg'],
			likes: 10 + i,
			comments: 5 + i,
			collects: 2 + i,
			isLiked: false,
			isCollected: false,
			tags: [`测试标签${i}`, category, '分页测试']
		})
	}

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
		console.log('forumStore.searchPosts - 接收到搜索关键词:', keyword)
		
		if (!keyword) {
			console.log('forumStore.searchPosts - 关键词为空，返回空数组')
			return []
		}
		
		const lowerKeyword = keyword.toLowerCase()
		console.log('forumStore.searchPosts - 转换为小写的关键词:', lowerKeyword)
		console.log('forumStore.searchPosts - 当前帖子总数:', posts.value.length)
		
		const results = posts.value.filter(post => 
			post.title.toLowerCase().includes(lowerKeyword) || 
			post.content.toLowerCase().includes(lowerKeyword)
		)
		
		console.log('forumStore.searchPosts - 过滤后的结果数量:', results.length)
		console.log('forumStore.searchPosts - 匹配的帖子ID:', results.map(post => post.id))
		
		return results
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

	/**
	 * 模拟从后端获取帖子数据
	 * @param {number} page - 页码，从1开始
	 * @param {number} pageSize - 每页数量，默认为5
	 * @param {number} categoryId - 分类ID，可选，不传则获取全部
	 * @returns {Promise} 包含帖子数据和分页信息的Promise
	 */
	const fetchPosts = (page = 1, pageSize = 5, categoryId = null) => {
		// 更新分页信息
		pagination.page = page
		
		// 模拟网络延迟
		return new Promise((resolve) => {
			setTimeout(() => {
				// 根据分类筛选数据
				let filteredData = [...defaultPosts]
				
				if (categoryId !== null && categoryId !== 0) {
					filteredData = filteredData.filter(post => post.categoryId === categoryId)
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
					setPosts(pageData)
				} else {
					// 非第一页，追加数据
					addPosts(pageData)
				}
				
				// 更新分页状态
				pagination.hasMore = hasMore
				
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

	/**
	 * 随机获取帖子数据，用于下拉刷新
	 * @param {number} count - 需要获取的帖子数量
	 * @param {number} categoryId - 分类ID，可选，不传则获取全部
	 * @param {Array} excludeIds - 需要排除的帖子ID数组，避免重复
	 * @returns {Promise} 包含随机帖子数据的Promise
	 */
	const fetchRandomPosts = (count = 5, categoryId = null, excludeIds = []) => {
		// 模拟网络延迟
		return new Promise((resolve) => {
			setTimeout(() => {
				// 根据分类筛选数据
				let filteredData = [...defaultPosts]
				
				if (categoryId !== null && categoryId !== 0) {
					filteredData = filteredData.filter(post => post.categoryId === categoryId)
				}
				
				// 排除指定ID的帖子
				if (excludeIds.length > 0) {
					filteredData = filteredData.filter(post => !excludeIds.includes(post.id))
				}
				
				// 随机打乱数组顺序
				const shuffledData = filteredData.sort(() => Math.random() - 0.5)
				
				// 获取指定数量的随机帖子
				const randomData = shuffledData.slice(0, count)
				
				// 更新状态
				setPosts(randomData)
				
				// 更新分页状态 - 由于是随机数据，设置为有更多数据可加载
				pagination.page = 1
				pagination.hasMore = true
				
				// 返回数据和分页信息
				resolve({
					data: randomData,
					pagination: {
						page: 1,
						pageSize: count,
						hasMore: true,
						total: filteredData.length
					}
				})
			}, 1000) // 模拟1000ms网络延迟
		})
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
		likeComment,
		fetchPosts, // 获取帖子方法
		fetchRandomPosts // 新增的随机获取帖子方法
	}
}) 