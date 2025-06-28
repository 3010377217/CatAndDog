'use strict';
exports.main = async (event, context) => {
  // 获取用户ID和要更新的信息
  const userId = event.userId || context.OPENID;
  const { nickname, avatar, phone, gender } = event;
  
  if (!userId) {
    return {
      code: -1,
      msg: '缺少用户ID'
    };
  }
  
  try {
    const db = uniCloud.database();
    const usersCollection = db.collection('users');
    
    // 构建更新对象
    const updateData = {};
    if (nickname !== undefined) updateData.nickname = nickname;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (phone !== undefined) updateData.phone = phone;
    if (gender !== undefined) updateData.gender = gender;
    
    // 如果没有要更新的字段
    if (Object.keys(updateData).length === 0) {
      return {
        code: -2,
        msg: '没有提供要更新的字段'
      };
    }
    
    // 更新用户信息
    await usersCollection.doc(userId).update(updateData);
    
    // 获取更新后的用户信息
    const updatedUser = await usersCollection.doc(userId).get();
    
    return {
      code: 0,
      msg: '更新成功',
      data: updatedUser.data[0]
    };
  } catch (e) {
    console.error(e);
    return {
      code: -3,
      msg: '更新用户信息失败',
      error: e.message
    };
  }
};