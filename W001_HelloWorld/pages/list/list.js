// pages/list/list.js
const dayMap = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"]
const app = getApp();
Page({
	data:{
		dailyWeather: [],
		location: '126.63,45.75'
	},

	onLoad(options){
		// console.log(options.latitude, options.longitude)
		this.setData({
			location: options.longitude + ',' +  options.latitude
		})
		this.getWeatherFuture7Day()
	},

	onPullDownRefresh(){
		this.getWeatherFuture7Day(()=>{
			wx.stopPullDownRefresh()
		})
	},

	getWeatherFuture7Day(callback){
		console.log(this.data.location)
		wx.request({
			url:'https://devapi.qweather.com/v7/weather/7d?',
			data:{
				// 注意location 的顺序是 longitude  +  latitude
				location: this.data.location, //'116.41,39.92',
				key: app.globalData.apikey
			},
			success: res => {
				console.log("getWeatherFuture7Day", res);
				let result = res.data;
				this.setWeatherDaily(result);
			},
			complete: ()=>{
				callback && callback()
			}
		  })
	},

	setWeatherDaily(result){
		// set forecast
		let dailyWeather = [];
		for(let i=0; i<7; i+=1){
			let date = new Date();
			date.setDate(date.getDate() + i);
			dailyWeather.push({
				day: dayMap[date.getDay()],
				date: result.daily[i].fxDate,
				iconPath : "/images/icons/" + result.daily[i].iconDay + ".svg",
				temp: `${result.daily[i].tempMin}° - ${result.daily[i].tempMax}°`
			})
		}
		dailyWeather[0].day = "今天";
		this.setData({
			dailyWeather : dailyWeather
		})
	},
})