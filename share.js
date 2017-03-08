/* Flyme wechat SDK sharing plugin 
	author: cupblue
	git: https://github.com/cupblue/flymelight
*/
var $$ = {
	//jsonp自定义2
    getJSON: function(url, params, callbackFuncName, callback){
    	// url += '&' + callbackFuncName + '=jsonpfunc';
    	url += '&' + callbackFuncName + '=jsonp' + Math.floor(Math.random()*1000000);
        var paramsUrl = "",
            jsonp = this.getQueryString(url)[callbackFuncName];
        for(var key in params){
            paramsUrl += "&" + key + "=" + encodeURIComponent(params[key]);
        }
        url += paramsUrl;
        window[jsonp] = function(data) {
            window[jsonp] = undefined;
            try {
                delete window[jsonp];
            } catch(e) {}
            if (head) {
                head.removeChild(script);
            }
            callback(data);
        };
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.charset = "UTF-8";
        script.src = url;
        script.async = true;
        head.appendChild(script);
        return true;
    },
    getQueryString: function(url) {
        var result = {}, queryString = (url && url.indexOf("?")!=-1 && url.split("?")[1]) || location.search.substring(1),
            re = /([^&=]+)=([^&]*)/g, m;
        while (m = re.exec(queryString)) {
            result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }
        return result;
    }
};

//判断某个值是否在数组中
Array.prototype.in_array = function (e) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == e)
            return true;
    }
    return false;
}

//判断某个值在数组中的位置
Array.prototype.indexOf = function (e) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == e)
            return i;
    }
    return -1;
}

/**
 * 对String对象扩展
 */
String.prototype.format = function(){
	if( arguments.length == 0 ){
		return null;
	}
	var str = arguments[0];
    for(var i=1;i<arguments.length;i++) {
        var re = new RegExp('\\{' + (i-1) + '\\}','gm');
        if(arguments[i] == undefined){
        	arguments[i] = '';
        }
        str = str.replace(re, arguments[i]);
    }
    return str;
}

//字符串去首尾空格
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.trimAll = function () {
    return this.replace(/\s+/g, "");
}
/**
 * 创建一个String对象的实例
 */
var FlymeStr = new String();

