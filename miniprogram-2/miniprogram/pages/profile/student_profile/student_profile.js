Page({
    data: {
      defaultAvatar: '/assets/default_avatar.png',
      userInfo: {},
      pendingCount: 0,
      approvedCount: 0,
      showLogoutDialog: false
    },
  
    onLoad() {
      const userInfo = wx.getStorageSync('userInfo');
      if (!userInfo) {
        wx.redirectTo({ url: '/pages/login/login' });
        return;
      }
      this.setData({ userInfo });
      this.loadStats();
    },
  
    loadStats() {
      // TODO: 根据数据库集合查询统计数据
      this.setData({
        pendingCount: 0,
        approvedCount: 0
      });
    },
  
    navigateToResumeOnline() {
      wx.navigateTo({ url: '/pages/resume/resume_online' });
    },
  
    navigateToResumeUpload() {
      wx.navigateTo({ url: '/pages/resume/resume_upload' });
    },
  
    navigateToResumeAI() {
      wx.navigateTo({ url: '/pages/resume/resume_ai' });
    },
  
    confirmLogout() {
      this.setData({ showLogoutDialog: true });
    },
  
    cancelLogout() {
      this.setData({ showLogoutDialog: false });
    },
  
    logout() {
      wx.cloud.callFunction({
        name: 'deleteUser',
        data: { openid: this.data.userInfo.openid },
        success: () => {
          wx.clearStorageSync();
          wx.redirectTo({ url: '/pages/login/login' });
        },
        fail: () => {
          wx.showToast({ title: '注销失败', icon: 'error' });
        }
      });
    }
  });
  