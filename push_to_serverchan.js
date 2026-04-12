const querystring = require('querystring');
const fs = require('fs');

const key =  process.env.PUSH_KEY || '';

let summary = '';
try {
    summary = fs.readFileSync('summary.txt', 'utf8').trim();
} catch (error) {
    console.log('Error reading summary.txt:', error.message);
}

(async () => {
    const ret = await sc_send('签到结果', summary, key);
    console.log(ret);
})();

async function sc_send(text, desp = '', key = '[SENDKEY]') {
    const postData = querystring.stringify({ text, desp });
    // 根据 sendkey 是否以 'sctp' 开头，选择不同的 API URL
    const url = String(key).match(/^sctp(\d+)t/i) 
    ? `https://${key.match(/^sctp(\d+)t/i)[1]}.push.ft07.com/send/${key}.send`
    : `https://sctapi.ftqq.com/${key}.send`;
  
    console.log("url", url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      },
      body: postData
    });
  
    const data = await response.text();
    return data;
  }