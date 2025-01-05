// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperItems:[
      {imageUrl:'https://www.slashgear.com/wp-content/uploads/2021/01/tesla-roadster-3.jpg',
      title:'ModelS',
      config:[
        {title:"234", subtitle:"公里续航"},
        {title:"345", subtitle:"公航"},
        {title:"456", subtitle:"里续"},
      ]},
      {imageUrl:'https://1cars.org/wp-content/uploads/2019/07/Tesla-Model-X1.jpg',
      title:'ModelT',
      config:[
        {title:"234", subtitle:"公里续航"},
        {title:"345", subtitle:"公航"},
        {title:"456", subtitle:"里续"},
      ]},
      {imageUrl:'https://gaadiwaadi.com/wp-content/uploads/2021/03/Tesla-Model-I-front-angle-1280x720.jpg',title:'ModelV',
      config:[
        {title:"234", subtitle:"公里续航"},
        {title:"345", subtitle:"公航"},
        {title:"456", subtitle:"里续"},
      ]}
    ],
    currentSwiperIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onSwiperChange(e) {
    // console.log(e)
    const {current} = e.detail
    // const current = e.detail.current
    this.setData({
      currentSwiperIndex:current
    })
  },


  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})