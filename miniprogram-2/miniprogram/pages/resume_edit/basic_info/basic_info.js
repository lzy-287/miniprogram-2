Page({
    data: {
      form: {
        name: '',
        gender: '',
        identity: '',
        birthDate: '',
        currentCity: '',
        hukouCity: '',
        politicalStatus: '',
        phone: '',
        email: '',
        wechat: ''
      },
      resumeId: '' // 父页面传来的 resumeId
    },
  
    onLoad(options) {
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
  
        const basicInfo = res.data?.content?.basicInfo || {}
        this.setData({
          form: {
            ...this.data.form,
            ...basicInfo
          }
        })
      } catch (err) {
        console.error('loadData error', err)
      }
    },
  
    /** 输入监听 */
    onInput(e) {
      const field = e.currentTarget.dataset.field
      this.setData({
        [`form.${field}`]: e.detail.value
      })
    },
  
    onGenderChange(e) {
      this.setData({
        'form.gender': e.detail.value
      })
    },
  
    onIdentityChange(e) {
      this.setData({
        'form.identity': e.detail.value
      })
    },
  
    onBirthChange(e) {
      this.setData({
        'form.birthDate': e.detail.value
      })
    },
  
    /** 点击保存按钮 */
    async save() {
      if (!this.data.form.name) {
        wx.showToast({ title: '姓名不能为空', icon: 'none' })
        return
      }
  
      if (!this.data.resumeId) return
  
      const db = wx.cloud.database()
  
      try {
        await db.collection('resumes')
          .doc(this.data.resumeId)
          .update({
            data: {
              'content.basicInfo': this.data.form,
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