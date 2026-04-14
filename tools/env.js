function Env(t) {
    return new (class {
        constructor(t) {
            this.userIdx = 1;
            this.userList = [];
            this.userCount = 0;
            this.name = t;
            this.startTime = new Date().getTime();
            this.log(`🔔${this.name}开始签到`);
        }
        checkEnv(ckName) {
            const envSplitor = ["&", "\n"];
            let userCookie = (this.isNode() ? process.env[ckName] : "") || "";
            this.userList = userCookie.split(envSplitor.find((o) => userCookie.includes(o)) || "&").filter((n) => n);
            this.userCount = this.userList.length;
            this.log(`✅共找到${this.userCount}个账号`);
        }
        toStr(v) {
            if (v instanceof Error) return v.stack || v.message;
            if (v && typeof v == "object") try { return JSON.stringify(v) } catch { return "[Complex Object]" }
            return String(v);
        }
        isNode() {
            return "undefined" != typeof module && !!module.exports;
        }
        randomNumber(length) {
            const characters = "0123456789";
            return Array.from(
                { length },
                () => characters[Math.floor(Math.random() * characters.length)]
            ).join("");
        }
        randomString(length) {
            const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
            return Array.from(
                { length },
                () => characters[Math.floor(Math.random() * characters.length)]
            ).join("");
        }
        generateUUID() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
                /[xy]/g,
                function (c) {
                    var r = (Math.random() * 16) | 0,
                        v = c == "x" ? r : (r & 0x3) | 0x8;
                    return v.toString(16);
                }
            );
        }
        time(t) {
            let s = {
                "M+": new Date().getMonth() + 1,
                "d+": new Date().getDate(),
                "H+": new Date().getHours(),
                "m+": new Date().getMinutes(),
                "s+": new Date().getSeconds(),
                "q+": Math.floor((new Date().getMonth() + 3) / 3),
                S: new Date().getMilliseconds(),
            };
            /(y+)/.test(t) &&
                (t = t.replace(
                    RegExp.$1,
                    (new Date().getFullYear() + "").substr(4 - RegExp.$1.length)
                ));
            for (let e in s) {
                new RegExp("(" + e + ")").test(t) &&
                    (t = t.replace(
                        RegExp.$1,
                        1 == RegExp.$1.length
                            ? s[e]
                            : ("00" + s[e]).substr(("" + s[e]).length)
                    ));
            }
            return t;
        }
        log(content) {
            const fs = require("fs");
            fs.appendFileSync('summary.txt', `[${this.time("HH:mm:ss")}] ${this.toStr(content)}\n\n`);
            console.log(content)
        }
        wait(min, max = null) {
            const ms = max == null ? min : Math.random() * (max - min + 1) + min | 0;
            return new Promise(r => setTimeout(r, ms));
        }
        async done() {
            const s = new Date().getTime(),
                e = (s - this.startTime) / 1e3;
            this.log(
                `🕛${this.name}任务结束，用时${e}秒`
            );
            if (this.isNode()) {
                process.exit(0);
            }
        }
    })(t);
}
module.exports = {
    Env
}