Page({
    data: {
      defaultAvatar: '/assets/default_avatar.png',
      userInfo: {},
      postCount: 0,
      successCount: 0,
      pendingResumeCount: 0,
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
      // TODO: 数据库查询统计
      this.setData({
        postCount: 0,
        successCount: 0,
        pendingResumeCount: 0
      });
    },
  
    confirmLogout() { this.setData({ showLogoutDialog: true }); },
    cancelLogout() { this.setData({ showLogoutDialog: false }); },
    logout() {
      wx.cloud.callFunction({
        name: 'deleteUser',
        data: { openid: this.data.userInfo.openid },
        success: () => {
          wx.clearStorageSync();
          wx.redirectTo({ url: '/pages/login/login' });
        }
      });
    }
  });
  