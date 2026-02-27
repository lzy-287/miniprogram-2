Page({
    data: {
      cityList: [
        { name: '全部', checked: false },
        { name: '杭州', checked: false },
        { name: '北京', checked: false },
        { name: '南京', checked: false },
        { name: '上海', checked: false },
        { name: '成都', checked: false },
        { name: '广州', checked: false },
        { name: '武汉', checked: false },
        { name: '深圳', checked: false },
        { name: '西安', checked: false }
      ],
      resumeId: ''
    },
  
    onLoad(options) {
      if (options.resumeId) this.setData({ resumeId: options.resumeId })
    },
  
    toggleSelect(e) {
      const index = e.currentTarget.dataset.index
      let list = this.data.cityList
  
      if (index === 0) {
        const newStatus = !list[0].checked
        list = list.map(item => ({ ...item, checked: newStatus }))
      } else {
        list[index].checked = !list[index].checked
        const allSelected = list.slice(1).every(item => item.checked)
        list[0].checked = allSelected
      }
  
      this.setData({ cityList: list })
    },
  
    async confirmSelect() {
      const selected = this.data.cityList
        .filter((item, index) => index !== 0 && item.checked)
        .map(item => item.name)
  
      if (!selected.length) {
        wx.showToast({ title: '请至少选择一个城市', icon: 'none' })
        return
      }
  
      const location = selected.join('、')
      if (!this.data.resumeId) return
  
      const db = wx.cloud.database()
      try {
        await db.collection('resumes')
          .doc(this.data.resumeId)
          .update({
            data: {
              'content.expectation.location': location,
              updateTime: db.serverDate()
            }
          })
  
        // 同步回上一页
        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]
        if (prevPage) prevPage.setData({ 'form.location': location })
  
        wx.navigateBack()
      } catch (err) {
        console.error(err)
        wx.showToast({ title: '保存失败', icon: 'none' })
      }
    }
  })