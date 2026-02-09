// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: 'cloud1-3g4enudsc8f365c8' })
const db = cloud.database();

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  const { role, form } = event;

  const users = db.collection('users');

  const exist = await users.where({ openid: OPENID }).get();
  if (exist.data.length > 0) {
    return { success: false, message: '用户已注册' };
  }

  const userData = {
    openid: OPENID,
    role,
    name: form.name,
    avatar: form.avatarFileID || '',
    school: form.school || '',
    major: form.major || '',
    company: form.company || '',
    title: form.title || '',
    createdAt: db.serverDate()
  };

  await users.add({ data: userData });

  return {
    success: true,
    userInfo: userData
  };
};
