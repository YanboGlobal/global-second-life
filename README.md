# Second Spring 安全报名与付款系统

这个网站仍然是普通静态网页，但新增了一个安全报名与付款页：`payment.html`。

最重要的原则：

- 我们的网站绝不收集、保存或传输信用卡号、CVV、银行账号、routing number。
- 信用卡全部由 Stripe 安全处理；Zelle 和 PayPal 只显示收款邮箱并由老板人工确认到账。
- 护照、生日、国籍、紧急联系人等敏感旅行资料，会先在旅客自己的浏览器里加密，再发送到 Cloudflare。
- Cloudflare Worker 和 D1 数据库只保存密文，看不到护照号码等原文。
- 私钥只放在老板自己的电脑和密码管理器里，永远不要上传到网站或 Cloudflare。
- 不收集 SSN。报名中国行程和签证不需要 Social Security Number。

## 已新增的文件

- `payment.html`：旅客填写报名资料和选择付款方式的页面。
- `payment.js`：浏览器端加密资料，并打开 Stripe 安全付款框。
- `worker/index.js`：Cloudflare Worker 后端接口。
- `worker/schema.sql`：Cloudflare D1 数据库表结构。
- `wrangler.toml`：Cloudflare Worker 配置文件。
- `scripts/keygen.js`：生成加密公钥和私钥。
- `admin/viewer.html`：老板本地查看报名资料的页面。
- `admin/local-viewer-server.js`：老板本地查看资料的小工具。

## 整体流程

1. 旅客打开 `payment.html`。
2. 旅客填写姓名、邮箱、电话、护照、生日、紧急联系人等信息。
3. 浏览器用公钥把敏感资料加密。
4. Cloudflare Worker 收到的只有密文。
5. 旅客选择 Zelle、信用卡或 PayPal。
6. 信用卡由 Stripe 处理；Zelle 和 PayPal 只记录为 pending，老板人工确认到账。
7. 老板在自己的电脑上用私钥解密报名资料。

## 第 1 步：注册 Stripe

