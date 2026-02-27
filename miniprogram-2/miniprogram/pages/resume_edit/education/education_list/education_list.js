Page({
    data: {
      educationList: [],
      resumeId: '' // ⭐ 新增 resumeId
    },
  
    onShow() {
      this.loadEducation()
    },

    onLoad(options) {
        // ⭐ 接收 resumeId
        if (options.resumeId) {
          this.setData({ resumeId: options.resumeId })
        }
      },
  
    /** 加载教育经历 */
    async loadEducation() {
      const { resumeId } = this.data
      const db = wx.cloud.database()
  
      try {
        let educationList = []
  
        if (resumeId) {
          // 使用 resumeId 直接读取
          const res = await db.collection('resumes').doc(resumeId).get()
          if (res.data) educationList = res.data.content.education || []
        }
  
        this.setData({ educationList })
      } catch (err) {
        console.error('loadEducation error', err)
      }
    },
  
    addEducation() {
      wx.navigateTo({
        // ⭐ 传递 resumeId
        url: `/pages/resume_edit/education/education_letter/education_letter?mode=add&resumeId=${this.data.resumeId}`
      })
    },
  
    editEducation(e) {
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        // ⭐ 传递 resumeId
        url: `/pages/resume_edit/education/education_letter/education_letter?mode=edit&id=${id}&resumeId=${this.data.resumeId}`
      })
    }
  })