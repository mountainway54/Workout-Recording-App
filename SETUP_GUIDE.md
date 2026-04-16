# React Native + Google Apps Script 訓練記錄儲存整合指南

## 第一步: 建立 Google Sheet 表格結構

### 1.1 在 Google Sheets 中建立表頭

在你的 Google Sheet 第一列設定以下欄位:

- **A1**: 日期
- **B1**: 訓練日
- **C1**: 項目名稱
- **D1**: 重量(kg)
- **E1**: 次數
- **F1**: 訓練量

### 1.2 取得你的 Google Sheet ID

- 開啟你的 Google Sheet
- 複製 URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`
- 取出 `YOUR_SHEET_ID` 部分(在 `/d/` 和 `/edit` 之間)
- 妥善保存此 ID，稍後會用到

---

## 第二步: 部署 Google Apps Script

### 2.1 開啟 Google Apps Script 編輯器

1. 在 Google Sheet 中，點擊菜單 **延伸程式** → **Apps Script**
2. 會開啟一個新的編輯器分頁

### 2.2 設定程式碼

1. 刪除預設的 `myFunction()` 程式碼
2. 貼上 `google-apps-script.gs` 中的所有程式碼
3. **重要**: 找到第 9 行，替換:
   ```javascript
   const SHEET_ID = "YOUR_SHEET_ID"; // 貼上你的 Sheet ID
   ```

### 2.3 部署為 Web App

1. 點擊 **部署** 按鈕（頂部右側）
2. 選擇 **新部署**
3. 在「選擇類型」下拉選單中選擇 **Web 應用程式**
4. 設定如下:
   - **執行身分**: 選擇你的 Google 帳戶
   - **具有存取權的使用者**: 選擇 **任何人**
5. 點擊 **部署**

### 2.4 複製 API URL

1. 部署完成後，會出現「部署成功」訊息
2. 複製顯示的 **API 網址**（格式: `https://script.google.com/macros/s/DEPLOYMENT_ID/userweb`）
3. 妥善保存此 URL

---

## 第三步: 更新 React Native 程式碼

### 3.1 替換 URL

在 `Index-updated.tsx` 中找到第 14 行:

```javascript
const GOOGLE_APPS_SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL";
```

替換為你從第二步複製的 API 網址:

```javascript
const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/userweb";
```

### 3.2 更新你的原始檔案

將 `Index-updated.tsx` 的內容複製到你的 `Index.tsx` 或相應的檔案

---

## 第四步: 測試連線

### 4.1 測試 API 是否正常

在瀏覽器中訪問你的 API URL，應該看到:

```json
{
  "success": true,
  "message": "Google Apps Script API 運作正常",
  "timestamp": "2024-..."
}
```

### 4.2 在應用中測試

1. 執行你的 React Native 應用: `npx expo start`
2. 選擇訓練日
3. 輸入一些測試資料
4. 點擊「儲存訓練」
5. 檢查你的 Google Sheet - 應該看到新資料被加入

---

## 資料結構說明

### 發送到 Google Apps Script 的 JSON 格式:

```json
{
  "date": "2024-04-16",
  "day": "Monday",
  "exercises": [
    "Squat",
    "Bench Press",
    "Deadlift",
    "Overhead Press",
    "Barbell Row"
  ],
  "sets": [
    { "weight": "100", "reps": "5" },
    { "weight": "80", "reps": "8" },
    { "weight": "120", "reps": "3" },
    { "weight": "60", "reps": "6" },
    { "weight": "90", "reps": "5" }
  ]
}
```

### Google Sheet 會儲存為:

| 日期       | 訓練日 | 項目名稱    | 重量(kg) | 次數 | 訓練量 |
| ---------- | ------ | ----------- | -------- | ---- | ------ |
| 2024-04-16 | Monday | Squat       | 100      | 5    | 500    |
| 2024-04-16 | Monday | Bench Press | 80       | 8    | 640    |
| 2024-04-16 | Monday | Deadlift    | 120      | 3    | 360    |
| ...        | ...    | ...         | ...      | ...  | ...    |

---

## 改進的功能

### 新增功能:

✅ 輸入驗證 - 只允許數字和小數點  
✅ 載入狀態 - 儲存時顯示 Loading 動畫  
✅ 錯誤處理 - 連線失敗時顯示提示訊息  
✅ 自動清空表單 - 儲存成功後清除輸入  
✅ 連線狀態指示 - 顯示是否已正確設定 API URL

---

## 常見問題排除

### Q: 「無法連線到伺服器」

**A**:

- 檢查 API URL 是否正確複製
- 確認 Google Apps Script 已部署為 Web App
- 檢查「具有存取權的使用者」是否設為「任何人」

### Q: 資料沒有出現在 Google Sheet

**A**:

- 確認 `SHEET_ID` 是否正確
- 確認工作表名稱是否為「訓練記錄」(或對應你的名稱)
- 檢查 Google Apps Script 的執行日誌: Apps Script 編輯器 > 執行日誌

### Q: 部署後做了修改，需要重新部署嗎?

**A**: 是的，修改程式碼後需要:

1. 點擊「部署」> 「管理部署」
2. 編輯現有部署
3. 更新程式碼後再次部署

---

## 下一步優化建議

1. **新增編輯/刪除功能** - 允許使用者修改舊的訓練記錄
2. **圖表顯示** - 用圖表展示訓練進度
3. **本地快取** - 網路離線時先存在裝置，連線後同步
4. **多使用者支援** - 為每個使用者建立專用工作表
5. **設定備份功能** - 定期備份到另一個 Sheet

---

## 安全注意事項

⚠️ **重要**: 這個設定方式允許「任何人」訪問你的 API。如果想要更高安全性:

1. 改為「已驗證的使用者」
2. 在 React Native 應用中加入身份驗證(如 Google Sign-In)
3. 在 Apps Script 中驗證使用者身份

目前的設定適合個人使用或小範圍分享。
