//app.js
App({
  onLaunch: function() {
    wx.login({
      complete: (res) => {
        console.log(res.code)
      },
    })
  },
  request:({
    fun,
    data,
    success,
    fail
 })=>{
  wx.showLoading({
    title: '加载中',
  });
  return new Promise(function (resolve, reject) {
    wx.login({
      complete: (res) => {

        wx.request({
          url: 'https://hbxfzzb.com/fun=' + fun ,
          method:"POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data:{
            code:res.code,
            ...data
          },
          success: (res) => {
            wx.hideLoading();
            resolve(res)
          },
          fail: function (res) {
            wx.hideLoading();
            reject(res)
          },
          complete: function () {
            wx.hideLoading()
          }

        })
      },
    })})

  },
  
  globalData: {
    host:""
  }
})