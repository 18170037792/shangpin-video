const app = getApp()

Page({
  data: {

  },

  onLoad: function (params){
    
  },

  doLogin: function (e) {
    var me = this;
    var formObject = e.detail.value;
    var username = formObject.username;
    var password = formObject.password;
    // 简单验证
    if (username.length == 0 || password.length == 0) {
      wx.showToast({
        title: '用户名或密码不能为空',
        icon: 'none',
        duration: 3000
      })
    } else {
      var serverUrl = app.serverUrl;
      wx.showLoading({
        title: '请等待',
      });
      // 调用后端
      wx.request({
        url: serverUrl + '/user/login',
        method: "POST",
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
          if (status == 200) {
            //消息提示
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 2000
            }),
            app.userInfo = res.data.data;
            //设置用户全局缓存
            //app.setGlobalCache(res.data.data);
            wx.navigateTo({
              url: '../userSelf/self',
            })
          } else if (status == 400) {
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

  //用户授权登录
  doAuthLogin: function(e){
    //获取登录用户信息
    var wxUser = e.detail.userInfo;
    var nickName = wxUser.nickName;
    var avatarUrl = wxUser.avatarUrl;
    var serverUrl = app.serverUrl;
    wx.showLoading({
      title: '请稍等',
    })
    wx.login({
      success: function (res) {
      wx.hideLoading();
      //获取登录的临时凭证code,只存在五分钟
      var code = res.code;  
      if (code){
        //发送code给后端
        wx.request({
          url: serverUrl +'/weChat/mpLogin?code='+code,
          method: 'POST',
          data:{
            nickname: nickName,
            faceImage: avatarUrl,
          },
          success: function(result){
            var status = result.data.code;
            if(status == 200){
              //消息提示
              wx.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 2000
              }),
              app.userInfo = result.data.data;
              
              console.log(app.userInfo)
              wx.navigateTo({
                url: '../userSelf/self',
              })
            }else if(status == 400){
              wx.showToast({
                title: result.data.msg,
                mask: true,
                icon: 'none',
                duration: 2000
              })
            }
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
  });
 },

})