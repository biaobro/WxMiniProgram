// index.js
// convert english to chinese
const weatherMap = {
	'晴':'clear',
	'多云':'clouds',
	'少云':'clouds',
	'Clear': '晴天',
	'Clouds': '多云',
	'overcast': '阴',
	'lightrain': '小雨',
	'heavyrain': '大雨',
	'snow': '雪'
  }

const weatherColorMap = {
	'晴': '#cbeefd',
	'多云':'#deeef6',
	'少云':'#deeef6',
	'Clear': '#cbeefd',
	'Clouds': '#deeef6',
	'overcast': '#c6ced2',
	'lightrain': '#bdd5e1',
	'heavyrain': '#c5ccd0',
	'snow': '#aae1fc'
}

const app = getApp();

const QQMapWX = require('../../libs/qqmap-wx-jssdk.js')

const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

Page({
	data:{
		nowTemp : '',
		nowWeather : '',
		nowWeatherBackground: '',
		hourlyWeather: [],
		todayDate: '',
		todayTemp: '',
		cityName:'哈尔滨市',
		locationAuthType: UNPROMPTED,
		latitude:'45.75',//'39.92',
		longitude:'126.63',//'116.41'
	},

	// 编译后生效
	onPullDownRefresh: function(){
		this.getWeatherNow(()=>{
			wx.stopPullDownRefresh()
		}),
		console.log('onPullDownRefresh')
	},

	// 两个事件 都调用到 getWeatherNow 函数，但 onLoad 不需要调用 stopPullDownRefresh， 所以在 getWeatherNow 增加1个参数 callback， 当callback 不为空时就执行 callback 函数

	onLoad(){
		this.qqmapsdk = new QQMapWX({
			key: app.globalData.tecentLocationAPIKey, 
		}),
		wx.getSetting({
			success: res=>{
				let auth = res.authSetting['scope.userLocation'];
				console.log("wx.getSetting ", auth)
				// 根据 auth 改变【授权状态变量】和【授权状态文案】
				this.setData({
					locationAuthType: auth? AUTHORIZED : (auth === false) ? UNAUTHORIZED : UNPROMPTED
				})
			}
		})
		// 如果获得用户授权 则更新位置数据
		if(this.data.locationAuthType === AUTHORIZED){
			this.getLocationAndWeather()
			console.log("auth is ture", this.data.longitude, this.data.latitude)
		}
		// 如果没有获得用户授权（可能是首次加载，也可能是用户拒绝，也可能是用户为操作直接返回） 则使用默认位置数据
		else{
			console.log('auth is not true, get weather data with default location Harbin')
			this.getWeatherNow(),
			this.getWeatherFuture24Hour(),
			this.getWeatherToday()
		}
	},

	// 当前气温，展示在页面主体部分
	getWeatherNow(callback){
		wx.request({
			url:'https://devapi.qweather.com/v7/grid-weather/now?',
			data:{
				location: this.data.longitude + ',' + this.data.latitude, 
				key: app.globalData.qWeatherAPIKey
			},
			success: res => {
				// console.log("getWeatherNow : ",res);
				let result = res.data;
				this.setWeatherNow(result);
			},
			complete: ()=>{
				callback && callback()
			}
		  })
	},

	// 未来24小时天气，展示在页面底部
	getWeatherFuture24Hour(callback){
		wx.request({
			url:'https://devapi.qweather.com/v7/grid-weather/24h?',
			data:{
				location: this.data.longitude + ',' + this.data.latitude, 
				key: app.globalData.qWeatherAPIKey
			},
			success: res => {
				// console.log("getWeatherFuture24Hour", res);
				let result = res.data;
				this.setWeatherHourly(result);
			},
			complete: ()=>{
				callback && callback()
			}
		  })
	},

	// 得到当天气温范围，展示在页面中部
	getWeatherToday(callback){
		wx.request({
			url:'https://devapi.qweather.com/v7/weather/3d?',
			data:{
				location: this.data.longitude + ',' + this.data.latitude, 
				key: app.globalData.qWeatherAPIKey
			},
			success: res => {
				// console.log("getWeatherToday", res);
				let result = res.data;
				this.setWeatherToday(result);
			},
			complete: ()=>{
				callback && callback()
			}
		  })
	},

	setWeatherNow(result){
		let tempNow = Math.round(result.now.temp);
		let weatherNow = result.now.text;
		console.log(tempNow, weatherNow);
		this.setData({
			nowTemp: tempNow + '°',
			nowWeather : weatherNow,
			nowWeatherBackground : '/images/' + weatherMap[weatherNow] + '-bg.png',
		})
		wx.setNavigationBarColor({
			frontColor: '#000000',
			backgroundColor: weatherColorMap[weatherNow],
		})
	},

	setWeatherHourly(result){
		// set forecast
		let nowHour = new Date().getHours();
		let hourlyWeather = [];
		// 这里返回值中的时间是 "2024-01-21T13:00+00:00" 因为是+00:00 所以第1个元素就是当前时间
		for(let i=0; i<8; i+=1){
			hourlyWeather.push({
				time: (i*3 + nowHour)%24 + '时',
				iconPath : "/images/icons/" + result.hourly[i*3].icon + ".svg",
				temp: result.hourly[i*3].temp + '°'
			})
		}
		hourlyWeather[0].time = "现在";
		this.setData({
			hourlyWeather : hourlyWeather
		})
	},

	setWeatherToday(result){
		let date = new Date();
		this.setData({
			todayTemp: `${result.daily[0].tempMin}° - ${result.daily[0].tempMax}°`,
			todayDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`
		})
	},


	// 点击中部的未来天气区域，跳转list页面
	onTapDayWeather(){
		wx.navigateTo({
		  url: '/pages/list/list?latitude=' + this.data.latitude + '&longitude=' + this.data.longitude
		})
	},

	// 点击Location 区域
	onTapLocation(){
		// 如果未授权
		if(this.data.locationAuthType === UNAUTHORIZED){
			wx.openSetting({
				success: res=>{
					console.log("onTapLocation : ", res);
					let auth = res.authSetting['scope.userLocation'];
					if(auth){
						this.getLocationAndWeather()
					}
				}
			})
		}
		else{
			this.getLocationAndWeather()
		}
	},

	getLocationAndWeather(){
		// 因为this作用域指向问题 ，success函数实际是一个闭包 ， 无法直接通过this来setData, 以及访问 qqmapsdk
		var that = this;
		wx.getLocation({
			success:res=>{
				// console.log(res);
				// 返回值中包含 经纬度
				console.log("Current coordinate is : ", res.longitude, res.latitude);
				that.setData({
					latitude:res.latitude,
					longitude:res.longitude,
					locationAuthType: AUTHORIZED
				})

				// 只要成功得到经纬度信息 就获取天气数据
				this.getWeatherNow(),
				this.getWeatherFuture24Hour(),
				this.getWeatherToday(),

				// 逆地址解析，通过经纬度得到城市信息
				that.qqmapsdk.reverseGeocoder({
					// 入参 经纬度
					location:{
						latitude: res.latitude,
						longitude: res.longitude
					},
					// 返回值为具体的地址信息
					success:res=>{
						console.log("reverseGeocoder : ", res);
						// 返回中有 city， 也有 district， 例如 吕梁 - 汾阳，后者更具体
						let cityName = res.result.ad_info.district;
						let address = res.result.address;
						console.log("Current address is : ", address);
						that.setData({
							cityName:cityName
						})
					}
				})
			},
			fail:()=>{
				this.setData({
					locationAuthType: UNAUTHORIZED
				})
			}
		})
	}
})
