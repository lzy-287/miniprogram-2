const cloud = require('wx-server-sdk')
cloud.init({ env: 'cloud1-3g4enudsc8f365c8' })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { resumeId } = event
  if (!resumeId) return { success: false, message: '缺少 resumeId' }

  try {
    // 开始事务
    const result = await db.runTransaction(async transaction => {
      // 查找当前默认简历
      const currentDefault = await transaction.collection('resumes')
        .where({ _openid: openid, isDefault: true })
        .limit(1)
        .get()

      if (currentDefault.data.length) {
        const curId = currentDefault.data[0]._id
        if (curId !== resumeId) {
          await transaction.collection('resumes')
            .doc(curId)
            .update({ data: { isDefault: false } })
        }
      }

      // 设置目标简历为默认
      const updateRes = await transaction.collection('resumes')
        .doc(resumeId)
        .update({ data: { isDefault: true } })

      if (updateRes.stats.updated === 0) throw new Error('未找到该简历或无权限修改')

      return true
    })

    return { success: true, message: '默认简历设置成功' }
  } catch (err) {
    console.error(err)
    return { success: false, message: '设置失败', error: err }
  }
}