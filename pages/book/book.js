var app = getApp()
Page({
  data: {
    header: {
      bgcolor: "#5677fc",
      line: true
    },
    midday: 36.7,
    is_opentime:false,
    page: 0,
    morning: 36.5,
    inform: '',
    tempAvg: 35.6,
    tempData: [
    ],
    time: '',
    isSubmit: false,
    tabbar: [ "历史", "预约"],
    winHeight: "", //窗口高度
    currentTab: 1, //预设当前项的值
    scrollLeft: 1, //tab标题的滚动条位置
    history: false,
    classify: ['未审核', '未通过', '已通过'],
    _index: '0'

  },


  goUser(){
    wx.navigateTo({
      url: '../user/user',
    })
  },


  onShow(){
    
    app.request({
      fun: 'apply_user_info',
      data: {}
    }).then((res) => {
      console.log(res);
      if (Number(res.data.is_ok) == 0) {
        this.setData({
          userInfo: res.data.data
        })
        if(Number(res.data.data.user_type_id) != 1){
          this.setData({tabbar: [ "历史", "预约","审核"]})
        }





        //登陆成功
      } else {
        wx.showToast({
          icon: 'none',
          title: res.data.message
        })
        wx.reLaunch({
          url: '../login/login',
        })
      }
    }).catch((err) => {
      console.log(err);
      wx.showToast({
        icon: 'none',
        title: err
      })
    });
  },
  commit:function(e){
    console.log(e.detail)
    app.request({
      fun: 'submit_apply',
      data: {
        sex: e.detail.formData.sex,
        id_num: e.detail.formData.idcard,
        tel: e.detail.formData.mobile,
        lib_num: e.detail.formData.labnum,
        is_leave: e.detail.formData.isLeft,
        is_hot: e.detail.formData.isSick,
        date: e.detail.date,
        transportation: e.detail.formData.carnum,
        remake: e.detail.formData.desc,
        week_num:e.detail.weeknum,
        week:e.detail.formData.week,
        lib_name:e.detail.formData.labname,
        remake_leave:'',
        remake_hot:''
      }
    }).then((res) => {
      console.log(res);
      if (Number(res.data.is_ok) == 0) {
        wx.showToast({
          title: res.data.message
        })
        that.setData({
          disable:1
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: res.data.message
        })
      }
    }).catch((err) => {
      console.log(err);
      wx.showToast({
        icon: 'none',
        title: err
      })
    });

  },
  timing:function(){

    var thi_=this;
    var time = this.formatTime(new Date());
    this.setData({
      time: time
    });
    var week = new Date().getDay();  
    if(!(week < 4 && week > 0 )){
      this.setData({disable:2})
    }
    var timerTem = setTimeout(function () {
    thi_.timing()
    
    }, 5000)
    
     
    
    },
  onLoad: function () {

    let that = this;
    this.timing()
    this._getWeeknum()


    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        let calc = res.windowHeight; //顶部脱离文档流了(- res.windowWidth / 750 * 100);
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  formatTime: function (date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    return year + "年" + month + "月" + day + "日"
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    //console.log(e)
    let that = this;
    that.setData({
      currentTab: e.detail.current
    });
    that.checkCor();
    if(e.detail.current==0){
      this.history(1)
    }
    if(e.detail.current==2){
      this.apply(1)
    }
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    let cur = e.currentTarget.dataset.current;
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    let that = this;
    if (that.data.currentTab > 3) {
      that.setData({
        scrollLeft: 300
      })
    } else {
      that.setData({
        scrollLeft: 0
      })
    }
  },


  //选择type类型  1为未审核，2为未通过，3为通过。
  classify(e) {
    let _index = e.detail.value;
    if (this.data.history) {
      this.history(Number(_index) + 1)
    } else {
      this.apply(Number(_index) + 1)
    }

    this.setData({
      _index
    })
  },

  //进入卡片详情页面
  enterDetail(e) {
    const assess_id = e.detail.assess_id //预约号
    const history = this.data.history
    const user_type_id = this.data.userInfo.user_type_id
    wx.navigateTo({
      url: `/pages/detail/index?assessId=${assess_id}&history=${history}&user_type_id=${user_type_id}`
    })

  },
  //进入历史列表
  history(type) {
    app.request({
      fun: 'get_apply_list',
      data: {
        page: 1,
        item: 30,
        employee_id: this.data.userInfo.employee_id
      }
    }).then(res => {
      if (Boolean(res.data.flag)) {
        this.setData({
          list: res.data.data,
          history: true
        })
      }
    })
  },

  apply(type) {
    app.request({
      fun: 'get_determine_list',
      data: {
        page: 1,
        item: 30,
        employee_id: this.data.userInfo.employee_id,
        type
      }
    }).then(res => {
      if (Boolean(res.data.flag)) {
        this.setData({
          list: res.data.data,
          history: false
        })
      }
    })
  },

  async downloadUrl(fileName){
    return  setTimeout((res)=>{
        app.request({
          fun: 'export_downLoad',
          data: {
          fileName
          }
        }).then(res => {
          if (Boolean(res.data.flag)) {
          return new Promise(res.data.data)
          }
        })
      },2000)
  },
  _getWeeknum(){
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    this.data.now = Y + '-' + M + '-' + D
    const week_num = Math.ceil(this._checkDate('2020-3-1') / 7) + 2
    this.setData({
      week_num
    })
  },  
  async downloadExcel() {
    return app.request({
       fun: 'export_table',
       data: {
         week_num:this.data.week_num,
       }
     }).then(res => {
       if (Boolean(res.data.flag)) {
         return res.data.data.url
       }
     })
   },
 
   async openExcel() {
     // wx.login({
     //   complete: (res) => {
     //     console.log(res.code)
     //   },
     // })
     wx.showLoading({
       mask: true
     })
     const url = await this.downloadExcel()
     //const url = await this.downloadUrl(fileName)
 
     // wx.downloadFile({
     //   url:url, //仅为示例，并非真实的资源
     //   success: res => {
     //       wx.openDocument({
     //         filePath: res.tempFilePath,
     //         fileType: "xlsx",
     //         success: res => {
     //           wx.hideLoading()
     //         },
     //         fail: res => {
     //           console.log('fail:', res)
     //         }
     //       })
     //   }
     // })
     var excelUrl = url
     wx.showModal({
       title: '是否下载Excel',
       content: `链接: ${excelUrl}`,
       success(res) {
         if (res.confirm) {
           wx.setClipboardData({
             data: excelUrl,
             success: res => {
               wx.showToast({
                 title: "已复制链接,请到浏览器下载",
                 icon: "none",
                 duration: 3500
               })
             }
           })
         }
       }
     })
   },
  _checkDate: function (startTime) {
    var start_date = new Date(startTime.replace(/-/g, "/"));
    var end_date = new Date(this.data.now.replace(/-/g, "/"));
    //转成毫秒数，两个日期相减
    var ms = end_date.getTime() - start_date.getTime();
    //转换成天数
    var day = parseInt(ms / (1000 * 60 * 60 * 24));
    //do something
    return day
  }






})