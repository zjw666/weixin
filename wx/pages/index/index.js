//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '欢迎使用迷你计算器',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showModel:false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = res.userInfo
              this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              });
            }
          })
          this.redirect();
        } else {
          this.setData({
            showModel:true
          });
        }
      }
    })
  },

  closeModel:function(e){
    this.setData({
        showModel:false
    });
  },

  getUserInfo: function(e) {
    if (e.detail.userInfo){
      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
      this.redirect();
    }else{
      this.setData({
        motto: '请先同意授权，才能使用本小程序',
        userInfo: {
            avatarUrl:'no.jpg'
        }
      })
    }
  },

  redirect:function(){
      var setTimeoutId = setTimeout(function(){
          wx.redirectTo({
            url: '../cal/cal',
          });
      },1500); 
  }
})