var Flyme = window.Flyme || {
	timer: undefined,
	execTime: 0,
	timerCallback: undefined,

	//跨浏览器绑定事件
	addEvent: function(obj, evt, fn) {
	    if (!obj) { return; }
	    if (obj.addEventListener) {
	        obj.addEventListener(evt, fn, false);
	    } else if (obj.attachEvent) {
	        obj.attachEvent('on' + evt, fn);
	    } else {
	        obj["on" + evt] = fn;
	    }
	},

	//跨浏览器取消事件绑定
	delEvt: function(obj, evt, fn) {
	    if (!obj) { return; }
	    if (obj.removeEventListener) {
	        obj.removeEventListener(evt, fn, false);
	    } else if (obj.detachEvent) {
	        obj.detachEvent("on" + evt, fn);
	    }
	},

	//完美判断是否为网址
	isURL: function(strUrl) {
	    var regular = /^\b(((https?|http):\/\/)?[-a-z0-9]+(\.[-a-z0-9]+)*\.(?:com|edu|gov|int|mil|net|org|biz|info|name|museum|asia|coop|aero|[a-z][a-z]|((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))\b(\/[-a-z0-9_:\@&?=+,.!\/~%\$]*)?)$/i
	    if (regular.test(strUrl)) {
	        return true;
	    } else {
	        return false;
	    }
	},

	// 判断输入是否是有效的电子邮件 
	isEmail: function(str) {
	    var result = str.match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/);
	    if (result == null) {
	    	return false;
	    }
	    return true;
	},

	//移动电话
	checkMobile: function(str) {
	    if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(str))) {
	        return false;
	    }
	    return true;
	},

	//判断对象是否为空
	isEmptyObj: function(obj){
		if(obj === undefined){
			return true;
		}
		for(v in obj){
			if(obj.hasOwnProperty(v)){
				return false;
			}
		}
		return true;
	},
	
	//判断字符串是否为空
	isNull: function(val){
		if(val === undefined || val.toString().trim() === ''){
			return true;
		}
		return false;
	},
	
	showMsg: function(msg){
		alert(msg);
	},
	
	logJson: function(json){
		if(this.isDebug()){
			console.log(JSON.stringify(json));
		}
	},
	
	/** 是否是debug模式*/
	isDebug: function(){
		var hf = location.href;
		
		if(hf.indexOf("feiliu.com") != -1){
			return false;
		}
		return true;
	},
	
	//日期格式化
	formatDate: function(timestamp){
		var date = new Date(timestamp);
		
		var year = date.getFullYear();
		var month = (date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) : (date.getMonth()+1);
		var day = date.getDate();
		
		return year+"-"+month+"-"+day;
	},
	
	//验证手机号码
	validatePhone: function(val,nullTips){
		val = val.trimAll();
		var phonegi = /^(13|14|15|17|18)[0-9]{9}$/; 
		if(nullTips && this.isNull(val)){
			this.showMsg('请输入手机号码');
			return false;
		}
		if(!this.isNull(val) && !phonegi.test(val)){
			this.showMsg('请输入正确的手机号码');
			return false;
		}
		return true;
	},
	
	/**
	 * 执行倒计时操作(所有单位 秒)
	 * execTime 持续时间
	 * delay 间隔时间
	 * timerCallback 回调事件
	 */
	newScheduledTask: function(execTime,delay,timerCallback){
		this.execTime = execTime;
		this.timerCallback = timerCallback;
		this.timer = window.setInterval('Flyme.timeDownSelector()',delay*1000);
	},
	
	timeDownSelector: function(){
		if(this.execTime > 1){
			this.execTime--;
			this.timerCallback && this.timerCallback(this.execTime);
			return;
		}
		window.clearInterval(this.timer);
		this.timer = undefined;
	},
	
	//验证动态码
	validateDynamicCode: function(val){
		if(this.isNull(val)){
			this.showErrorMsg('请输入手机动态码');
			return false;
		}
		if(!(/[0-9]{6}/).test(val)){
			this.showErrorMsg('手机动态码必须为6位数字');
			return false;
		}
		return true;
	},
	
	// 微信分享
	wxShareInit: function(wxid, shareid, openid, settings) {
		if (window.wx) {
			if (Flyme.isNull(wxid)) {
				Flyme.logJson("Error:wxid is NULL");
				return null;
			}

			openid = openid ? openid : '';

			Flyme.loadSignAPI(wxid, shareid, openid, Flyme.signAPICallback);

			if (settings) {
				settings.openid = openid;
				Flyme.defineShareAPI(settings, Flyme.shareConfigSettings);
			} else {
				// 若未传入自定义setting，则取后台活动记录的setting配置
				Flyme.loadShareAPI(shareid, openid, Flyme.shareConfigSettings);
			} 
			
		}else{
			if(Flyme.isDebug()){
				alert("请引入依赖的微信js代码库");
			}
		}
	},
	
	/** 加载签名信息*/
	loadSignAPI: function(wxid, shareid, openid, callback){
		var url = encodeURIComponent(location.href.split('#')[0]);
		$$.getJSON(FlymeStr.format(Flyme.signAPIUrl(), wxid, shareid, openid, url), {}, "callback", function(data){
		    if(data == null){
				data = {};
			}
			callback && callback(data);
		});
	},

	/** 加载分享参数*/
	loadShareAPI: function(shareid, openid, callback){
		$$.getJSON(FlymeStr.format(Flyme.shareAPIUrl(), shareid, openid), {}, "callback", function(data){
		    if (data == null) {
				data = {}; 
			} 
			data.openid = openid;
			callback && callback(data);
		});
	},


	/** 自定义分享参数*/
	defineShareAPI: function(settings, callback){
		settings && callback(settings);
	},

	// stype 分享去向 
	shareSuccess: function(stype, settings){	
		var informUrl = '';
		informUrl = FlymeStr.format(Flyme.setShareInfoUrl(), stype, settings.share_id, settings.openid);
		$$.getJSON(informUrl, {}, "callback", function(data){
		    if(!data){
				data = {};
			}
			if(data.status !== 1){ 
				alert('分享失败');
			}
		}); 

	},
	
	
	/** 加签名回调*/
	signAPICallback: function (json) {
		Flyme.wxObjConfigInit(json);
	},
	
	/** wx配置信息*/
	wxObjConfigInit: function(json){
		wx.config({
		    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		    appId: json.appId, // 必填，公众号的唯一标识
		    timestamp: json.timestamp,// 必填，生成签名的时间戳
		    nonceStr: json.nonceStr, // 必填，生成签名的随机串
		    signature: json.signature,// 必填，签名，见附录1
		    jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo",
		                "startRecord", "stopRecord", "onVoiceRecordEnd", "playVoice", "pauseVoice",
		                "stopVoice", "onVoicePlayEnd", "uploadVoice", "downloadVoice", "chooseImage", 
		                "previewImage", "uploadImage", "downloadImage", "translateVoice", "getNetworkType",
		                "openLocation", "getLocation", "hideOptionMenu", "showOptionMenu", "hideMenuItems",
		                "showMenuItems", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "closeWindow",
		                "scanQRCode", "chooseWXPay", "openProductSpecificView", "addCard", "chooseCard", "openCard"
		                ]// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});
	},
	
	/** 获取加签地址*/
	signAPIUrl: function(){
		return "http://wechat.zdsmart.cn/wxshare/getSignature?wxid={0}&shareid={1}&openid={2}&url={3}";
	}, 

	/** 获取分享参数*/
	shareAPIUrl: function(){ 
		return "http://wechat.zdsmart.cn/wxshare/getShareSettings?shareid={0}&openid={1}"; 
	},

	/** 活动分享后续处理 */
	setShareInfoUrl: function(){
		return "http://wechat.zdsmart.cn/wxshare/setShareInfo?stype={0}&shareid={1}&openid={2}";
	},
 

	/** 分享接口参数配置*/
	shareConfigSettings: function(settings){
		if(! settings || ! settings.share_id || !settings.share_link || !settings.share_image || !settings.share_title || !settings.share_desc){
			Flyme.logJson('Error:Response settings ERROR:{id,link,imgUrl,title,desc}');
			return;
		}
		window.wx && wx.ready(function(){
			//分享到朋友圈
			wx.onMenuShareTimeline({
				'link': settings.share_link,
		        'imgUrl': settings.share_image,
		        'title': settings.share_title,
		        trigger: function(res) {
		        	// alert(JSON.stringify(settings));
				},
			    success: function (res) {
			    	Flyme.shareSuccess(1, settings);
			    },
			    cancel: function (res) {
			    },
			    fail: function(res) {
				}
			});

			//分享给好友
			wx.onMenuShareAppMessage({
				'link': settings.share_link,
		        'imgUrl': settings.share_image,
		        'title': settings.share_title,
		        'desc': settings.share_desc,
		        trigger: function(res) {
				},
			    success: function (res) {
			    	Flyme.shareSuccess(2, settings);
			    },
			    cancel: function (res) { 
			    },
			    fail: function(res) {
				}
			});

			// 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
			wx.onMenuShareQQ({
				'link': settings.share_link,
		        'imgUrl': settings.share_image,
		        'title': settings.share_title,
		        'desc': settings.share_desc,
				trigger: function(res) {
				},
				complete: function(res) {
				},
				success: function(res) {
					Flyme.shareSuccess(3, settings);
				},
				cancel: function(res) {
				},
				fail: function(res) {
				}
			});

			// 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
			wx.onMenuShareWeibo({
				'link': settings.share_link,
		        'imgUrl': settings.share_image,
		        'title': settings.share_title,
		        'desc': settings.share_desc,
				trigger: function(res) {
				},
				complete: function(res) {
				},
				success: function(res) {
					Flyme.shareSuccess(4, settings);
				},
				cancel: function(res) {
				},
				fail: function(res) {
				}
			});

		});
	},


	//转义html标签
	htmlEncode: function(text) {
	    return text.replace(/&/g, '&').replace(/\"/g, '"').replace(/</g, '<').replace(/>/g, '>');
	},
	 
	//设置cookie值
	setCookie: function(name, value, Hours) {
	    var d = new Date();
	    var offset = 8;
	    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	    var nd = utc + (3600000 * offset);
	    var exp = new Date(nd);
	    exp.setTime(exp.getTime() + Hours * 60 * 60 * 1000);
	    document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString() + ";domain=feiliu.com;"
	},

	//获取cookie值
	getCookie: function(name) {
	    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
	    if (arr != null) return unescape(arr[2]);
	    return null
	},

}