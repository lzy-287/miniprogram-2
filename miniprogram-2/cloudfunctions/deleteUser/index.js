const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database({ env: 'cloud1-3g4enudsc8f365c8' });

exports.main = async (event) => {
  const { openid } = event;
  try {
    // 删除用户
    await db.collection('users').where({ openid }).remove();

    // TODO: 删除其他关联数据，如申请/岗位/简历等
    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
};