1. 打开浏览器，去 [https://stripe.com](https://stripe.com)。
2. 注册或登录 Stripe。
3. 按照 Stripe 要求填写公司、身份、税务和收款银行信息。
4. 在 Stripe 后台左侧找到 **Developers**。
5. 点 **API keys**。
6. 复制 **Publishable key**，它通常以 `pk_test_` 或 `pk_live_` 开头。
7. 复制 **Secret key**，它通常以 `sk_test_` 或 `sk_live_` 开头。

注意：`Secret key` 是机密，不要放进任何网页文件里。

## 第 2 步：设置 Stripe Webhook

Webhook 的作用是让 Stripe 告诉我们“这笔钱到底有没有成功付”。

1. 在 Stripe 后台进入 **Developers**。
2. 点 **Webhooks**。
3. 点 **Add endpoint**。
4. Endpoint URL 先填下面这种格式，等 Worker 部署后把网址换成真实 Worker 网址：

```bash
https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev/stripe-webhook
```

5. 选择这些事件：

```bash
payment_intent.succeeded
payment_intent.processing
payment_intent.payment_failed
payment_intent.canceled
payment_intent.requires_action
```

6. 保存后，打开这个 webhook。
7. 找到 **Signing secret**，复制 `whsec_...` 这一串。

## 第 3 步：注册 Cloudflare

1. 去 [https://cloudflare.com](https://cloudflare.com)。
2. 注册免费账号。
3. 如果您有正式域名，例如 `secondspringglobal.com`，按照 Cloudflare 指示把域名加入 Cloudflare。

## 第 4 步：安装 Node.js

1. 打开 [https://nodejs.org](https://nodejs.org)。
2. 下载 LTS 版本。
3. 双击安装。

安装后，打开 Mac 的 **Terminal**。

输入下面命令，进入网站文件夹：

```bash
cd /Users/yanbo/Documents/Global_Second_Life_Website
```

安装本项目需要的小工具：

```bash
npm install
```

安装 Cloudflare 的命令工具 Wrangler：

```bash
npm install -g wrangler
```

登录 Cloudflare：

```bash
wrangler login
```

这会打开浏览器，让您授权登录 Cloudflare。

## 第 5 步：生成加密公钥和私钥

在 Terminal 里输入：

```bash
npm run keygen
```

您会看到两段文字：

- `PUBLIC KEY`：放进网站的 `payment.js`，用于加密。
- `PRIVATE KEY`：老板自己保存，用于本地解密。

请把 `PRIVATE KEY` 存到密码管理器，并另外离线备份一份。不要发邮件，不要发微信，不要上传到网站，不要放进 Cloudflare。

如果私钥丢了，以前收到的加密资料就无法恢复。

## 第 6 步：把公钥放进报名页

打开 `payment.js`，找到：

```js
const BOOKING_PUBLIC_KEY_BASE64 = "REPLACE_WITH_LIBSODIUM_PUBLIC_KEY_BASE64";
```

把引号里的内容换成刚才生成的 `PUBLIC KEY`。

## 第 7 步：创建 Cloudflare D1 数据库

在 Terminal 输入：

```bash
wrangler d1 create second_spring_booking
```

Cloudflare 会显示一段 `database_id`。

打开 `wrangler.toml`，找到：

```toml
database_id = "REPLACE_WITH_D1_DATABASE_ID"
```

把里面换成 Cloudflare 给您的 `database_id`。

然后创建数据库表：

```bash
wrangler d1 execute second_spring_booking --file=worker/schema.sql
```

数据库里只有两张表：

- `bookings`：保存姓名、邮箱、行程代码、加密后的旅行资料。
- `payments`：保存付款方式、Stripe 付款编号、金额、币种、状态。

没有信用卡号字段，没有银行账号字段。

## 第 8 步：设置 Cloudflare Secrets

这些 secret 都只存在 Cloudflare 后台，不会进入网页。

设置 Stripe secret key：

```bash
wrangler secret put STRIPE_SECRET_KEY
```

粘贴 Stripe 的 `sk_...` key。

设置 Stripe webhook signing secret：

```bash
wrangler secret put STRIPE_WEBHOOK_SECRET
```

粘贴 Stripe 的 `whsec_...`。

生成 admin token：

```bash
openssl rand -base64 32
```

复制生成的随机文字。然后输入：

```bash
wrangler secret put ADMIN_TOKEN
```

粘贴刚才生成的 admin token。

设置 Cloudflare Turnstile secret key：

```bash
wrangler secret put TURNSTILE_SECRET_KEY
```

粘贴 Turnstile 的 secret key。

## 第 9 步：设置 Turnstile 防机器人

1. 登录 Cloudflare。
2. 找到 **Turnstile**。
3. 新建一个 Widget。
4. 把您的域名加进去，例如：

```bash
secondspringglobal.com
```

5. 复制 **Site key**，放进 `payment.js`：

```js
const TURNSTILE_SITE_KEY = "这里换成您的 Turnstile Site Key";
```

6. 复制 **Secret key**，按照第 8 步设置到 Cloudflare secret。

## 第 10 步：设置域名、Worker 地址和 Stripe 公钥

打开 `worker/index.js`，找到：

```js
const OWNER_DOMAIN = "https://YOUR-DOMAIN.com";
```

改成您的真实网站域名，例如：

```js
const OWNER_DOMAIN = "https://secondspringglobal.com";
```

打开 `payment.js`，找到：

```js
const WORKER_BASE_URL = "https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev";
const STRIPE_PUBLISHABLE_KEY = "pk_test_REPLACE_ME";
```

把 `WORKER_BASE_URL` 换成部署后的 Worker 地址。

把 `STRIPE_PUBLISHABLE_KEY` 换成 Stripe 的 publishable key，也就是 `pk_...`。

如果以后要改报名价格，请同时改两个地方：

1. `worker/index.js` 里的 `TRIP_PRICES`，这是 Stripe 实际收款价格，必须以这里为准。
2. `payment.js` 里的 `DISPLAY_AMOUNT_CENTS`，这是页面给客人看的显示价格。

不要只改 `payment.js`。浏览器里的金额只用于显示，真正收费金额由 Worker 决定。

## 第 11 步：部署 Worker

在 Terminal 输入：

```bash
wrangler deploy
```

部署成功后，Cloudflare 会显示 Worker 网址。把这个网址填回 `payment.js` 的 `WORKER_BASE_URL`。

## 第 12 步：上传网站文件

把这些文件和原网站一起上传到您的静态网站空间：

```bash
payment.html
payment.js
styles.css
```

以及原来的网站页面和图片资源。

不要上传：

```bash
admin/
scripts/
worker/
wrangler.toml
node_modules/
```

`admin/` 是老板本地看的工具，不是给公众访问的网页。

## 第 13 步：老板查看报名资料

老板需要在自己的电脑上查看。先进入网站文件夹：

```bash
cd /Users/yanbo/Documents/Global_Second_Life_Website
```

运行下面命令。把网址和 admin token 换成自己的：

```bash
WORKER_EXPORT_URL="https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev/admin/export" ADMIN_TOKEN="PASTE_ADMIN_TOKEN_HERE" npm run admin
```

Terminal 会显示本地地址，通常是：

```bash
http://localhost:8789
```

在浏览器打开这个地址。

然后把 `PRIVATE KEY` 粘贴到页面里，点击加载。解密只发生在老板自己的电脑上。

如果下载 CSV，请记住：CSV 是明文文件。用完后要删除，不要发给无关人员。

## 第 14 步：删除过期行程数据

行程结束后，建议删除不再需要的数据。

按行程删除：

```bash
curl -X DELETE "https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev/admin/record?trip_code=jiangnan-2026-08-26" -H "Authorization: Bearer PASTE_ADMIN_TOKEN_HERE"
```

按单个 booking id 删除：

```bash
curl -X DELETE "https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev/admin/record?booking_id=bk_EXAMPLE" -H "Authorization: Bearer PASTE_ADMIN_TOKEN_HERE"
```

## 付款方式说明

### 信用卡

旅客选择信用卡后，Stripe 会显示安全付款框。我们的网站看不到卡号和 CVV。

### Zelle

旅客选择 Zelle 后，网站只显示收款邮箱 `wangyanbo@gmail.com` 和 booking reference。我们不收集银行登录、银行账号或 routing number。老板看到状态是 `zelle_pending`，需要人工确认到账。

### PayPal

旅客选择 PayPal 后，网站只显示收款邮箱 `wangyanbo@gmail.com` 和 booking reference。我们不收集 PayPal 登录或任何付款账号信息。老板看到状态是 `paypal_pending`，需要人工确认到账。

## 绝对不要做的事

- 不要在网页里添加信用卡号输入框。
- 不要在网页里添加 CVV 输入框。
- 不要保存银行账号或 routing number。
- 不要收集 SSN。
- 不要把 Stripe secret key 放进网页。
- 不要把 private key 上传到网站、Cloudflare、GitHub、邮件或微信。
- 不要关闭 Stripe webhook，因为 webhook 才是付款状态的真实来源。
- 所有 Stripe、Cloudflare、邮箱、域名账号都要开启 MFA 双重验证。
- 建议购买 cyber-liability insurance。
- 建议准备清晰的取消、退款、改期、旅行保险和风险告知政策。

## 测试建议

Stripe 测试卡号只能在 Stripe 的安全付款框里输入，不要写进我们自己的网站代码。

上线前建议用测试模式完整走一遍：

1. 填报名表。
2. 选择信用卡测试付款。
3. 选择 Zelle，确认页面显示收款邮箱和 booking reference。
4. 选择 PayPal，确认页面显示收款邮箱和 booking reference。
5. 在 admin viewer 里确认能看到报名记录。
6. 确认付款状态来自 Stripe webhook。
