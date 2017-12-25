/**
 * Created by linlu on 2017/11/19.
 */
var cheerio  = require('cheerio');
var express  = require('express');
var request  = require("request");
var router   = express.Router();
var fs       = require("fs");
var CryptoJS = require("crypto-js");
var $        = require("jquery");
var app      = express();
var iconv    = require('iconv-lite');//解决抓取gbk编码乱码

//var aesUtil = new AesUtil(keySize, iterationCount);
function setHeader(res) {
	//application/json
	//res.header("Content-Type", 'text/html; charset=utf-8')
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Access-Control-Allow-Headers", "Origin, No-Cache, X-Requested-With, Authorization, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With, X-Auth-Token");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("Content-Type", 'application/json; charset=utf-8')
	return res;
};


app.all('*', function (req, res, next) {
	//console.log(Auth[req.method][req._parsedUrl.pathname],req.method,req._parsedUrl.pathname,'-------headers--------')
	var token = req.headers.authorization;
	//console.log(token,'--------获取到的token----------')
	//console.log(req._parsedUrl.pathname,'-----------req._parsedUrl.pathname---------')
	setHeader(res);
	if (req.method == "OPTIONS") {
		res.status(200).send({});
	}/*让options请求快速返回*/
	else {
		//判断是否需要权限访问
		setHeader(res)
		next()
		//res.send(200);

	}
	;
});

//!function (n) {
//
//}(jQuery);
;(function (n) {
	console.log($.extend, 2222)
	//var e, r = function (n, r) {
	//	    return e = "402880bd5c76166f015c903ee811504e", n << r | n >>> 32 - r
	//    },
	//    c    = function (n, r, c) {
	//	    return e = "402880bd5c76166", n & c | r & ~c
	//    };
	//n.extend({
	//	ck: function (e, t, u, y, f, g) {
	//		null == u && (u = e, y = e, f = t);
	//		var o, p = c(t, e, u),
	//		    d    = n.encrypt(e + t + u),
	//		    i    = n.encrypt(y + f),
	//		    a    = r(e, t);
	//		p = 2147483648 & e, p += 2147483648 & t, p += o, p += o = 1073741824 & p, a = p = n.encrypt(e) + n.bs.encode(n.encrypt(t)) + u;
	//		var b = n.gen(p, a),
	//		    v = n.encrypt(d) + i;
	//		return f == t ? n.gen(b + n.gen(e, a), i) : n.gen(b + n.gen(e, a) + v, i)
	//	}
	//})
})($);


function getNowFormatDate() {
	var date       = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month      = date.getMonth() + 1;
	var strDate    = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
		+ " " + date.getHours() + seperator2 + date.getMinutes()
		+ seperator2 + date.getSeconds();
	return currentdate;
}
var iterationCount = 100;
var keySize        = 128;
var iv             = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
var salt           = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
console.log(iv, salt)

// index 对应验证码的key3
var fpdm  = "3100172320";
var fphm  = "75915829";
var kprq  = "20171211";
var kjje  = "278110";
var yzm   = "";
var yzmSj = "";

var param   = {
	'fpdm': fpdm,
	'fphm': fphm,
	'kprq': kprq,
	'fpje': kjje,
	'fplx': '04',
	yzm: "响",
	yzmSj: "2017-12-19 17:45:48",
	//'index': jmmy,
	'iv': iv,
	'salt': salt,
	//'publickey':$.ck(fpdm,fphm,kjje, kprq, yzmSj, yzm)
};
function getIp() {
	var ip = Math.ceil(Math.random(1, 254) * 100)
		+ "." + Math.ceil(Math.random(1, 254) * 100)
		+ "." + Math.ceil(Math.random(1, 254) * 100)
		+ "." + Math.ceil(Math.random(1, 254) * 100)
	return ip;
};
var _cookie = "usersession=GLpo2P-NV9YPvccYAofTHonnrsiU3GelYPQ0lGpZN2BtxT3jrbSd!-1131135163!1513587539853;Path=/;HTTPOnly;Secure; Max-Age=1"

