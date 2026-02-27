Page({
    data: {
      experienceList: [],
      resumeId: ''
    },
  
    onShow() {
      this.loadExperience()
    },
  
    onLoad(options) {
      if (options.resumeId) this.setData({ resumeId: options.resumeId })
    },
  
    async loadExperience() {
      if (!this.data.resumeId) return
  
      const db = wx.cloud.database()
      try {
        const res = await db.collection('resumes')
          .doc(this.data.resumeId)
          .get()
  
        if (res.data) {
          this.setData({
            experienceList: res.data.content.experience || []
          })
        }
      } catch (err) {
        console.error('loadExperience error', err)
      }
    },
  
    addExperience() {
      wx.navigateTo({
        url: `/pages/resume_edit/experience/experience_letter/experience_letter?mode=add&resumeId=${this.data.resumeId}`
      })
    },
  
    editExperience(e) {
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/resume_edit/experience/experience_letter/experience_letter?mode=edit&id=${id}&resumeId=${this.data.resumeId}`
      })
    }
  })