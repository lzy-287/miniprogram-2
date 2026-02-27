Page({
    data: {
      role: '',
      roleText: '',
      form: {
        name: '',
        gender: 'male',
        school: '',
        major: '',
        company: '',
        title: ''
      }
    },
  
    onLoad(options) {
      const role = options.role;
      if (!role) {
        wx.navigateBack();
        return;
      }
  
      this.setData({
        role,
        roleText: {
          student: '学生',
          alumni: '校友',
          teacher: '老师'
        }[role]
      });
    },
  
    onInputChange(e) {
      const field = e.currentTarget.dataset.field;
      const value = e.detail.value;
      this.setData({
        [`form.${field}`]: value
      });
    },
  
    onGenderChange(e) {
      this.setData({
        'form.gender': e.detail.value
      });
    },
  
    onSubmit() {
      const { form, role } = this.data;
  
      if (!form.name) {
        wx.showToast({ title: '请输入姓名', icon: 'none' });
        return;
      }
  
      wx.showLoading({ title: '注册中...' });
  
      wx.cloud.callFunction({
        name: 'register',
        data: { role, form },
        success: res => {
          wx.hideLoading();
  
          if (!res.result.success) {
            wx.showToast({ title: res.result.message, icon: 'error' });
            return;
          }
  
          wx.setStorageSync('userInfo', res.result.userInfo);
          wx.setStorageSync('userType', role);
  
          wx.switchTab({
            url: '/pages/user_profile/user_profile'
          });
        }
      });
    }
  });
  