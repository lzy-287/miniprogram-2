Page({
    data: {
      mode: 'add',
      eduId: '',
      resumeId: '',   // ⭐ 新增 resumeId
      formData: {
        degree: '',
        school: '',
        major: '',
        startDate: '',
        endDate: ''
      }
    },
  
    onLoad(options) {
      const mode = options.mode
      const id = options.id || ''
      const resumeId = options.resumeId || ''  // ⭐ 从 options 获取 resumeId
  
      this.setData({ mode, eduId: id, resumeId })
  
      if (mode === 'edit' && id && resumeId) {
        this.loadDetail(id, resumeId)
      }
    },
  
    /** 读取教育明细 */
    async loadDetail(id, resumeId) {
      const db = wx.cloud.database()
      try {
        const res = await db.collection('resumes').doc(resumeId).get()
        if (res.data) {
          const list = res.data.content.education || []
          const item = list.find(i => i.eduId === id)
          if (item) this.setData({ formData: item })
        }
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
      this.setData({ [`formData.${field}`]: e.detail.value.substring(0,7) }) // YYYY-MM
    },
  
    /** 保存教育经历 */
    async saveEducation() {
      const { resumeId, mode, eduId, formData } = this.data
      if (!resumeId) return
  
      const db = wx.cloud.database()
      try {
        const res = await db.collection('resumes').doc(resumeId).get()
        if (!res.data) return
  
        let list = res.data.content.education || []
  
        if (mode === 'add') {
          list.push({ eduId: Date.now().toString(), ...formData })
        } else {
          list = list.map(item =>
            item.eduId === eduId ? { ...formData } : item
          )
        }
  
        await db.collection('resumes')
          .doc(resumeId)
          .update({ data: { 'content.education': list, updateTime: db.serverDate() } })
  
        wx.navigateBack()
      } catch (err) {
        console.error('saveEducation error', err)
        wx.showToast({ title: '保存失败', icon: 'none' })
      }
    },
  
    /** 删除教育经历 */
    async deleteEducation() {
      const { resumeId, eduId } = this.data
      if (!resumeId) return
  
      const db = wx.cloud.database()
      try {
        const res = await db.collection('resumes').doc(resumeId).get()
        if (!res.data) return
  
        let list = res.data.content.education || []
        list = list.filter(item => item.eduId !== eduId)
  
        await db.collection('resumes')
          .doc(resumeId)
          .update({ data: { 'content.education': list, updateTime: db.serverDate() } })
  
        wx.navigateBack()
      } catch (err) {
        console.error('deleteEducation error', err)
        wx.showToast({ title: '删除失败', icon: 'none' })
      }
    }
  })