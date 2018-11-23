const app = getApp()

Page({
  data: {
    faceImage: "../resource/images/noneface.png",
    isMe: true,
    isFollow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
          wx.uploadFile({
            url: serverUrl + '/upload/image?userId=' + user.id,
            filePath: tempFilePaths,
            name: 'file',
            header: {
              'content-type': 'application/json',
              'headerUserId': user.id,
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
        }else{
          wx.showToast({
            title: '上传图片不能大于2M!',
            icon: 'none',
            duration: 2000,
            mask: true,
          })
        }
      },
    })
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