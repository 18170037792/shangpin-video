const app = getApp()

Page({
    data: {

    },

    doRegist:function(e){
      //获取事件对象
      var formObject = e.detail.value;
      var username=formObject.username;
      var password=formObject.password;

      
      var serverUrl=app.serverUrl;
      //发起请求
      wx.request({
        url: serverUrl +'/regist', 
        method: 'POST',
        data: {
          username: username,
          password: password
        },
        header: {
          'content-type': 'application/json' 
        },
        success(res) {
          console.log(res.data)
          var status = res.data.code;
          if(status == 200){
            //消息提示
            wx.showToast({
              title: '注册成功',
              icon: 'none',
              duration: 2000
            }),
              app.userInfo = res.data.data;
          }else if(status == 400){
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })  
   }
})