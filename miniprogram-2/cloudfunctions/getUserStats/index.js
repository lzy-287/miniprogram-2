// 云函数 getUserStats
const cloud = require('wx-server-sdk')
cloud.init({ env: 'cloud1-3g4enudsc8f365c8' })
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { userType, openid } = event;

  try {
    let result = {
      pendingCount: 0,
      approvedCount: 0,
      postCount: 0,
      successCount: 0,
      pendingResumeCount: 0,
      teacherPending: 0,
      teacherApproved: 0,
      passRate: 0
    };

    if (userType === 'student') {
      // 获取学生的待审核申请和已通过申请
      const applications = await db.collection('applications').where({
        userId: openid
      }).get();
      
      result.pendingCount = applications.data.filter(item => item.status === 'pending').length;
      result.approvedCount = applications.data.filter(item => item.status === 'approved').length;
    }

    if (userType === 'alumni') {
      // 获取校友的已发布岗位和内推成功人数
      const jobs = await db.collection('jobs').where({
        _openid: openid,
        status: '已发布'
      }).get();
      
      result.postCount = jobs.data.length;
      result.successCount = await db.collection('applications').where({
        jobId: _.in(jobs.data.map(job => job._id)),
        status: 'approved'
      }).count();
    }

    if (userType === 'teacher') {
      // 获取教师的待审核简历和已审核简历数量
      const resumes = await db.collection('resumes').where({
        reviewerOpenid: openid
      }).get();
      
      result.teacherPending = resumes.data.filter(item => item.status === 'pending').length;
      result.teacherApproved = resumes.data.filter(item => item.status === 'approved').length;
      
      // 计算简历通过率
      const totalResumes = resumes.data.length;
      if (totalResumes > 0) {
        result.passRate = ((result.teacherApproved / totalResumes) * 100).toFixed(2);
      }
    }

    return result;
  } catch (err) {
    return {
      errMsg: err.message
    };
  }
};