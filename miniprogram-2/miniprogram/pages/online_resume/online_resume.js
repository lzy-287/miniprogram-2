Page({
    data: {
      resume: {
        basicInfo: {},
        jobStatus: '',
        advantage: '',
        expectation: {},
        experience: [],
        project: [],
        education: [],
        certificate: [],
      },
      resumeId: '',
      isDefault: false,
      autoSaveTimer: null
    },
  
    onLoad() {
      this.initResume()
    },
  
    onShow() {
      this.loadResume()
    },
  
    /** 初始化在线简历 */
    async initResume() {

        try {
      
          const res = await wx.cloud.callFunction({
            name: 'getUserResume',
            data: { type: 'online' }
          })
      
          const list = res.result?.data || []
      
          if (!list.length) {
      
            const db = wx.cloud.database()
      
            await db.collection('resumes').add({
              data: {
                type: 'online',
                version: 1,
                isDefault: false,
                content: this.data.resume,
                referralChain: [],
                aiScore: 0,
                createTime: db.serverDate(),
                updateTime: db.serverDate()
              }
            })
          }
      
        } catch (err) {
          console.error('initResume error', err)
        }
      },
  
    /** 加载在线简历 */
    async loadResume() {

        try {
      
          const res = await wx.cloud.callFunction({
            name: 'getUserResume',
            data: { type: 'online' }
          })
      
          const list = res.result?.data || []
      
          if (list.length) {
      
            const data = list[0]
      
            this.setData({
              resume: {
                ...this.data.resume,
                ...data.content
              },
              resumeId: data._id,
              isDefault: data.isDefault || false
            })
      
          } else {
      
            this.setData({
              resumeId: '',
              isDefault: false
            })
      
          }
      
        } catch (err) {
          console.error('loadResume error', err)
        }
      },
  
    /** 设置默认 */
    async setDefaultResume() {
      if (!this.data.resumeId) return
  
      try {
        wx.showLoading({ title: '设置中...' })
  
        await wx.cloud.callFunction({
          name: 'setDefaultResume',
          data: {
            resumeId: this.data.resumeId
          }
        })
  
        wx.showToast({ title: '已设为默认简历' })
  
        // 直接更新前端状态
        this.setData({ isDefault: true })
  
      } catch (err) {
        wx.showToast({ title: '操作失败', icon: 'none' })
      } finally {
        wx.hideLoading()
      }
    },
  
    /** 自动保存 */
    autoSave(updatedSection, data) {

        this.setData({
          [`resume.${updatedSection}`]: data
        })
      
        if (this.data.autoSaveTimer)
          clearTimeout(this.data.autoSaveTimer)
      
        this.data.autoSaveTimer = setTimeout(async () => {
      
          if (!this.data.resumeId) return
      
          const db = wx.cloud.database()
      
          try {
      
            await db.collection('resumes')
              .doc(this.data.resumeId)
              .update({
                data: {
                  content: this.data.resume,
                  updateTime: db.serverDate()
                }
              })
      
          } catch (err) {
            console.error('autoSave error', err)
          }
      
        }, 1000)
      },
  
    //页面跳转  
    goBasicInfo() {
        wx.navigateTo({
          url: `/pages/resume_edit/basic_info/basic_info?resumeId=${this.data.resumeId}`
        })
    },
    goJobStatus() {
        wx.navigateTo({
          url: `/pages/resume_edit/job_status/job_status?resumeId=${this.data.resumeId}`
        })
    },
    goAdvantage() {
        wx.navigateTo({
          url: `/pages/resume_edit/advantage/advantage?resumeId=${this.data.resumeId}`
        })
    },
    goExpectation() {
        wx.navigateTo({
          url: `/pages/resume_edit/expectation/expectation_letter/expectation_letter?resumeId=${this.data.resumeId}`
        })
    },
    goExperience() {
        wx.navigateTo({
          url: `/pages/resume_edit/experience/experience_list/experience_list?resumeId=${this.data.resumeId}`
        })
    },
    goProject() {
         wx.navigateTo({ url: `/pages/resume_edit/project/project_list/project_list?resumeId=${this.data.resumeId}`
        }) 
    },
    goEducation() {
        wx.navigateTo({
          url: `/pages/resume_edit/education/education_list/education_list?resumeId=${this.data.resumeId}`
        })
    },
    goCertificate() {
        wx.navigateTo({
          url: `/pages/resume_edit/certificate/certificate_list/certificate_list?resumeId=${this.data.resumeId}`
        })
    }
  })