const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const assess_id = options.assessId
    const history = options.history == 'true'?true:false
    const user_type_id = options.user_type_id
    app.request({
      fun: 'get_apply_info',
      data: {
       assess_id 
      }
    }).then(res => {
      if (Boolean(res.data.flag)) {
        console.log(res.data)
        this.setData({
          obj: res.data.data,
          history,
          assess_id,
          user_type_id
        })
      }
    })
  },


  agree(){
    this.submit_determine(3)
  },

  disagree(){
    this.submit_determine(2)
  },


  submit_determine(is_agree){
    app.request({
      fun: 'submit_determine',
      data: {
       assess_id: this.data.assess_id,
       user_type_id:this.data.user_type_id,
       is_agree
      }
    }).then(res => {
      if (Boolean(res.data.flag)) {
        this.setData({
          obj: res.data.data,
          history:this.data.history
        })
        wx.navigateTo({
          url:"/pages/book/book"
        })
      }
    })
  }




})