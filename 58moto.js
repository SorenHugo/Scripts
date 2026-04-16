/*
环境变量 ：mtf
抓域名 api.58moto.com 下请求中 token 和 uid 的值用#连接，多账户&或换行连接
*/

const { Env } = require("./tools/env")
const $ = new Env("摩托范");
const axios = require("axios");
const defaultUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.31(0x18001e31) NetType/WIFI Language/zh_CN miniProgram"

class Task {
    constructor(env) {
        this.index = $.userIdx++
        this.user = env.split("#");
        this.token = this.user[0];
        this.uid = this.user[1];
    }

    async run() {
        await this.userInfo()
        await $.wait(1000, 5000)
        await this.signIn()
        await $.wait(1000, 5000)
        await this.draw()
        await $.wait(1000, 5000)
    }

    async userInfo() {
        let options = {
            method: 'POST',
            url: `https://api.58moto.com/user/center/info/principal`,
            headers: {
                "token": this.token,
                "content-type": "application/x-www-form-urlencoded",
                "User-Agent": defaultUserAgent
            },
            data: "uid=" + this.uid
        }
        let { data: result } = await axios.request(options);
        if (result?.code == 0) {
            const maskedMobile = result.data.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
            $.log(`✅查询成功：当前手机号${maskedMobile}，用户昵称为[${result.data.username}]`);
        } else {
            $.log(`❌查询失败：原因未知`);
            console.log(result);
        }
    }
    async signIn() {
        let options = {
            method: 'POST',
            url: `https://api.58moto.com/coins/task/dailyCheckIn`,
            headers: {
                "token": this.token,
                "content-type": "application/x-www-form-urlencoded",
                "User-Agent": defaultUserAgent
            },
            data: "uid=" + this.uid + "&weekDate=" + $.time('yyyyMMdd')
        }
        let { data: result } = await axios.request(options);

        if (result?.code == 0) {
            $.log(`✅签到成功：${result.data.contentDesc}`);
        } else if (result?.code == 300101) {
            $.log(`❌签到失败：${result.msg}，请勿重复签到`);
        } else {
            $.log(`❌签到失败：原因未知`);
            console.log(result);
        }
    }
    async draw() {
        let options = {
            method: 'POST',
            url: `https://jsapi.58moto.com/coins/turntable/activity/draw`,
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "User-Agent": defaultUserAgent
            },
            data: `token=${this.token}&uid=${this.uid}&autherid=${this.uid}&platform=2&version=3.66.80&deviceId=53B5DA97-C72D-4C19-A219-70D8A9A31290&bundleId=com.jdd.motorfans&activityId=24`
        }
        let { data: result } = await axios.request(options);
        if (result?.code == 0) {
            $.log(`✅抽奖成功:${result.data.awardName}`);
        } else {
            $.log(`❌抽奖失败：原因未知`);
            console.log(result);
        }
    }
    //做任务需要wtoken逆向 不想写
}

!(async () => {
    $.checkEnv(`MTF`);

    for (let user of $.userList) {
        await new Task(user).run();
    }
})()
    .catch((e) => console.log(e))
    .finally(() => $.done());
