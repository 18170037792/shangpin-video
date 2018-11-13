const app = getApp()

Page({
  data: {

  },

  onLoad: function (params){
    
  },

  // 登录  
  doLogin: function (e) {

    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
    var serverUrl = app.serverUrl;
  wx.login({
    success: function(res){
      //获取登录的临时凭证code,只存在五分钟
      var code = res.code;
      if (code){
        //调用后端
        wx.request({
          url: serverUrl +'/user/mpLogin?code'+code,
          method: 'POST',
          success: function(result){
            console.log("code:"+code);
          }
        })
      }else{
        wx.showToast({
          title: '登录失败',
          mask: true,
          image: '../resource/images/failed.jpg',
          duration: 2000,
        })
      }
      
    }
  })



    // //var me = this;
    // var formObject = e.detail.value;
    // var username = formObject.username;
    // var password = formObject.password;
    // // 简单验证
    // if (username.length == 0 || password.length == 0) {
    //   wx.showToast({
    //     title: '用户名或密码不能为空',
    //     icon: 'none',
    //     duration: 3000
    //   })
    // } else {
    //   var serverUrl = app.serverUrl;
    //   wx.showLoading({
    //     title: '请等待',
    //   });
    //   // 调用后端
    //   wx.request({
    //     url: serverUrl + '/user/login',
    //     method: "POST",
    //     data: {
    //       username: username,
    //       password: password
    //     },
    //     header: {
    //       'content-type': 'application/json'
    //     },
    //     success(res) {
    //       console.log("数据:"+res.data)
    //       var status = res.data.code;
    //       //隐藏Loading提示框
    //       wx.hideLoading();
    //       if (status == 200) {
    //         //消息提示
    //         wx.showToast({
    //           title: '登录成功',
    //           icon: 'success',
    //           duration: 2000
    //         }),
    //           app.userInfo = res.data.data;
    //       } else if (status == 400) {
    //         wx.showToast({
    //           title: res.data.msg,
    //           mask: true,
    //           icon: 'none',
    //           duration: 2000
    //         })
    //       }
    //     }
    //   })
    // }
  },

  goRegistPage: function () {
    wx.redirectTo({
      url: '../userRegist/regist',
    })
  }
})