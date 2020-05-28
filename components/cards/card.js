// components/card/card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    obj:{
      type:Object,
      value:{
      }
    },
    history:{
      type:Boolean,
    },
    admin:{
      type:Boolean,
      value:true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    detail(){
      this.triggerEvent('enterDetail', {assess_id:this.properties.obj.assess_id}, {})
    }
  }
})
