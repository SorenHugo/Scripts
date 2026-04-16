/*
DECATHLON
抓域名 api-cn.decathlon.com.cn 下请求中 Authorization 的值，多账户&或换行连接
*/

const { Env } = require("./tools/env")
const $ = new Env("迪卡侬");
const axios = require("axios");

class Task {
    constructor(user) {
        this.index = $.userIdx++
        this.Authorization = user;
    }

    async run() {
        $.log(`🚀 账号[${this.index}]开始签到...`);
        await this.userInfo()
        await $.wait(1000, 5000)
        await this.check_in_daily()
        await $.wait(1000, 5000)
        await this.memberships()
        await $.wait(1000, 5000)
    }

    async userInfo() {
        let options = {
            method: 'GET',
            url: `https://mpm-store.decathlon.com.cn/wcc_bff/api/v1/wechat/member/check`,
            headers: {               
                "Connection": "keep-alive",
                "Authorization": `Bearer ${this.Authorization}`,
                "Etag": "93cae974-9bbb-48a4-9f5c-afb3ffc830b8",
                "xweb_xhr": 1,
                "x-api-key": "ace22a30-579d-475f-99fc-138b71bc2ab9",
                "shop-id": 7,
                "tid": "grIYLMZvNBuTDklqJ7BnxJp93j7R/NzcQS98wFYdY5hIW1eZ0VHrBC/4CNw=",
                "Sensors-Data-Preset": {"page_name":"%E9%A6%96%E9%A1%B5","page_type":"HomePage","$app_version":"7.1.3"},
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090a13) UnifiedPCWindowsWechat(0xf254181d) XWEB/19201",
                "content-type": "application/json",
                "Accept": "*/*",
                "Sec-Fetch-Site": "cross-site",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://servicewechat.com/wxdbc3f1ac061903dd/514/page-frame.html",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-CN,zh;q=0.9"
            },
        }
        let { data: result } = await axios.request(options);
        if (result?.code == 0) {
            const maskedMobile = result.data.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
            $.log(`✅ 查询成功：当前手机号${maskedMobile}，用户昵称为[${result.data.last_name}]`);
        } else {
            $.log(`❌ 查询用户信息失败：${result.msg}`);
        }
    }
    async check_in_daily() {
        let options = {
            method: 'POST',
            url: `https://api-cn.decathlon.com.cn/membership/membership-portal/mp/api/v1/business-center/reward/CHECK_IN_DAILY`,
            headers: {
                "Connection": "keep-alive",
                "Content-Length": 2,
                "Authorization": `Bearer ${this.Authorization}`,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090a13) UnifiedPCWindowsWechat(0xf254181d) XWEB/19201",
                "xweb_xhr": 1,
                "Content-Type": "application/json",
                "Accept": "*/*",
                "Sec-Fetch-Site": "cross-site",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://servicewechat.com/wxdbc3f1ac061903dd/514/page-frame.html",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-CN,zh;q=0.9"
            },
            data: "{}"
        }
        let { data: result } = await axios.request(options);
        if (result?.code == 0) {
            $.log(`✅ 签到成功：获得${result.data.point_change}燃值`);
        } else if (result?.code == "ENP_1006") {
            $.log(`❌ 签到失败：今日已签到`);
        } else {
            $.log(`❌ 签到失败：${result.msg}`);
        }
    }
    async memberships(){
        let options = {
            method: 'GET',
            url: `https://api-cn.decathlon.com.cn/membership/membership-portal/mp/api/v1/memberships`,
            headers: {
                "Connection": "keep-alive",
                "Authorization": `Bearer ${this.Authorization}`,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090a13) UnifiedPCWindowsWechat(0xf254181d) XWEB/19201",
                "xweb_xhr": 1,
                "Content-Type": "application/json",
                "Accept": "*/*",
                "Sec-Fetch-Site": "cross-site",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://servicewechat.com/wxdbc3f1ac061903dd/514/page-frame.html",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-CN,zh;q=0.9"
            },
        }
        let { data: result } = await axios.request(options);
        if (result?.code == 0) {
            $.log(`🎉 剩余${result.data.dktPointBalance}燃值，${result.data.dktExpirePoints}燃值今年底将过期`);
        } else {
            $.log(`❌ 查询燃值失败：${result.msg}`);
        }
    }
}

!(async () => {
    $.checkEnv(`DECATHLON`);
    for (let user of $.userList) {
        await new Task(user).run();
    }
})()
    .catch((e) => console.log(e))
    .finally(() => $.done());
