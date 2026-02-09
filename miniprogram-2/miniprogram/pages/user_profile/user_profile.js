// pages/user_profile/user_profile.js
Page({
    data: {
      userInfo: {}
    },
  
    onLoginTap() {
      wx.navigateTo({
        url: '/pages/login/login'
      });
    },
  
    onNavigateToAbout() {
      wx.navigateTo({
        url: '/pages/about/about'
      });
    }
  });
  