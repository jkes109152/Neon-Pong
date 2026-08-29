# NEON ARENA｜Cyber Pong

一款以電競舞台為視覺方向的單人 Canvas 乒乓遊戲。玩家對戰電腦 AI，先取得 7 分者獲勝。

## 直接開啟

[立即遊玩 NEON ARENA](https://jkes109152.github.io/Neon-Pong/)

## 執行

直接開啟 `index.html` 即可遊玩。若瀏覽器限制本地檔案的音效或儲存功能，可在專案目錄執行：

```bash
python3 -m http.server 4173
```

再開啟 <http://localhost:4173>。

操作方式：

- 鍵盤：`W` / `S` 或 `↑` / `↓`
- 滑鼠／觸控：在球桌上移動指標
- `空白鍵` 或右上角按鈕：暫停／繼續

## 專案文件

- [功能規格](specs/001-neon-arena/spec.md)
- [技術計畫](specs/001-neon-arena/plan.md)
- [研究紀錄](specs/001-neon-arena/research.md)
- [資料模型](specs/001-neon-arena/data-model.md)
- [快速驗收](specs/001-neon-arena/quickstart.md)
- [任務清單](specs/001-neon-arena/tasks.md)

## 測試

```bash
npm test
node --check game.js
```

本專案不使用外部執行期套件；GitHub Pages 可直接發布靜態檔案。`.github/workflows/validate.yml` 會在 Pull Request 與 `main` 推送時執行靜態驗證。

## GitHub Pages 發布

專案已附上 `.github/workflows/deploy-pages.yml`。合併至 `main` 後，在 repository 的 **Settings → Pages → Build and deployment → Source** 選擇 **GitHub Actions**，再等待「發布 NEON ARENA 至 GitHub Pages」workflow 完成即可。

發布設計文件：`specs/002-github-pages-deploy/`。
