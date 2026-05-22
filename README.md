# 工廠設備維護前台 — 靜態作品集 Demo

此資料夾為**正式專案前台 UI 的離線展示版**（來源：`third-party/main`），保留原有版面、元件、配色與互動，僅將 API 改為 Mock、並匿名化所有廠名／人名／設備名稱。

**不是**重新設計的 Landing Page，也**不是**單頁 HTML 原型。

## 技術說明

| 項目 | 說明 |
|------|------|
| 框架 | Vue 3 + Vite + Pinia + Tailwind（與主專案相同） |
| Mock | `src/mock/demoAdapter.ts` 攔截 axios，不回連真實後端 |
| 環境 | `VITE_DEMO_MODE=true` 時自動寫入假 token、略過登入 |
| 首頁 | `NewHomeView` + `TreeItems` 設備樹 |
| 其他路由 | 維護單列表、開立、通報、廠務報告等（sidebar 與正式版相同） |

## 安裝與預覽

```powershell
cd demo/factory-maintenance-frontend
npm install
npm run dev
```

瀏覽器開啟終端機顯示的網址（通常為 `http://localhost:5173`）。

### 建置靜態檔（部署 GitHub Pages / 104 作品集連結）

```powershell
npm run build
npm run preview
```

產出在 `dist/`，`base` 已設為 `./` 以支援子路徑部署。

## 與主專案差異

- 僅保留 **user 前台** 路由（`VITE_BUILD_VERSION=user`）
- 頂部黃條標示「作品集 Demo」
- 附件圖片為 SVG 示意，非現場照片
- 部分進階後台路由未納入

## 手動確認清單（面試前）

- [ ] `src/demo/setup.ts` 與「我負責的內容」相關文案是否需改成你的履歷描述
- [ ] 設備樹可展開、點零件、開維護單 Modal
- [ ] 維護單列表、廠務報告、設備通報頁可開啟且列表有 mock 資料
- [ ] 廠務報告詳情內：旋轉、記號筆、放大鏡、清除
- [ ] 確認 repo 公開部署時無 `.env` 含真實 API 網址

## 目錄對照（面試口述）

| 畫面 | 主專案檔案 |
|------|------------|
| 首頁設備樹 | `NewHomeView.vue`、`TreeItems.vue` |
| 維護單開立 | `MaintenanceFormCreateViewNew.vue` |
| 維護單列表 | `TableMaintenanceFormNew.vue` |
| 異常通報 | `MachineAlarmView.vue`、`TableMachineAlarm.vue` |
| 廠務報告＋圖片工具 | `FactoryReportView.vue`、`FactoryReportMaintenanceDialog.vue` |

## 更新 Demo 程式碼

若主專案已更新，可從 `third-party/main` 重新同步 `src/`（需自行 merge mock 相關檔案）：

```powershell
# 於 repo 根目錄
git worktree add demo/_wt-main third-party/main
robocopy demo\_wt-main\src demo\factory-maintenance-frontend\src /E
# 保留 demo/factory-maintenance-frontend/src/mock 與 src/demo
```
