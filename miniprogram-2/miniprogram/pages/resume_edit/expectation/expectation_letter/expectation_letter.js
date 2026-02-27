Page({
    data: {
      form: {
        jobTitle: '',
        location: '',
        salary: ''
      },
      resumeId: '' // 父页面传递的 resumeId
    },
  
    onLoad(options) {
      if (options.resumeId) {
        this.setData({ resumeId: options.resumeId }, () => {
          this.loadData()
        })
      }
    },
  
    /** 读取数据库已有期望 */
    async loadData() {
      if (!this.data.resumeId) return
      const db = wx.cloud.database()
  
      try {
        const res = await db.collection('resumes')
          .doc(this.data.resumeId)
          .get()
  
        const exp = res.data?.content?.expectation || {}
        this.setData({
          form: {
            jobTitle: exp.jobTitle || '',
            location: exp.location || '',
            salary: exp.salary || ''
          }
        })
      } catch (err) {
        console.error('loadData error', err)
      }
    },
  
    goPosition() {
      wx.navigateTo({
        url: `/pages/resume_edit/expectation/jobTitle_select/jobTitle_select?resumeId=${this.data.resumeId}`
      })
    },
  
    goCity() {
      wx.navigateTo({
        url: `/pages/resume_edit/expectation/location_select/location_select?resumeId=${this.data.resumeId}`
      })
    },
  
    onSalaryInput(e) {
      this.setData({ 'form.salary': e.detail.value })
    },
  
    /** 保存 */
    async save() {
      if (!this.data.form.jobTitle) {
        wx.showToast({ title: '请选择期望职位', icon: 'none' })
        return
      }
      if (!this.data.resumeId) return
  
      const db = wx.cloud.database()
  
      try {
        await db.collection('resumes')
          .doc(this.data.resumeId)
          .update({
            data: {
              'content.expectation': this.data.form,
              updateTime: db.serverDate()
            }
          })
  
        wx.showToast({ title: '保存成功' })
        setTimeout(() => wx.navigateBack(), 800)
      } catch (err) {
        console.error('save error', err)
        wx.showToast({ title: '保存失败', icon: 'none' })
      }
    }
  })