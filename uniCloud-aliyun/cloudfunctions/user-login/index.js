'use strict';
exports.main = async (event, context) => {
  // 获取微信小程序传来的code
  const { code, userInfo } = event;

  if (!code) {
    return {
      code: -1,
      msg: '缺少code参数'
    };
  }

  try {
    // 获取数据库引用
    const db = uniCloud.database();
    const usersCollection = db.collection('users');

    // 1. 通过code获取openid
    let openid;
    if (process.env.UNI_CLOUD_PLATFORM) {
      // 云端环境
      const wxContext = await uniCloud.getWXContext({
        code: code
      });
      openid = wxContext.OPENID;
    } else {
      // 本地调试环境，mock openid
      openid = 'mock-openid-for-local-debug';
    }
    if (!openid) {
      return {
        code: -2,
        msg: '获取openid失败'
      };
    }

    // 2. 查询用户是否已存在
    const userRecord = await usersCollection.where({
      openid: openid
    }).get();

    let userId;

    if (userRecord.data && userRecord.data.length > 0) {
      // 用户已存在，返回用户信息
      userId = userRecord.data[0]._id;

      // 可选：更新用户信息
      if (userInfo) {
        await usersCollection.doc(userId).update({
          nickname: userInfo.nickName || userRecord.data[0].nickname,
          avatar: userInfo.avatarUrl || userRecord.data[0].avatar,
          gender: userInfo.gender !== undefined ? userInfo.gender : userRecord.data[0].gender
        });
      }
    } else {
      // 用户不存在，创建新用户
      const newUser = {
        openid: openid,
        nickname: userInfo?.nickName || '新用户',
        avatar: userInfo?.avatarUrl || '',
        gender: userInfo?.gender || 0,
        growth_value: 0,
        register_date: new Date()
      };

      const insertResult = await usersCollection.add(newUser);
      userId = insertResult.id;
    }

    // 3. 获取最新的用户信息
    const freshUserInfo = await usersCollection.doc(userId).get();

    // 4. 生成token（云端用uni-id，本地mock）
    let token;
    if (process.env.UNI_CLOUD_PLATFORM) {
      const uniId = uniCloud.importObject('uni-id');
      const tokenRes = await uniId.createToken({
        uid: userId,
        needPermission: false
      });
      if (tokenRes.code !== 0) {
        return {
          code: -4,
          msg: 'token生成失败',
          error: tokenRes
        };
      }
      token = tokenRes.token;
    } else {
      // 本地调试环境，mock token
      token = 'mock-token-for-local-debug';
    }

    return {
      code: 0,
      msg: '登录成功',
      data: {
        token: token,
        userId: userId,
        userInfo: freshUserInfo.data[0]
      }
    };
  } catch (e) {
    console.error(e);
    return {
      code: -3,
      msg: '登录失败',
      error: e.message
    };
  }
};