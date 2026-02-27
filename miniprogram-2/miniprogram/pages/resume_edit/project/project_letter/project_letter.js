Page({
    data: {
      mode: 'add',
      projectId: '',
      resumeId: '', // ⭐ 新增 resumeId
      formData: {
        projectName: '',
        startDate: '',
        endDate: '',
        projectContent: ''
      }
    },
  
    onLoad(options) {
      const mode = options.mode
      const id = options.id || ''
      const resumeId = options.resumeId || '' // ⭐ 从 options 获取 resumeId
  
      this.setData({ mode, projectId: id, resumeId })
  
      if (mode === 'edit' && id && resumeId) {
        this.loadDetail(id, resumeId)
      }
    },
  
    /** 读取项目明细 */
    async loadDetail(id, resumeId) {
      const db = wx.cloud.database()
      try {
        const res = await db.collection('resumes').doc(resumeId).get()
        if (res.data) {
          const list = res.data.content.project || []
          const item = list.find(i => i.projectId === id)
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
  
    /** 保存项目 */
    async saveProject() {
      const { resumeId, mode, projectId, formData } = this.data
      if (!resumeId) return
  
      const db = wx.cloud.database()
      try {
        const res = await db.collection('resumes').doc(resumeId).get()
        if (!res.data) return
  
        let list = res.data.content.project || []
  
        if (mode === 'add') {
          list.push({ projectId: Date.now().toString(), ...formData })
        } else {
          list = list.map(item =>
            item.projectId === projectId ? { ...formData } : item
          )
        }
  
        await db.collection('resumes')
          .doc(resumeId)
          .update({ data: { 'content.project': list, updateTime: db.serverDate() } })
  
        wx.navigateBack()
      } catch (err) {
        console.error('saveProject error', err)
        wx.showToast({ title: '保存失败', icon: 'none' })
      }
    },
  
    /** 删除项目 */
    async deleteProject() {
      const { resumeId, projectId } = this.data
      if (!resumeId) return
  
      const db = wx.cloud.database()
      try {
        const res = await db.collection('resumes').doc(resumeId).get()
        if (!res.data) return
  
        let list = res.data.content.project || []
        list = list.filter(item => item.projectId !== projectId)
  
        await db.collection('resumes')
          .doc(resumeId)
          .update({ data: { 'content.project': list, updateTime: db.serverDate() } })
  
        wx.navigateBack()
      } catch (err) {
        console.error('deleteProject error', err)
        wx.showToast({ title: '删除失败', icon: 'none' })
      }
    }
  })