Page({
    data: {
      mode: 'add',
      expId: '',
      resumeId: '',
      formData: {
        jobTitle: '',
        company: '',
        startDate: '',
        endDate: '',
        workContent: ''
      }
    },
  
    onLoad(options) {
      const mode = options.mode
      const id = options.id || ''
      const resumeId = options.resumeId || ''  // 接收父页面传过来的 resumeId
  
      this.setData({ mode, expId: id, resumeId })
  
      if (mode === 'edit') this.loadDetail(id)
    },
  
    async loadDetail(id) {
      if (!this.data.resumeId) return
      const db = wx.cloud.database()
  
      try {
        const res = await db.collection('resumes')
          .doc(this.data.resumeId)
          .get()
  
        const list = res.data.content.experience || []
        const item = list.find(i => i.expId === id)
        if (item) this.setData({ formData: item })
      } catch (err) {
        console.error('loadDetail error', err)
      }
    },
  
    handleInput(e) {
      const field = e.currentTarget.dataset.field
      this.setData({ [`formData.${field}`]: e.detail.value })
    },
  
    handleDateChange(e) {
      const field = e.currentTarget.dataset.field
      this.setData({ [`formData.${field}`]: e.detail.value.substring(0, 7) })
    },
  
    async saveExperience() {
      if (!this.data.resumeId) return
      const db = wx.cloud.database()
  
      try {
        const res = await db.collection('resumes').doc(this.data.resumeId).get()
        let list = res.data.content.experience || []
  
        if (this.data.mode === 'add') {
          list.push({ expId: Date.now().toString(), ...this.data.formData })
        } else {
          list = list.map(item =>
            item.expId === this.data.expId ? { ...this.data.formData, expId: this.data.expId } : item
          )
        }
  
        await db.collection('resumes').doc(this.data.resumeId).update({
          data: { 'content.experience': list, updateTime: db.serverDate() }
        })
  
        // 同步更新上一页 experience_list
        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]
        if (prevPage) prevPage.loadExperience()
  
        wx.navigateBack()
      } catch (err) {
        console.error('saveExperience error', err)
        wx.showToast({ title: '保存失败', icon: 'none' })
      }
    },
  
    async deleteExperience() {
      if (!this.data.resumeId) return
      const db = wx.cloud.database()
  
      try {
        const res = await db.collection('resumes').doc(this.data.resumeId).get()
        let list = res.data.content.experience || []
        list = list.filter(item => item.expId !== this.data.expId)
  
        await db.collection('resumes').doc(this.data.resumeId).update({
          data: { 'content.experience': list, updateTime: db.serverDate() }
        })
  
        // 同步更新上一页 experience_list
        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]
        if (prevPage) prevPage.loadExperience()
  
        wx.navigateBack()
      } catch (err) {
        console.error('deleteExperience error', err)
        wx.showToast({ title: '删除失败', icon: 'none' })
      }
    }
  })