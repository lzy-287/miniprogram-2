Page({
    data: {
      role: '',
      roleText: '',
      defaultAvatar: '/assets/default_avatar.png',
      form: {
        name: '',
        avatarFileID: '',
        avatarUrl: '',
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
  
    /** ✅ 原生小程序写法 */
    onInputChange(e) {
      const field = e.currentTarget.dataset.field;
      const value = e.detail.value;
  
      this.setData({
        [`form.${field}`]: value
      });
    },
  
    /** 选择并上传头像 */
    onChooseAvatar() {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          const filePath = res.tempFilePaths[0];
          const cloudPath = `avatar/${Date.now()}-${Math.random()}.jpg`;
  
          wx.showLoading({ title: '上传中' });
  
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: uploadRes => {
              wx.hideLoading();
              this.setData({
                'form.avatarFileID': uploadRes.fileID,
                'form.avatarUrl': filePath
              });
            },
            fail: () => {
              wx.hideLoading();
              wx.showToast({ title: '上传失败', icon: 'error' });
            }
          });
        }
      });
    },
  
    onSubmit() {
      const { form, role } = this.data;
  
      if (!form.name) {
        wx.showToast({ title: '请填写姓名', icon: 'none' });
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
  
          wx.redirectTo({
            url: {
              student: '/pages/profile/student_profile/student_profile',
              alumni: '/pages/profile/alumni_profile/alumni_profile',
              teacher: '/pages/profile/teacher_profile/teacher_profile'
            }[role]
          });
        }
      });
    }
  });
  