Page({
    data: {
      defaultAvatar: '/assets/default_avatar.png',
      isLoggedIn: false,
      userInfo: {},
      userType: '',
      // 设置初始统计数据为 0
      pendingCount: 0,
      approvedCount: 0,
      postCount: 0,
      successCount: 0,
      pendingResumeCount: 0,
      teacherPending: 0,
      teacherApproved: 0,
      passRate: 0
    },
  
    async onShow() {
      const userInfo = wx.getStorageSync('userInfo');
      const userType = wx.getStorageSync('userType');
  
      if (!userInfo) {
        this.setData({
          isLoggedIn: false,
          userInfo: {},
          userType: ''
        });
        return;
      }
  
      // 若头像仍为 fileID，再转一次
      if (userInfo.avatar && userInfo.avatar.startsWith('cloud://')) {
        const res = await wx.cloud.getTempFileURL({
          fileList: [userInfo.avatar]
        });
        userInfo.avatar = res.fileList[0].tempFileURL;
        wx.setStorageSync('userInfo', userInfo);
      }
  
      this.setData({
        isLoggedIn: true,
        userInfo,
        userType
      });
  
      // 获取统计数据
      this.getUserStats(userType, userInfo.openid);
    },
  
    getUserStats(userType, openid) {
      wx.cloud.callFunction({
        name: 'getUserStats',
        data: { userType, openid },
        success: res => {
          if (res.result) {
            this.setData({
              pendingCount: res.result.pendingCount,
              approvedCount: res.result.approvedCount,
              postCount: res.result.postCount,
              successCount: res.result.successCount,
              pendingResumeCount: res.result.pendingResumeCount,
              teacherPending: res.result.teacherPending,
              teacherApproved: res.result.teacherApproved,
              passRate: res.result.passRate
            });
          }
        },
        fail: err => {
          console.error(err);
        }
      });
    },
  
    logout() {
      wx.showModal({
        title: '确认注销',
        content: '确定注销账号吗？',
        success: res => {
          if (res.confirm) {
            wx.cloud.callFunction({
              name: 'deleteUser',
              data: { openid: this.data.userInfo.openid },
              success: () => {
                wx.clearStorageSync();
                this.setData({
                  isLoggedIn: false,
                  userInfo: {},
                  userType: ''
                });
                wx.switchTab({
                  url: '/pages/login/login' // 跳转到登录页面
                });
              }
            });
          }
        }
      });
    },
  
    goLogin() {
      wx.navigateTo({
        url: '/pages/login/login'
      });
    },
  
    goResumeOnline() {
      wx.navigateTo({
        url: '/pages/online_resume/online_resume'
      });
    },
  
    goResumeUpload() {
      wx.navigateTo({
        url: '/pages/upload_resume/upload_resume'
      });
    },
  
    goResumeAI() {
      wx.navigateTo({
        url: '/pages/ai_resume/ai_resume'
      });
    }
  });