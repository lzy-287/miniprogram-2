Page({
    data: {
      content: '',
      currentLength: 0,
      maxLength: 500,
      resumeId: ''  // 父页面传过来的
    },
  
    onLoad(options) {
      // 父页面传来的 resumeId
      if (options.resumeId) {
        this.setData({ resumeId: options.resumeId }, () => {
          this.loadData()
        })
      }
    },
  
    /** 读取已有内容 */
    async loadData() {
      if (!this.data.resumeId) return
      const db = wx.cloud.database()
  
      try {
        const res = await db.collection('resumes')
          .doc(this.data.resumeId)
          .get()
  
        const text = res.data?.content?.advantage || ''
        this.setData({
          content: text,
          currentLength: text.length
        })
      } catch (err) {
        console.error('loadData error', err)
      }
    },
  
    /** 输入监听 */
    onInput(e) {
      const value = e.detail.value
      this.setData({
        content: value,
        currentLength: value.length
      })
    },
  
    /** 保存 */
    async save() {
      if (!this.data.content.trim()) {
        wx.showToast({ title: '请输入个人优势内容', icon: 'none' })
        return
      }
      if (!this.data.resumeId) return
  
      const db = wx.cloud.database()
      try {
        await db.collection('resumes')
          .doc(this.data.resumeId)
          .update({
            data: {
              'content.advantage': this.data.content,
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