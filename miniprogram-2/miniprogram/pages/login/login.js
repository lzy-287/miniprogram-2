// pages/login/login.js
Page({
    data: {
      selectedRole: 'student' // 默认身份
    },
  
    onRoleChange(e) {
      this.setData({
        selectedRole: e.detail.value
      });
    },
  
    async onLoginTap() {
      const role = this.data.selectedRole;
  
      wx.showLoading({ title: '登录中...' });
  
      wx.login({
        success: res => {
          if (!res.code) {
            wx.hideLoading();
            wx.showToast({ title: '登录失败', icon: 'error' });
            return;
          }
  
          // 调用云函数：判断是否已注册
          wx.cloud.callFunction({
            name: 'login',
            data: { role, code: res.code }, // 确保云函数用 code 换 openid
            success: cloudRes => {
              wx.hideLoading();
  
              const result = cloudRes.result;
  
              // 未注册 → 去注册页面
              if (!result.isRegistered) {
                wx.redirectTo({
                  url: `/pages/register/register?role=${role}`
                });
                return;
              }
  
              // 已注册 → 登录成功
              const userInfo = result.userInfo;
  
              wx.setStorageSync('openid', result.openid);
              wx.setStorageSync('userInfo', userInfo);
              wx.setStorageSync('userType', userInfo.role);
  
              // 按身份跳转个人中心
              this.redirectByRole(userInfo.role);
            },
            fail: () => {
              wx.hideLoading();
              wx.showToast({ title: '登录失败', icon: 'error' });
            }
          });
        }
      });
    },
  
    redirectByRole(role) {
        wx.switchTab({
          url: '/pages/user_profile/user_profile'
        });
      }
  });
  