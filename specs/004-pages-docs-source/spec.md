# 功能規格：GitHub Pages `/docs` 發布修正

## 問題

目前 GitHub Pages 使用 `main` 分支的 `/docs` 作為發布來源，但 repository 中沒有 `docs/`，因此 Pages/Jekyll 在切換工作目錄時失敗，出現 `No such file or directory @ dir_chdir0 - /github/workspace/docs`。

## 目標

在不改變遊戲功能與視覺的前提下，讓目前的 GitHub Pages 分支發布設定可以直接成功發布 NEON ARENA。

## 驗收條件

- repository 存在 `docs/index.html`、`docs/styles.css`、`docs/game.js`。
- `docs/` 內的三個遊戲檔案與根目錄版本內容完全一致。
- `docs/.nojekyll` 存在，讓 GitHub Pages 以純靜態網站方式發布。
- `npm test` 會驗證 `docs/` 發布副本存在且與根目錄一致。
- 不改動遊戲玩法、AI、控制方式與 UI。

## 架構決策

- 根目錄仍是開發與測試的單一真實來源。
- `docs/` 是 GitHub Pages 的發布鏡像。
- 本修正配合目前 Pages 的 `main /docs` 設定，不依賴修改 repository Pages Source 設定。

## 不在範圍內

- 自訂網域。
- 後端服務。
- 遊戲玩法或美術重製。
