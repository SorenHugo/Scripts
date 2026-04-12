/*
------------------------------------------
微信小程序抓包的 https://api.bckid.com.cn 请求头authorization
------------------------------------------
*/

const { Env } = require("./tools/env")
const $ = new Env("babycare");
let ckName = `BABYCARE`;
const axios = require("axios");

class Task {
    constructor(env) {
        this.index = $.userIdx++
        this.token = env;
    }

    async run() {
        await this.info()
        await $.wait(1000, 5000)
        await this.signIn()
        await $.wait(1000, 5000)
    }

    async signIn() {
        let options = {
            method: 'POST',
            url: `https://api.bckid.com.cn/operation/front/bonus/userSign/v3/sign`,
            headers: {
                'Host': 'api.bckid.com.cn',
                'authorization': this.token,
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090b11) XWEB/9129',
            },
            data: {}
        };
        let { data: result } = await axios.request(options);
        if (result?.code == '200') {
            $.log(`🎉账号[${this.index}]` + `当前已签到${result.body.signDaysCountMod}天`);
        } else {
            $.log(`❌账号[${this.index}]签到失败：${result.message}`)
        }
    }
    async info() {
        let options = {
            url: 'https://api.bckid.com.cn/operation/front/bonus/userBonus/getUserBonus',
            headers: {
                'Host': 'api.bckid.com.cn',
                'authorization': this.token,
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090b11) XWEB/9129',
            },
            method: 'POST',
            data: {}
        }
        let { data: result } = await axios.request(options);
        if (result?.code == '200') {
            $.log(`💰账号[${this.index}]` + `账户当前积分[${result.body.userBonus}]，历史积分[${result.body.sumBonus}]`);
        } else {
            $.log(`❌账号[${this.index}]积分查询失败：${result.message}`)
        }
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
