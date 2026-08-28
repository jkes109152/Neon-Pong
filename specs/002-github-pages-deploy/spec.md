# 功能規格：GitHub Pages 發布

## 目標

讓 NEON ARENA 可以透過 GitHub Pages 直接在線上開啟，不需要本地伺服器。

## 驗收條件

- `main` 推送時會觸發 GitHub-hosted Pages workflow。
- workflow 只讀取 repository 內容，並使用 Pages 所需的最小發布權限。
- 發布 artifact 的根目錄包含 `index.html`。
- GitHub Pages 設定中的 Source 選擇「GitHub Actions」後，可以由 workflow 發布遊戲。

## 不在範圍內

- 自訂網域、帳號、後端服務與伺服器端資料。
