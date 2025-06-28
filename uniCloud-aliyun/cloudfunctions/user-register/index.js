'use strict';
const uniID = require('uni-id')

exports.main = async (event, context) => {
	const { username, password, nickname } = event
	
	// 校验参数
	if (!username || !password) {
		return {
			code: -1,
			msg: '用户名或密码不能为空'
		}
	}
	
	// 调用uni-id注册
	const res = await uniID.register({
		username,
		password,
		nickname: nickname || username
	})
	
	return res
};