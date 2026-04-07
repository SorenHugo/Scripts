# 自用脚本仓库

## 影视飓风Club签到

自动签到影视飓风Club小程序，获取积分奖励。支持多账号签到，自动查询签到前后积分变化。

### 获取 token 和 sid
1. 打开微信小程序「影视飓风Club」
2. 使用抓包工具（如 Fiddler）抓取小程序的网络请求
3. 找到包含 `access_token` 和 `sid` 的请求（通常在签到或会员中心相关接口中）
4. 复制这两个值，按照格式配置环境变量（`"账号备注+token+sid"`，每行一个账号）

    ```plaintext
    账号1+++token1+++sid1
    账号2+++token2+++sid2
    ```

### 本地运行
1. 安装依赖：`npm install axios`
2. 设置环境变量：`set YSJFCS=账号+++token+++sid`（Windows）或 `export YSJFCS="账号+++token+++sid"`（Linux/Mac）
3. 运行脚本：`node 影视飓风club签到.js`

### GitHub Actions 自动签到
已配置 GitHub Actions 工作流，支持定时自动签到：

1. **Fork 本仓库**
2. **设置 Secrets**：
   - "Settings" → "Secrets and variables" → "Actions" → "New repository Secrets"
   - 创建名为 `YSJFCS` 的 Secret，填入账号信息
3. **工作流配置**：
   - 定时执行：每天 UTC 时间 0 点（对应北京时间 8 点）
   - 支持手动触发：在 "Actions" 标签页中点击 "Run workflow"
