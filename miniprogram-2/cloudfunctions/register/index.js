// 云函数 register
const cloud = require('wx-server-sdk');
cloud.init({ env: 'cloud1-3g4enudsc8f365c8' })

const db = cloud.database();

exports.main = async (event, context) => {
  const { role, form } = event;
  const { name, gender, school, major, company, title } = form;

  try {
    // 检查用户是否已存在
    const userRes = await db.collection('users').where({
      openid: context.OPENID
    }).get();

    if (userRes.data.length > 0) {
      return {
        success: false,
        message: '用户已存在'
      };
    }

    // 插入新用户
    const userInfo = {
      openid: context.OPENID,
      role,
      name,
      gender,
      school,
      major,
      company,
      title,
      avatar: '/assets/default_avatar.png', // 默认头像
      createdAt: new Date()
    };

    const result = await db.collection('users').add({
      data: userInfo
    });

    return {
      success: true,
      message: '注册成功',
      userInfo: {
        ...userInfo,
        _id: result._id
      }
    };
  } catch (err) {
    return {
      success: false,
      message: err.message
    };
  }
};