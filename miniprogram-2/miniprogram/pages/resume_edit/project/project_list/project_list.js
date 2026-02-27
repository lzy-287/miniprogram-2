Page({
    data: {
      projectList: [],
      resumeId: '' // 当前在线简历的 resumeId
    },
  
    onShow() {
      if (this.data.resumeId) {
        this.loadProject()
      } else {
        // 从上一页传过来的 resumeId
        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]
        if (prevPage && prevPage.data.resumeId) {
          this.setData({ resumeId: prevPage.data.resumeId }, () => {
            this.loadProject()
          })
        }
      }
    },
  
    async loadProject() {
      if (!this.data.resumeId) return
      const db = wx.cloud.database()
  
      try {
        const res = await db.collection('resumes').doc(this.data.resumeId).get()
        this.setData({
          projectList: res.data.content.project || []
        })
      } catch (err) {
        console.error('loadProject error', err)
        wx.showToast({ title: '加载失败', icon: 'none' })
      }
    },
  
    addProject() {
      if (!this.data.resumeId) return
      wx.navigateTo({
        url: `/pages/resume_edit/project/project_letter/project_letter?mode=add&resumeId=${this.data.resumeId}`
      })
    },
  
    editProject(e) {
      const id = e.currentTarget.dataset.id
      if (!this.data.resumeId) return
      wx.navigateTo({
        url: `/pages/resume_edit/project/project_letter/project_letter?mode=edit&id=${id}&resumeId=${this.data.resumeId}`
      })
    }
  })