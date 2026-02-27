Page({
    data: {
      mode: 'add',
      certId: '',
      resumeId: '',   // ⭐ 新增 resumeId
      formData: {
        certName: '',
        obtainDate: ''
      }
    },
  
    onLoad(options) {
      const mode = options.mode || 'add'
      const id = options.id || ''
      const resumeId = options.resumeId || ''
  
      console.log('certificate_letter onLoad options:', options) // 🔥 调试用
      this.setData({ mode, certId: id, resumeId })
  
      if (mode === 'edit' && id && resumeId) {
        this.loadDetail(id, resumeId)
      }
    },
  
    /** 读取证书明细 */
    async loadDetail(id, resumeId) {
      const db = wx.cloud.database()
      try {
        const res = await db.collection('resumes').doc(resumeId).get()
        const list = res.data?.content.certificate || []
        const item = list.find(i => i.certId === id)
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
      this.setData({ [`formData.${field}`]: e.detail.value.substring(0,7) }) // YYYY-MM
    },
  
    /** 保存证书 */
    async saveCertificate() {
      const { resumeId, formData, mode, certId } = this.data
      if (!resumeId) {
        wx.showToast({ title: '简历未加载', icon: 'none' })
        return
      }
  
      if (!formData.certName) {
        wx.showToast({ title: '请输入证书名称', icon: 'none' })
        return
      }
  
      const db = wx.cloud.database()
      try {
        const res = await db.collection('resumes').doc(resumeId).get()
        if (!res.data) return
  
        let list = res.data.content.certificate || []
  
        if (mode === 'add') {
          list.push({ certId: Date.now().toString(), ...formData })
        } else {
          list = list.map(item => item.certId === certId ? { ...formData, certId } : item)
        }
  
        await db.collection('resumes').doc(resumeId).update({
          data: { 'content.certificate': list, updateTime: db.serverDate() }
        })
  
        wx.navigateBack()
      } catch (err) {
        console.error('saveCertificate error', err)
        wx.showToast({ title: '保存失败', icon: 'none' })
      }
    },
  
    /** 删除证书 */
    async deleteCertificate() {
      const { resumeId, certId } = this.data
      if (!resumeId || !certId) return
  
      const db = wx.cloud.database()
      try {
        const res = await db.collection('resumes').doc(resumeId).get()
        let list = res.data?.content.certificate || []
        list = list.filter(item => item.certId !== certId)
  
        await db.collection('resumes').doc(resumeId).update({
          data: { 'content.certificate': list, updateTime: db.serverDate() }
        })
  
        wx.navigateBack()
      } catch (err) {
        console.error('deleteCertificate error', err)
        wx.showToast({ title: '删除失败', icon: 'none' })
      }
    }
  })