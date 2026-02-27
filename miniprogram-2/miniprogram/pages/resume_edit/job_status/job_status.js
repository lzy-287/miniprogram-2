Page({
    data: {
      statusList: [
        { label: '看看机会', value: '看看机会' },
        { label: '找正式工作', value: '找正式工作' },
        { label: '找实习工作', value: '找实习工作' }
      ],
      selected: '',
      resumeId: '' // 父页面传递的 resumeId
    },
  
    onLoad(options) {
      if (options.resumeId) {
        this.setData({ resumeId: options.resumeId }, () => {
          this.loadData()
        })
      }
    },
  
    /** 读取已有状态 */
    async loadData() {
      if (!this.data.resumeId) return
      const db = wx.cloud.database()
  
      try {
        const res = await db.collection('resumes')
          .doc(this.data.resumeId)
          .get()
  
        const jobStatus = res.data?.content?.jobStatus || ''
        this.setData({ selected: jobStatus })
      } catch (err) {
        console.error('loadData error', err)
      }
    },
  
    /** 点击选项 */
    selectStatus(e) {
      const value = e.currentTarget.dataset.value
      this.setData({ selected: value })
    },
  
    /** 保存 */
    async save() {
      if (!this.data.selected) {
        wx.showToast({ title: '请选择求职状态', icon: 'none' })
        return
      }
  
      if (!this.data.resumeId) return
      const db = wx.cloud.database()
  
      try {
        await db.collection('resumes')
          .doc(this.data.resumeId)
          .update({
            data: {
              'content.jobStatus': this.data.selected,
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