app.get("/invoiceVerification", function (req, res) {
	invoiceVerification(req, res)
});
function invoiceVerification(req, res) {
	var obj = JSON.stringify({});
	var arr = fs.readFileSync(__dirname + "/data.js", 'utf-8');
	arr     = JSON.parse(arr);
	if(req.query.check && req.query.check !='false'){
		console.log(req.query.check,arr[req.query.fphm],0)
		res.send(200, arr[req.query.fphm])
	}else if (arr[req.query.fphm]) {
		var result = arr[req.query.fphm].match(/\(([^)]*)\)/)[1];
		result = JSON.parse(result);
		console.log(result['key1'],typeof result)
		if(result['key1'] === '001'){
			console.log(req.query.check,arr[req.query.fphm],1)
			res.send(200, arr[req.query.fphm])
		}else{
			console.log(req.query.check,arr[req.query.fphm],3)
			tonext()
		}
	} else {
		console.log(req.query.check,2)
		tonext();
	}
	function tonext(){
		req.query.fpje = req.query.code
		request({
			url: 'https://fpcyweb.tax.sh.gov.cn:1001/WebQuery/query',
			gzip: true,
			method: "get",
			rejectUnauthorized: false,
			encoding : null,
			//"Content-Type":"text/javascript;charset=gbk",
			headers: {
				//"Content-Type":"text/javascript;charset=gbk",
				"Cookie": "usersession=GLpo2P-NV9YPvccYAofTHonnrsiU3GelYPQ0lGpZN2BtxT3jrbSd!-1131135163!1513587539853;Path=/;HTTPOnly;Secure; Max-Age=1",
				rejectUnauthorized: false
			},
			qs: req.query
			//qs: {
			//	callback: "jQuery1102027553525322510763_1513589046570",
			//	fpdm: "3100172320",
			//	fphm: "75915829",
			//	fpje: "278110",
			//	fplx: "04",
			//	index: "4ee88f36dbf97f7ddc2fbb71668791b4",
			//	iv: "675282f1025796fcff341d48494e9165",
			//	kprq: "20171211",
			//	publickey: "373D843DE2DF4E837C393A38199E2529",
			//	salt: "e974a7c04e7145537a5d55f4b3b18115",
			//	yzm: "响",
			//	yzmSj: "2017-12-19 17:45:48",
			//	//yzmSj: getNowFormatDate(),
			//}
		}, function (error, response, body) {
			console.log(iconv.decode(body, 'gb2312').toString());
			var html = iconv.decode(body, 'gb2312')
			console.log("================================")
			console.log(html, '-----html------')
			console.log(body, '-----body------')
			//var $ = cheerio.load(html,{decodeEntities: false})
			if(html && html != ''){
				arr[req.query.fphm] = html;
				fs.writeFileSync(__dirname + "/data.js", JSON.stringify(arr));
			}

			res.status(200).send(html)
		})
	}

}


app.get("/getCode", function (req, res) {
	console.log(req.query, '----query')
	getCode(req, res)
});
var ysmParams = {
	fpdm: "3100172320",
	publickey: "44E81101247F29600C5D594404E194C5",
	nowtime: 1513736494208,
	r: 0.24446255685164497,
	callback: "jQuery110201670807078019223_1513735991456"


}

function getCode(req, res) {
	request({
		url: 'https://fpcyweb.tax.sh.gov.cn:1001/WebQuery/yzmQuery',
		method: "get",
		rejectUnauthorized: false,
		"X-Forwarded-For" : getIp(),
		headers: {
			"Cookie": _cookie,
			rejectUnauthorized: false,
			"Content-Type": "application/json; charset=utf-8"

		},
		"Content-Type": "application/json; charset=utf-8"
		,
		qs: req.query
	}, function (error, response, body) {
		//console.log("================error=================")
		//console.log(error)
		//console.log("================error=================")
		//console.log(response)
		//console.log("================error=================")
		console.log(typeof body)
		//console.log("================error=================")
		res.header("Content-Type", 'text/html; charset=utf-8')

		if (error) {
			res.status(500).send({msg: "获取验证码识别"})
		} else {
			res.status(200).send(body)
		}

	})

}
module.exports = app;