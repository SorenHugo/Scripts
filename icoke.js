/*
变量名kekoukeleba  
抓小程序可口可乐吧 member-api.icoke.cn/api  Headers中 authorization  去掉Bearer   多账号&连接
*/
const { Env } = require('./tools/env');
const $ = new Env("可口可乐吧");
let ckName = `ICOKE`;
const axios = require("axios");
const defaultUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.31(0x18001e31) NetType/WIFI Language/zh_CN miniProgram"

class Public {
	request(options) {
		return axios.request(options);
	}
}
class Task extends Public {
	constructor(env) {
		super();
		this.index = $.userIdx++
		let user = env.split("#");
		this.token = user[0];
		this.isSign = false;
	}
	async addSign() {
		let options = {
			method: "GET",
			url: "https://member-api.icoke.cn/api/icoke-sign/icoke/mini/sign/main/sign",
			headers: {
				"accept": "application/json, text/plain, */*",
				"accept-language": "zh-CN,zh;q=0.9",
				"authorization": "" + this.token,
				"content-type": "application/json",
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "cross-site",
				"xweb_xhr": "1",
				"Referer": "https://servicewechat.com/wxa5811e0426a94686/421/page-frame.html",
				"Referrer-Policy": "unsafe-url",
				"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.31(0x18001e31) NetType/WIFI Language/zh_CN miniProgram"
			},
		}
		try {
			let { data: res } = await this.request(options);
			if (res.success == true) {
				$.log(`✅签到成功 获得【${res.point}】快乐瓶`)
			} else {
				$.log(`❌签到失败`)
				console.log(res);
			}
		} catch (e) {
			console.log(e);

		}
	}
	async userInfo() {
		let options = {
			method: "GET",
			url: "https://member-api.icoke.cn/api/icoke-customer/icoke/mini/customer/main/points",
			headers: {
				"accept": "application/json, text/plain, */*",
				"accept-language": "zh-CN,zh;q=0.9",
				"authorization": "" + this.token,
				"content-type": "application/json",
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "cross-site",
				"xweb_xhr": "1",
				"Referer": "https://servicewechat.com/wxa5811e0426a94686/421/page-frame.html",
				"Referrer-Policy": "unsafe-url",
				"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.31(0x18001e31) NetType/WIFI Language/zh_CN miniProgram"
			},
		}
		try {
			let { data: res } = await this.request(options);
			$.log(`目前还剩【${res.point}】瓶 `)
		} catch (e) {
			console.log(e);
		}
	}
	async run() {
		await this.userInfo();
		await this.addSign();
	}
}

!(async () => {
	$.checkEnv(ckName);
	for (let user of $.userList) {
		await new Task(user).run();
	}
})()
	.catch((e) => console.log(e))
	.finally(() => $.done());
