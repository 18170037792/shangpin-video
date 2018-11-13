const app = getApp()

Page({
    data: {

    },

    doRegist:function(e){
      //获取事件对象
      var formObject = e.detail.value;
      var username=formObject.username;
      var password=formObject.password;

      // 简单验证
      if (username.length == 0 || password.length == 0) {
        wx.showToast({
          title: '用户名或密码不能为空',
          mask: true,
          icon: 'none',
          duration: 3000
        })
      } else {
      var serverUrl=app.serverUrl;
      wx.showLoading({
        title: '请稍等',
        mask: true, //透明蒙层，防止触摸穿透
      });
      //发起请求
      wx.request({
        url: serverUrl +'/user/regist', 
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
          //隐藏Loading提示框
          wx.hideLoading();
          if(status == 200){
            //消息提示
            wx.showToast({
              title: '注册成功',
              icon: 'success',
              duration: 2000
            }),
              app.userInfo = res.data.data;
          }else if(status == 400){
            wx.showToast({
              title: res.data.msg,
              mask: true,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })  
    }
   },

  goLoginPage: function(){
    wx.navigateTo({
      url: '../userLogin/login',
    })
  }
})