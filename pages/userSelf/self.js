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
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths)
        wx.showLoading({
          title: '正在上传',
        })
        var serverUrl = app.serverUrl;
        var user = app.userInfo;

        wx.uploadFile({
          url: serverUrl + '/upload/image?userId=' + user.id,
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'content-type': 'application/json',
            'headerUserId': user.id,
          },
          success: function(res){
            console.log(res.data)
          }
        })
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