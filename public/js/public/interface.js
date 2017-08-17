// JavaScript Document

var AjaxInterface = {
	ajaxReq:function(type, url, data, success, fnBeforSend, fnComplet, fnRetError){
		var async = arguments[7]?false: true;
		$.ajax({
			type: type,
			url: url,
			data: data,
			async: async,
			success: success,
			beforeSend: fnBeforSend,
			complete: fnComplet,
			error: fnRetError
		});
	},
	ajaxDomainReq:function(type, url, data, success, fnBeforSend, fnComplet, fnRetError){
		$.ajax({
			type: type,
			url: url,
			data: data,
			async: true,
			dataType:"jsonp",
			jsonp:"callback",
			timeout:10000,
			success: success,
			beforeSend: fnBeforSend,
			complete: fnComplet,
			error: fnRetError
		});
	},
	fnBeforSend:function(xmlHttpRequest){
		$("#loading").show();
	},
	fnComplet:function(xmlHttpRequest){
		var readyState = xmlHttpRequest.readyState;
		var httpCode = xmlHttpRequest.status;
		if(httpCode != 200){
			//alert(httpCode);
		}

        $("#loading").hide();
	},
	fnRetError:function(xmlHttpRequest, textStatus, errorThrown){
		
	}
};

var AndroidInterface = {
	loadComplete:function(bFlag, nCode){
		window.TTWindowWebInterface.onLoadComplete(bFlag, nCode);
	},
	openUrl:function(strCardId, strPosition, strTitle, strUrl){
		window.TTWindowWebInterface.openUrl(strCardId, strPosition, strTitle, strUrl);
	}
};

/**
 * @param mode  1为日间模式，2为夜间模式，
 * @returns {boolean}
 */
var changeMode = function(mode) {
    if (!isNaN(mode)) {
        mode = parseInt(mode);
    }
    $('link[title]').each(function(){
        this.disabled = true;
        this.disabled = (this.title != mode);
    });
    return true;
}

var alertModal = function(strMessage){
	$("#alertcontent").html(strMessage);
	$("#alertbutton").click();
}

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
