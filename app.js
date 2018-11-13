//app.js
App({
  serverUrl: "http://192.168.2.66:8080",
  userInfo: null,

  setGlobalUserInfo: function (user) {
    wx.setStorageSync("userInfo", user);
  },
})