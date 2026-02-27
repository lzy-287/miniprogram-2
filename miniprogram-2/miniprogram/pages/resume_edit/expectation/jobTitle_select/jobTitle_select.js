Page({
    data: {
      positionList: [
        { name: '全部', checked: false },
        { name: '前端开发', checked: false },
        { name: '后端开发', checked: false },
        { name: '设计师', checked: false },
        { name: '测试工程师', checked: false },
        { name: '产品经理', checked: false },
        { name: '运维工程师', checked: false },
        { name: '数据分析师', checked: false },
        { name: '人工智能', checked: false },
        { name: '算法工程师', checked: false }
      ],
      resumeId: '' // 父页面传递
    },
  
    onLoad(options) {
      if (options.resumeId) this.setData({ resumeId: options.resumeId })
    },
  
    toggleSelect(e) {
      const index = e.currentTarget.dataset.index
      let list = this.data.positionList
  
      if (index === 0) {
        const newStatus = !list[0].checked
        list = list.map(item => ({ ...item, checked: newStatus }))
      } else {
        list[index].checked = !list[index].checked
        const allSelected = list.slice(1).every(item => item.checked)
        list[0].checked = allSelected
      }
  
      this.setData({ positionList: list })
    },
  
    async confirmSelect() {
      const selected = this.data.positionList
        .filter((item, index) => index !== 0 && item.checked)
        .map(item => item.name)
  
      if (!selected.length) {
        wx.showToast({ title: '请至少选择一个职位', icon: 'none' })
        return
      }
  
      const jobTitle = selected.join('、')
      if (!this.data.resumeId) return
  
      const db = wx.cloud.database()
      try {
        await db.collection('resumes')
          .doc(this.data.resumeId)
          .update({
            data: {
              'content.expectation.jobTitle': jobTitle,
              updateTime: db.serverDate()
            }
          })
  
        // 同步回上一页
        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]
        if (prevPage) prevPage.setData({ 'form.jobTitle': jobTitle })
  
        wx.navigateBack()
      } catch (err) {
        console.error(err)
        wx.showToast({ title: '保存失败', icon: 'none' })
      }
    }
  })