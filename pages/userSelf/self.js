const app = getApp()

Page({
  data: {
    faceUrl: "../resource/images/faceImage.jpg",
    isMe: true,
    isFollow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me = this;
    var user = app.userInfo;
    var serverUrl = app.serverUrl;
    wx.showLoading({
      title: '请稍后',
    });
    //调用后端,获取个人资料
    wx.request({
      url: serverUrl + '/user/userPersonal?userId=' + user.id,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res){
        var status = res.data.code;
        wx.hideLoading();
        if(status == 200){
          var userInfo = res.data.data;
          //是否授权登录用户信息
          if (userInfo.openId !=null 
              && userInfo.openId !='' && userInfo.openId != undefined){
            if (userInfo.faceImage != null
              && userInfo.faceImage != '' && userInfo.faceImage != undefined) {
              me.setData({
                faceUrl: userInfo.faceImage
              });
            }
          }else{
            if (userInfo.faceImage != null  
              && userInfo.faceImage != '' && userInfo.faceImage != undefined){
              me.setData({
                faceUrl: serverUrl + userInfo.faceImage
              });
            }
          }
          
          me.setData({
            userId: userInfo.userId,
            fansCounts: userInfo.fansCounts,
            followCounts: userInfo.followCounts,
            receiveLikeCounts: userInfo.receiveLikeCounts,
            nickname: userInfo.nickname,
            signature: userInfo.signature,
            school: userInfo.school,
            gender: userInfo.gender,
            birthday: userInfo.birthday,
            place: userInfo.place,
            email: userInfo.email
          });
          
        }else if(status == 400){
          wx.showToast({
            title: res.data.msg,
            duration: 3000,
            icon: "none"
          })
        }
      }
    })

    app.personal = me.data;
    // /**将参数传递给下一个页面*/
    //this.addInfomation(me.data);
  },

  /**编辑个人资料*/
  addInfomation: function () {
    wx.navigateTo({
      url: '../personal/personal',
    })
  },

  

  /**上传头像*/
  changeFace: function(){
    var me = this;
    console.log(me)
     wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album','camera'],
      success: function(res) {
        //文件在微信服务器的临时路径
        var tempFilePaths = res.tempFilePaths[0];
        console.log(tempFilePaths)
        var tempFilesSize = res.tempFiles[0].size;
        console.log(tempFilesSize)
        //判断文件大小
        if (tempFilesSize <= 2000000) {
          wx.showLoading({
            title: '正在上传',
          })
          var serverUrl = app.serverUrl;
          var user = app.userInfo;
          if (user.openId == null || user.openId == '') {
           wx.uploadFile({
            url: serverUrl + '/upload/image?userId=' + user.id,
            filePath: tempFilePaths,
            name: 'file',
            header: {
              'content-type': 'application/json',
              'userId': user.id,
            },
            success: function (res) {
              //转成json对象
              var data = JSON.parse(res.data);
              console.log(data);
              wx.hideLoading();
              if (data.code == 200) {
                wx.showToast({
                  title: '上传成功',
                  icon: 'success'
                });

                var imageUrl = data.data;
                console.log(imageUrl);
                //setData方法多用于点击后改变页面信息
                //或者刷新后与后台交互获取最新的信息
                me.setData({
                  faceUrl: serverUrl + imageUrl
                });

              }
            }
          })
          } else if (user.openId != null
            && user.openId != '' && user.openId != undefined){
            wx.showToast({
              title: '微信用户不能更换头像!',
              icon: 'none',
              duration: 2000,
              mask: true,
            })
         }
        }else{
          wx.showToast({
            title: '上传图片不能大于2M!',
            icon: 'none',
            duration: 2000,
            mask: true,
          })
        }
      },
    });
  },

  logout: function(){
    var user = app.userInfo;
    console.log(user);
    var serverUrl = app.serverUrl;
    wx.showLoading({
      title: '请稍候',
    });
    //调用后端接口
    wx.request({
      url: serverUrl + '/user/logout',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success(res){
        console.log(res.data)
        var status = res.data.code;
        //隐藏Loading提示框
        wx.hideLoading();
        if (status == 200) {
          //消息提示
          wx.showToast({
            title: '退出成功',
            icon: 'success',
            duration: 2000
          });
          app.userInfo = null;
          wx.navigateTo({
            url: '../userLogin/login',
          })
        }
      }
    })
  }
})