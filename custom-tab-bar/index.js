
Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/icon/icon-home@2x.png",
      selectedIconPath: "/icon/icon-home-pre@2x.png",
      text: ""
    }, {
      pagePath: "/pages/me/me",
      iconPath: "/icon/icon-me@2x.png",
      selectedIconPath: "/icon/icon-me-pre@2x.png",
      text: ""
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})