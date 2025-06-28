// 基础请求URL
const BASE_URL = 'your_api_base_url'

// 论坛相关API
export const forumApi = {
	// 获取帖子列表
	getPosts: (params) => {
		return uni.request({
			url: `${BASE_URL}/posts`,
			method: 'GET',
			data: params
		})
	},
	
	// 获取帖子详情
	getPostDetail: (postId) => {
		return uni.request({
			url: `${BASE_URL}/posts/${postId}`,
			method: 'GET'
		})
	},
	
	// 发布帖子
	createPost: (data) => {
		return uni.request({
			url: `${BASE_URL}/posts`,
			method: 'POST',
			data
		})
	},
	
	// 上传图片
	uploadImage: (filePath) => {
		return uni.uploadFile({
			url: `${BASE_URL}/upload`,
			filePath,
			name: 'file'
		})
	},
	
	// 点赞帖子
	likePost: (postId) => {
		return uni.request({
			url: `${BASE_URL}/posts/${postId}/like`,
			method: 'POST'
		})
	},
	
	// 取消点赞
	unlikePost: (postId) => {
		return uni.request({
			url: `${BASE_URL}/posts/${postId}/unlike`,
			method: 'POST'
		})
	},
	
	// 收藏帖子
	collectPost: (postId) => {
		return uni.request({
			url: `${BASE_URL}/posts/${postId}/collect`,
			method: 'POST'
		})
	},
	
	// 取消收藏
	uncollectPost: (postId) => {
		return uni.request({
			url: `${BASE_URL}/posts/${postId}/uncollect`,
			method: 'POST'
		})
	},
	
	// 关注用户
	followUser: (userId) => {
		return uni.request({
			url: `${BASE_URL}/users/${userId}/follow`,
			method: 'POST'
		})
	},
	
	// 取消关注
	unfollowUser: (userId) => {
		return uni.request({
			url: `${BASE_URL}/users/${userId}/unfollow`,
			method: 'POST'
		})
	},
	
	// 获取评论列表
	getComments: (postId, params) => {
		return uni.request({
			url: `${BASE_URL}/posts/${postId}/comments`,
			method: 'GET',
			data: params
		})
	},
	
	// 发表评论
	createComment: (postId, data) => {
		return uni.request({
			url: `${BASE_URL}/posts/${postId}/comments`,
			method: 'POST',
			data
		})
	},
	
	// 回复评论
	replyComment: (postId, commentId, data) => {
		return uni.request({
			url: `${BASE_URL}/posts/${postId}/comments/${commentId}/reply`,
			method: 'POST',
			data
		})
	}
} 