const form = require("../../components/utils/formValidation.js")
var app = getApp()
Component({
  data: {

    type: 1,
    startYear: 1980,
    endYear: 2030,
    weeknum:0,
    cancelColor: "#888",
    color: "#5677fc",
    setDateTime: "",
    result: ""
  },
  options: {

  },
  properties: {
    showButton: {
			type: Boolean,
			value:true
    },
    showButtons: {
			type: Boolean,
			value:false
		},
		sex: {
			type: String,
			value:'无'
		},
		idcard: {
			type: String,
			value:''
    },
    mobile: {
			type: String,
			value:''
    },
    labnum: {
			type: String,
			value:''
    },
    labname: {
			type: String,
			value:''
    },
    isLeft: {
			type: Number,
			value:3
    },
    isSick: {
			type: Number,
			value:3
    },
    week: {
			type: Array,
			value:[]
    },
    weeknum: {
			type: Number,
			value:0
    },
    disable: {
			type: Number,
			value:0
    },
    carnum: {
			type: String,
			value:''
    },
    desc: {
			type: String,
			value:''
    },   
     autoWeek: {
			type: Boolean,
			value:true
    },
    collegeid:{
			type: String,
			value:''
    }, 
    college:{
			type: String,
			value:''
    }
  },
  ready() {
    var that = this
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
//获取年份  
    var Y =date.getFullYear();
//获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
//获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
    this.data.now =  Y + '-'  + M+ '-' + D
    if(this.data.autoWeek){
      this.setData({
        weeknum:Math.ceil(this.checkDate('2020-3-1') / 7) + 2
      })
    }
    setTimeout(function () {
    
      app.request({
        fun: 'before_request',
        data: { week_num:that.data.weeknum }
      }).then((res) => {
        console.log(res);
        if (Number(res.data.is_ok) == 0) {
          if(res.data.data.is_requested == 1){
            that.setData({
              disable:1
            })
          }
          that.setData({
            peoples_of_week:res.data.data.peoples_of_week
          })
  
          //登陆成功
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



      // app.request({
      //   fun: 'get_apply_num',
      //   data: {college_id:that.data.collegeid,college:that.data.college,week_num:that.data.weeknum}
      // }).then((res) => {
      //   console.log(res);
      //   if (Number(res.data.is_ok) == 0) {
      //     console.log('ok')
  
      //     //登陆成功
      //   } else {
      //     wx.showToast({
      //       icon: 'none',
      //       title: res.data.message
      //     })
      //   }
      // }).catch((err) => {
      //   console.log(err);
      //   wx.showToast({
      //     icon: 'none',
      //     title: err
      //   })
      // });
      }, 1000)
   
  },
  methods: {


    checkDate: function(startTime) {
      var start_date = new Date(startTime.replace(/-/g, "/"));
      var end_date = new Date(this.data.now.replace(/-/g, "/"));
      //转成毫秒数，两个日期相减
      var ms = end_date.getTime() - start_date.getTime();
      //转换成天数
      var day = parseInt(ms / (1000 * 60 * 60 * 24));
      //do something
      return day
 },
 addDate: function(startTime,day) {
  //日期格式化
  var start_date = new Date(startTime.replace(/-/g, "/"));
  var ms = day * (1000 * 60 * 60 * 24);
  //转成毫秒数，两个日期相减
  var end_date =new Date(start_date.getTime() + ms) ;
  //转换成天数

  //do something
  return  end_date.getFullYear() + '-' + (Number(end_date.getMonth()) + 1) + '-' +end_date.getDate() 
},
    change: function (e) {
      console.log(e)
      this.setData({
        result: e.detail.result,
        tableDay: e.detail.day,
        tableMonth: e.detail.month,
        tableYear: e.detail.year
      })
    },
    agree(){
      this.triggerEvent('agree');
    },
    disagree(){
      this.triggerEvent('disagree');
    },
    formSubmit: function(e) {
      //表单规则
      let rules = [{
        name: "sex",
        rule: ["required"],
        msg: ["请选择性别"]
      }, {
        name: "idcard",
        rule: ["required", "isIdCard"],
        msg: ["请输入身份证号码", "请输入正确的身份证号码"]
      }, {
        name: "mobile",
        rule: ["required", "isMobile"],
        msg: ["请输入手机号", "请输入正确的手机号"]
      }, {
        name: "labnum",
        rule: ["required"],
        msg: ["请输入房间号"]
      },{
        name: "isLeft",
        rule: ["required"],
        msg: ["请选择是否离开过本市"]
      }, {
        name: "isSick",
        rule: ["required"],
        msg: ["请选择是否有发热、乏力、干咳等症状"]
      }, {
        name: "week",
        rule: ["required"],
        msg: ["请选择日期"]
      },  {
        name: "carnum",
        rule: ["required"],
        msg: ["请输入车牌号"]
      },{
        name: "desc",
        rule: ["required"],
        msg: ["请输入必要说明"]
      }];
      //进行表单检查
      let formData = e.detail.value;
      
      let checkRes = form.validation(formData, rules);
        //var date = this.addDate('2020-3-1',((this.data.weeknum-2) * 7) + Number(formData.week))

      if (checkRes) {
        this.triggerEvent('commit', {formData: formData,weeknum:this.data.weeknum,date:this.data.now});
      } else {
        wx.showToast({
          title: checkRes,
          icon: "none"
        });
      }
    },
    formReset: function(e) {
      console.log("清空数据")
    }
  }
})


