# 資料模型：NEON ARENA｜Cyber Pong

## 執行期狀態

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `phase` | 字串 | `ready`、`countdown`、`playing`、`point`、`paused`、`over` |
| `level` | 字串 | `rookie`、`pro`、`elite` |
| `playerScore` / `cpuScore` | 整數 | 當局比分，勝利門檻為 7 |
| `rally` | 整數 | 連續擊球數，得分後歸零 |
| `bestRally` | 整數 | 本瀏覽器歷史最佳連擊 |
| `bestSpeed` | 數字 | 本瀏覽器歷史最快球速，顯示為 km/h |
| `muted` | 布林 | 音效偏好 |

## 遊戲物件

- `player`／`cpu`：`x`、`y`、`targetY`、`vy`；位置以 Canvas 像素表示。
- `ball`：`x`、`y`、`vx`、`vy`、`radius`、`speed`；速度每幀依 `dt` 更新。
- `particles[]`：`x`、`y`、`vx`、`vy`、`life`、`color`；只存在於單次頁面生命週期。

## 本地儲存鍵

| Key | 值 | 用途 |
| --- | --- | --- |
| `neon-arena-best-rally` | 非負數字字串 | 保存最佳連擊 |
| `neon-arena-best-speed` | 非負數字字串 | 保存最快球速 |
| `neon-arena-muted` | `true`／`false` | 保存音效開關 |
