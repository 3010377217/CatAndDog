'use strict';
exports.main = async (event, context) => {
  // 获取用户ID和成长值
  const userId = event.userId || context.OPENID;
  const { value, reason } = event;
  
  if (!userId) {
    return {
      code: -1,
      msg: '缺少用户ID'
    };
  }
  
  if (!value || typeof value !== 'number' || value <= 0) {
    return {
      code: -2,
      msg: '成长值必须是大于0的数字'
    };
  }
  
  try {
    const db = uniCloud.database();
    const usersCollection = db.collection('users');
    const dbCmd = db.command;
    
    // 增加成长值
    await usersCollection.doc(userId).update({
      growth_value: dbCmd.inc(value)
    });
    
    // 获取更新后的用户信息
    const updatedUser = await usersCollection.doc(userId).get();
    
    // 可选：记录成长值变动日志
    if (reason) {
      const growthLogsCollection = db.collection('growth_logs');
      await growthLogsCollection.add({
        user_id: userId,
        value: value,
        reason: reason,
        create_time: new Date()
      });
    }
    
    return {
      code: 0,
      msg: '成长值增加成功',
      data: {
        current_growth: updatedUser.data[0].growth_value
      }
    };
  } catch (e) {
    console.error(e);
    return {
      code: -3,
      msg: '增加成长值失败',
      error: e.message
    };
  }
};