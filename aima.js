// 爱玛出行会员 access-token

const { Env } = require("./tools/env")
const $ = new Env("爱玛出行会员");
const axios = require('axios')

// ================== 配置区 ==================
const ACTIVITY_ID = "100001192";
const BASE_URL = "https://scrm.aimatech.com";
const APP_ID = "scrm";

// ================== 工具函数 ==================
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function md5(str) {
  const crypto = require('crypto');
  return crypto.createHash('md5').update(str).digest('hex');
}

// ================== 核心逻辑 ==================
async function signIn(token, index) {
  try {
    const timestamp = Date.now();
    const traceLogId = generateUUID();

    // 构造通用请求头
    const headers = {
      "App-Id": APP_ID,
      "Time-Stamp": timestamp.toString(),
      "TraceLog-Id": traceLogId,
      "Access-Token": token.trim(),
      "content-type": "application/json",
      "User-Agent": "Mozilla/5.0 (Linux; Android 15; 23013RK75C Build/AQ3A.250226.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/142.0.7444.173 Mobile Safari/537.36 XWEB/1420229 MMWEBSDK/20251101 MMWEBID/6369 MicroMessenger/8.0.67.3000(0x28004333) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android",
      "charset": "utf-8",
      "Referer": "https://servicewechat.com/wx2dcfb409fd5ddfb4/215/page-frame.html"
    };

    // 生成签名（按规则拼接）
    const signStr = `${APP_ID}${timestamp}${traceLogId}${token.trim()}AimaScrm321_^`;
    headers["Sign"] = md5(signStr).toLowerCase();

    // 1. 查询签到状态
    $.log(`🚀 账号[${index}]查询签到状态...`);
    const searchRes = await axios.post(
      `${BASE_URL}/aima/wxclient/mkt/activities/sign:search`,
      { activityId: ACTIVITY_ID },
      { headers, timeout: 10000 }
    );

    const data = searchRes.data;
    if (data.content && data.content.signStatus === 1) {
      $.log(`✅ 账号[${index}]今日已签到！跳过签到。`);
      return;
    }

    // 2. 执行签到
    $.log(`⏳ 账号[${index}]正在签到...`);
    const joinRes = await axios.post(
      `${BASE_URL}/aima/wxclient/mkt/activities/sign:join`,
      { activityId: ACTIVITY_ID, activitySceneId: null },
      { headers, timeout: 10000 }
    );

    if (joinRes.data.code === 200 || joinRes.data.code === 0) {
      const point = joinRes.data.content?.point || 10;
      $.log(`🎉 账号[${index}]签到成功！获得 ${point} 积分`);
    } else {
      $.log(`❌ 账号[${index}]签到失败: ${JSON.stringify(joinRes.data)}`);
    }
  } catch (e) {
    throw new Error(e.message || e);
  }
}

// ================== 主函数 ==================
!(async () => {
  // 获取 access-token（支持多账号）
  let tokens = [];
  if ($.isNode()) {
    const env = process.env.AIMA;
    if (env) {
      tokens = env.split(/&|\n/).filter(t => t.trim());
    }
  }

  if (tokens.length === 0) {
    $.log("❌ 未找到 access-token，请配置环境变量 'AIMA'");
    return;
  }

  console.log(`✅ 共找到 ${tokens.length} 个账号`);

  for (let i = 0; i < tokens.length; i++) {
    try {
      console.log(`🚀 账号[${i + 1}]开始签到...`);
      await signIn(tokens[i], i + 1);
    } catch (e) {
      console.log(`❌ 账号[${i + 1}]签到失败：${e.message}`);
    }
  }

})()
  .catch((e) => console.log(e))
  .finally(() => $.done());
