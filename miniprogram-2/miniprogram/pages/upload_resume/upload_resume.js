Page({

    data: {
      fileInfo: null,
      fileSizeMB: 0,
      resumeId: '',
      isDefault: false,
      maxSize: 20 * 1024 * 1024,
      uploading: false
    },
  
    onShow() {
      this.loadResume()
    },
  
    /* ================= 加载附件简历 ================= */
    async loadResume() {

        try {
      
          const res = await wx.cloud.callFunction({
            name: 'getUserResume',
            data: { type: 'attachment' }
          })
      
          const list = res.result?.data || []
      
          if (list.length) {
      
            const data = list[0]
            const fileInfo = data.fileInfo || {}
      
            this.setData({
              fileInfo,
              fileSizeMB: fileInfo.fileSize
                ? (fileInfo.fileSize / 1024 / 1024).toFixed(2)
                : 0,
              resumeId: data._id,
              isDefault: data.isDefault || false
            })
      
          } else {
      
            this.setData({
              fileInfo: null,
              fileSizeMB: 0,
              resumeId: '',
              isDefault: false
            })
      
          }
      
        } catch (err) {
      
          wx.showToast({ title: '加载失败', icon: 'none' })
      
        }
      },
  
    /* ================= 选择文件 ================= */
    chooseFile() {
  
      if (this.data.uploading) return
  
      wx.chooseMessageFile({
        count: 1,
        type: 'file',
        extension: ['doc', 'docx', 'pdf'],
        success: (res) => {
  
          const file = res.tempFiles[0]
          if (!file) return
  
          if (file.size > this.data.maxSize) {
            wx.showToast({ title: '文件超过20MB', icon: 'none' })
            return
          }
  
          this.uploadFile(file)
        }
      })
    },
  
    /* ================= 上传文件 ================= */
    async uploadFile(file) {
        if (this.data.uploading) return
      
        const db = wx.cloud.database()
        const openid = wx.getStorageSync('openid')
        this.setData({ uploading: true })
        let loadingShown = false
      
        try {
          wx.showLoading({ title: '上传中...' })
          loadingShown = true
      
          const cloudPath = `resume/${openid}-${Date.now()}-${file.name}`
          const uploadRes = await wx.cloud.uploadFile({
            cloudPath,
            filePath: file.path
          })
      
          const fileInfo = {
            fileName: file.name,
            fileUrl: uploadRes.fileID,
            fileSize: file.size,
            fileType: file.name.split('.').pop(),
            uploadTime: db.serverDate()
          }
      
          // 查询是否存在附件简历
          const query = await db.collection('resumes')
            .where({ _openid: openid, type: 'attachment' })
            .limit(1)
            .get()
      
          if (query.data.length) {
            // 更新现有附件简历
            await db.collection('resumes').doc(query.data[0]._id).update({
              data: { fileInfo, updateTime: db.serverDate() }
            })
            this.setData({
              fileInfo,
              fileSizeMB: (file.size / 1024 / 1024).toFixed(2),
              resumeId: query.data[0]._id
            })
          } else {
            // 新增附件简历
            const addRes = await db.collection('resumes').add({
              data: {
                type: 'attachment',
                version: 1,
                isDefault: false,
                fileInfo,
                referralChain: [],
                content: {},
                aiScore: 0,
                createTime: db.serverDate(),
                updateTime: db.serverDate()
              }
            })
            this.setData({
              fileInfo,
              fileSizeMB: (file.size / 1024 / 1024).toFixed(2),
              resumeId: addRes._id
            })
          }
      
          wx.showToast({ title: '上传成功' })
      
        } catch (err) {
          console.error('上传失败', err)
          wx.showToast({ title: '上传失败', icon: 'none' })
        } finally {
          if (loadingShown) wx.hideLoading()
          this.setData({ uploading: false })
        }
      },
  
    /* ================= 设为默认 ================= */
    async setDefaultResume() {
        if (!this.data.resumeId) return
        let loadingShown = false
      
        try {
          wx.showLoading({ title: '设置中...' })
          loadingShown = true
      
          const res = await wx.cloud.callFunction({
            name: 'setDefaultResume',
            data: { resumeId: this.data.resumeId }
          })
      
          if (res.result?.success) {
            wx.showToast({ title: '已设为默认' })
            this.setData({ isDefault: true }) // 前端直接更新状态
          } else {
            wx.showToast({ title: res.result?.message || '操作失败', icon: 'none' })
          }
        } catch (err) {
          console.error(err)
          wx.showToast({ title: '操作失败', icon: 'none' })
        } finally {
          if (loadingShown) wx.hideLoading()
        }
      },
  
    /* ================= 删除附件简历 ================= */
    async deleteResume() {
  
      if (!this.data.resumeId) return
  
      const db = wx.cloud.database()
  
      try {
  
        await db.collection('resumes')
          .doc(this.data.resumeId)
          .remove()
  
        this.setData({
          fileInfo: null,
          resumeId: '',
          isDefault: false,
          fileSizeMB: 0
        })
  
        wx.showToast({ title: '已删除' })
  
      } catch (err) {
  
        wx.showToast({ title: '删除失败', icon: 'none' })
  
      }
    }
  
  })