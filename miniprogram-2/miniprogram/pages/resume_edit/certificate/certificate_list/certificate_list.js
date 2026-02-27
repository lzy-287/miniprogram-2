Page({
    data: {
      certList: [],
      resumeId: ''
    },
  
    onLoad(options) {
      // 获取上级传来的 resumeId
      const resumeId = options.resumeId || ''
      this.setData({ resumeId })
    },
  
    onShow() {
      this.loadCertificates()
    },
  
    /** 读取证书列表 */
    async loadCertificates() {
      if (!this.data.resumeId) return
      const db = wx.cloud.database()
      try {
        const res = await db.collection('resumes').doc(this.data.resumeId).get()
        if (res.data) {
          this.setData({
            certList: res.data.content.certificate || []
          })
        }
      } catch (err) {
        console.error('loadCertificates error', err)
      }
    },
  
    /** 新增证书 */
    addCertificate() {
      if (!this.data.resumeId) return
      wx.navigateTo({
        url: `/pages/resume_edit/certificate/certificate_letter/certificate_letter?mode=add&resumeId=${this.data.resumeId}`
      })
    },
  
    /** 编辑证书 */
    editCertificate(e) {
      if (!this.data.resumeId) return
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/resume_edit/certificate/certificate_letter/certificate_letter?mode=edit&id=${id}&resumeId=${this.data.resumeId}`
      })
    }
  })