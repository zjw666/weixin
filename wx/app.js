//app.js
App({
  globalData: {
    userInfo: null,
    openid: null
  },
  onLaunch: function () {
    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
          wx.request({
            url: '*********',
            data: {
               code: res.code
            },
            success:function(result){
               if(result.data != 'none'){
                  that.globalData.openid = result.data;
               }else{
                 wx.showToast({
                   title: '登录失败',
                   icon: 'none',
                   duration: 1500,
                 })
               } 
            },
            fail:function(){
              wx.showToast({
                title: '网络错误',
                icon: 'none',
                duration: 1500
              })
            } 
          })
      },
      fail:function(){
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500,
        })
      }
    })

  }
})
