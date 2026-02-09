// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: 'cloud1-3g4enudsc8f365c8' })
const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const role = event.role;

  const userCol = db.collection('users');
  const res = await userCol.where({ openid }).get();

  // 未注册
  if (res.data.length === 0) {
    return {
      isRegistered: false
    };
  }

  const user = res.data[0];

  // 身份不匹配（一个 ID 只能有一种身份）
  if (user.role !== role) {
    return {
      isRegistered: true,
      error: '身份不匹配'
    };
  }

  // 已注册
  return {
    isRegistered: true,
    userInfo: user
  };
};