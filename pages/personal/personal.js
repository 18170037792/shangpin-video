const app = getApp()

Page({
  data:{

  },

  onLoad: function (params) {
    var me = this;
    var userInfo = app.personal;

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
      email: userInfo.email,
      faceUrl: userInfo.faceImage
    });
  },
})