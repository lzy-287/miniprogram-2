Page({
    data: {
      pendingResumeCount: 0,
      approvedResumeCount: 0,
      passRate: 0,
      showLogoutDialog: false
    },
  
    onLoad() {
      const userInfo = wx.getStorageSync('userInfo');
      if (!userInfo || userInfo.role !== 'teacher') {
        wx.redirectTo({ url: '/pages/login/login' });
        return;
      }
      this.loadStats();
    },
  
    loadStats() {
      // TODO: 数据库查询统计
      this.setData({
        pendingResumeCount: 0,
        approvedResumeCount: 0,
        passRate: 0
      });
    },
  
    confirmLogout() { this.setData({ showLogoutDialog: true }); },
    cancelLogout() { this.setData({ showLogoutDialog: false }); },
    logout() {
      wx.cloud.callFunction({
        name: 'deleteUser',
        data: { openid: wx.getStorageSync('userInfo').openid },
        success: () => {
          wx.clearStorageSync();
          wx.redirectTo({ url: '/pages/login/login' });
        }
      });
    }
  });
  