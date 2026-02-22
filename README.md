# 🏠 家庭情緒勞務測驗 + 體驗服務

> 測驗入口 → 結果分享 → Demo 體驗 → Email 收集

## 使用者流程

```
看到分享連結 / 社群貼文
    ↓
測驗頁（10 題情境題）
    ↓
結果頁（可分享的指數圖）  ← 傳播在這裡發生
    ↓
CTA：「免費體驗工具」或「留 Email」
    ↓
建立家庭 → Demo 體驗完整服務
    ↓
體驗中彈出 → 留 Email 訂閱正式版
```

## 專案結構

```
el-site/
├── api/
│   └── subscribe.js    ← Vercel Serverless（EmailOctopus API）
├── src/
│   ├── main.jsx        ← Entry
│   └── App.jsx         ← 完整應用（測驗 + 服務 + Email）
├── index.html          ← SEO meta tags + OG 分享圖
├── package.json
├── vite.config.js
├── vercel.json
└── README.md
```

---

## 🚀 部署教學（一步一步）

### Step 1：註冊 EmailOctopus

1. 到 https://emailoctopus.com 註冊免費帳號
2. 點左邊「Lists」→「Create list」→ 取名「情緒勞務」
3. 進入這個 List → 上方「Settings」→ 記下 **List ID**
4. 點右上角頭像 →「API keys」→「Create key」→ 記下 **API Key**

你會需要這兩個值：
- `EMAILOCTOPUS_API_KEY`：像是 `abcdef12-3456-...`
- `EMAILOCTOPUS_LIST_ID`：像是 `xxxxxxxx-xxxx-...`

### Step 2：上傳到 GitHub

1. 到 https://github.com 登入（沒帳號先註冊）
2. 點右上角「+」→「New repository」
3. 名稱填 `emotional-labor-quiz`，選 Private，按 Create
4. 在你的電腦打開終端機，進到這個專案資料夾：

```bash
cd el-site
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/你的帳號/emotional-labor-quiz.git
git push -u origin main
```

### Step 3：部署到 Vercel

1. 到 https://vercel.com 用 GitHub 帳號登入
2. 點「Add New...」→「Project」
3. 選擇你剛建立的 `emotional-labor-quiz` repo
4. Framework 自動偵測為 Vite ✓
5. **重要！** 展開「Environment Variables」，加入：
   - `EMAILOCTOPUS_API_KEY` = 你在 Step 1 記下的 API Key
   - `EMAILOCTOPUS_LIST_ID` = 你在 Step 1 記下的 List ID
6. 按「Deploy」

部署完成後你會得到網址，像是：
`https://emotional-labor-quiz-xxxxx.vercel.app`

### Step 4：測試

1. 打開你的 Vercel 網址
2. 做完測驗 → 看到結果
3. 點「留下 Email」→ 輸入測試 Email → 送出
4. 回到 EmailOctopus → Lists → 確認有收到

### Step 5（選用）：綁定自訂網域

如果之後買了網域（例如 `fairhome.tw`）：
1. Vercel Dashboard → 你的專案 → Settings → Domains
2. 輸入你的網域 → 按照指示設定 DNS
3. Vercel 自動幫你搞定 HTTPS

---

## 🔧 本地開發

```bash
npm install
npm run dev       # http://localhost:5173
```

本地測試 Email 功能需要設環境變數：
```bash
# 建立 .env 檔案（不要 commit）
echo "EMAILOCTOPUS_API_KEY=你的key" > .env
echo "EMAILOCTOPUS_LIST_ID=你的id" >> .env
```

---

## 📊 追蹤成效

免費方案可用的追蹤方式：

1. **EmailOctopus 後台** — 看訂閱人數成長
2. **Vercel Analytics**（免費方案有基本數據）— 看訪客數
3. **在 index.html 加 Google Analytics**（選用）：
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
   ```

---

## 📱 分享圖片

`public/og-image.png` 是 LINE / Facebook 分享時顯示的預覽圖。
建議尺寸：1200 x 630px，內容放：
- 「你家的情緒勞務分配健康嗎？」
- 72% 的統計數字
- 溫暖的配色

可以用 Canva 免費製作。

---

## 下一步

- [ ] 製作 OG 分享圖（Canva）
- [ ] 部署上線
- [ ] 在媽媽社群測試分享測驗連結
- [ ] 觀察 Email 訂閱數 → 決定是否開發正式版
- [ ] 目標：1 個月內收到 500 封 Email = 市場驗證通過 ✓
