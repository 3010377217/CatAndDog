'use strict';
exports.main = async (event, context) => {
  // 获取用户ID
  const userId = event.userId || context.OPENID;
  
  if (!userId) {
    return {
      code: -1,
      msg: '缺少用户ID'
    };
  }
  
  try {
    const db = uniCloud.database();
    const usersCollection = db.collection('users');
    
    // 查询用户信息
    const userInfo = await usersCollection.doc(userId).get();
    
    if (!userInfo.data || userInfo.data.length === 0) {
      return {
        code: -2,
        msg: '用户不存在'
      };
    }
    
    return {
      code: 0,
      msg: '获取成功',
      data: userInfo.data[0]
    };
  } catch (e) {
    console.error(e);
    return {
      code: -3,
      msg: '获取用户信息失败',
      error: e.message
    };
  }
};