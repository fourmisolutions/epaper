angular.module('epaper')

// See Hua epaper API
.constant('ShApiConstants', {
	
	/* 
	 * Handling CORS issues for 'ionic serve'
	 * 
	 * Ref: http://blog.ionic.io/handling-cors-issues-in-ionic/
	 * Proxied path is defined in ionic.config.json
	 * 
	 * Options:
	 * - true: when need to test run using 'ionic serve' or 'ionic run -l'
	 * - false: when test run using 'ionic run' or 'ionic emulate' or during UAT or Production
	 */ 
	useProxy : false,
	
	// Used only when running 'ionic serve' or 'ionic run -l' for testing
	// Note: this is a relative path
	baseUrlProxied : '/shapi-proxy',
    
	// Used when running 'ionic run' or 'ionic emulate' or during UAT or Production
	baseUrl : 'http://shepaper.theborneopost.com', // development, UAT
	//baseUrl : 'http://xxx.theborneopost.com', // production
	
	breakingNewsListUrl : '/breaking-news.json',
	
	seehuaEpaperListUrl : '/epaper.json',
	
	seehuaTodayListUrl : '/today-news.json',
	
	pushNotificationUrl : '/epaper_rest_server/push_notifications',
	
	sessionTokenUrl : '/services/session/token',
	
	loginUrl : '/epaper_rest_server/user/login',
	
	logoutUrl : '/epaper_rest_server/user/logout',
	
	chineseMenuDictionary : {'A': '南砂', 'B': '中区', 'C': '北砂', 'D': '新華日報', 'E': '西沙', 'F': '东沙', 'G': '西马', 'H': '体育', 'I': '国际', 'J': '娱乐', 'K': '副刊', 'L': '财经', 'M': '豆苗' }

})


// Google Analytics
.constant('GaConstants', {
	
	// refer to GA Admin > Property > Property Settings
	trackingId : 'UA-52578245-2',
	
	// default is 30 seconds, shortened for testing purpose only
	dispatchInterval : 15,
	
	// screen names constants
	scrnNameBreakingNews : 'Breaking News',
	scrnNameTodaySeeHua : 'Today SeeHua',
	scrnNameSeeHuaEpaper : 'SeeHua epaper'
	
})
;
