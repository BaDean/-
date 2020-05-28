const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
        employee_id: 100600,
        name: "张三",
        college: "统战部",
        assess_id: "127390412370",
        date: "2020-03-02",
        is_ok_yuanbu: 3, //1为未审核，2为未通过，3为通过。
        is_ok_keyanyuan: 2
      },
      {
        employee_id: 100600,
        name: "张三",
        college: "统战部",
        assess_id: "127390412370",
        date: "2020-03-02",
        is_ok_yuanbu: 3, //1为未审核，2为未通过，3为通过。
        is_ok_keyanyuan: 2
      },
      {
        employee_id: 100600,
        name: "张三",
        college: "统战部",
        assess_id: "127390412370",
        date: "2020-03-02",
        is_ok_yuanbu: 3, //1为未审核，2为未通过，3为通过。
        is_ok_keyanyuan: 2
      },
      {
        employee_id: 100600,
        name: "张三",
        college: "统战部",
        assess_id: "127390412370",
        date: "2020-03-02",
        is_ok_yuanbu: 3, //1为未审核，2为未通过，3为通过。
        is_ok_keyanyuan: 2
      },
      {
        employee_id: 100600,
        name: "张三",
        college: "统战部",
        assess_id: "127390412370",
        date: "2020-03-02",
        is_ok_yuanbu: 3, //1为未审核，2为未通过，3为通过。
        is_ok_keyanyuan: 2
      }
    ],
    history: false,
    classify: ['未审核', '未通过', '已通过'],
    _index: '0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.apply(1)
    this.history(1)
  },


  //选择type类型  1为未审核，2为未通过，3为通过。
  classify(e) {
    let _index = e.detail.value;
    if(this.data.history){
      this.history(Number(_index)+1)
    }else{
      this.apply(Number(_index)+1)
    }
    
    this.setData({
      _index
    })
  },

  //进入卡片详情页面
  enterDetail(e) {
    const assess_id = e.detail.assess_id //预约号
    wx.navigateTo({
      url:`/pages/detail/index?assessId=${assess_id}`
    })
    
  },

  //进入历史列表
  history(type) {
    app.request({
      fun: 'get_apply_list',
      data: {
        page: 1,
        item: 30,
        type     
      }
    }).then(res => {
      if (Boolean(res.data.flag)) {
        this.setData({
          list: res.data.data,
          history:true
        })
      }
    })
  },

  //进入申请列表
  apply(type) {
    app.request({
      fun: 'get_determine_list',
      data: {
        page: 1,
        item: 30,
        type 
      }
    }).then(res => {
      if (Boolean(res.data.flag)) {
        this.setData({
          list: res.data.data,
          history:false
        })
      }
    })
  }


})