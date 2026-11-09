# 現況(state)

本檔只記現況,不寫過程(過程見 `sgud/exp/experience.md`);規則與測試對應見 `sgud/rule/rulebook.md`.

## 最近一次驗證

- 2026-11-09:aedes 1.2.0、aedes-persistence 11.0.0、aedes-persistence-level 9.2.0、mqtt 5.16.1、Node.js 24;`npm test` 16/16 綠(連跑 5 次皆綠);eslint 於改動檔 0 error;以 `toolg/gDistRollup.mjs` 相同選項於 `./tmp` 試建 UMD 並以 `require` 載入、往返成功.
- 版號 1.0.46 未動,未發布(發布由使用者之自動化流程處理).

## 功能現況

| 功能 | 狀態 | 規則帳本 | 測試 |
|---|---|---|---|
| `WPubsubServer`:TCP(MQTT 3.1.1)broker,token 驗證(`opt.tokens`,空陣列則不驗)、LevelDB 持久化(`opt.storage`)、事件(`server-listen`、`client-in`、`client-out`、`subscribe`、`publish`、`server-error`、`broker-error`、`client-error`)、`clear()` | 完成;基於 aedes 1.2.0 | R-ARCH-01~04、R-BROKER-01~04、R-AUTH-01、R-PERSIST-01~03 | `test/api-roundtrip.test.mjs`、`test/api-persistence.test.mjs`、`test/api-proto-key.test.mjs`、`test/pubsub.test.mjs` |
| `WPubsubClient`:持久 session(`clean:false`)、token、自動重連、`subscribe`/`unsubscribe`/`publish`/`clear` | 完成;基於 mqtt 5.16.1,未讀取 CONNACK 寫回之 options,無須調整 | R-AUTH-01、R-RECONNECT-01~02 | `test/api-roundtrip.test.mjs`、`test/api-restart.test.mjs`、`test/pubsub.test.mjs` |
| `WPubsubClientComu`:以 pub/sub 包裝之服務調用(`reqServiceFunc`、`procFun`) | 完成 | R-ARCH-05、R-CLIENT-01 | `test/pubsub_comu.test.mjs`、`test/api-proto-key.test.mjs` |
| Worker 版(`dist/*.wk.umd.js`)、UMD 版(`dist/*.umd.js`) | 由發布流程自動產製,本次未動 `dist/` 與 `toolg/` | — | UMD server 於 `./tmp` 試建並載入驗證(非入庫測試) |

## 與 0.x 相比之行為(已實作,使用端須知,詳見 README〈Upgrade notes〉)

- Node.js ≥ 20;UMD 版載入 ESM-only 之 aedes 靠 `require(esm)`,須 Node.js ≥ 20.19 / 22.12.
- `new WPubsubServer(opt)` 仍同步;broker 於內部非同步啟動,埠即時監聽、連線待 broker 就緒才處理.
- `clear()` 現在亦關閉 LevelDB,同行程可立即以同 `storage` 重啟.
- broker 啟動失敗(如 `storage` 被另一行程占用)發 `broker-error`.
- aedes 1.x 預設:`drainTimeout` 60000 ms(逾時未排空之慢 client 被斷線)、`maxInflightInbound` 1000.
- 以舊版(aedes 0.51)寫入之 `storage` 可由新版原地開啟,訂閱關係與離線訊息保留(2026-11-09 以 `./tmp` 兩段式腳本實測).

## 已知缺口與待辦

- (2026-11-09 已處置)`aedes-server-factory` 從未被引用且其相依 `ws` 7.x 有 high 公告(GHSA-96hv-2xvq-fx4p)→ 主控裁定移除(`npm uninstall`),移除後全套 16 綠.
- `tokens` 為空陣列時允許所有連線(`src/WPubsubServer.mjs:133-138`,JSDoc 已載明):主控裁定本輪維持;改為預設拒絕屬對使用端之收嚴,待有需求再議.
- 既有 2 案(`pubsub.test.mjs`、`pubsub_comu.test.mjs`)尚未依測試規範整理(`api-` 前綴、離開常用埠 8080/8081、資料夾遷入 `test/_tmp/`、事件同步):另輪處理.
- `WPubsubClientComu` 以空 `funcs`(僅調用、不提供服務,README/JSDoc 之正式用法)建構時,`procSubscribe` 因 `isearr([])` 為 false 把 `[]` 包成 `[[]]`,呼叫 `subscribe([])` 後印出 `subscribe topic[] catch Error: Invalid topic empty_topic_list`(mqtt 5.13.3 與 5.16.1 行為相同,非升級引入);功能不受影響,僅雜訊.未修.
- 既有 2 案(`pubsub.test.mjs`、`pubsub_comu.test.mjs`)未依測試規範分層命名(無 `unit-`/`api-` 前綴)、使用常用埠 8080/8081、資料夾落在 cwd(`./_db`、`./_db_comu`)、以 `setTimeout` 計時蒐集事件序列;本次不動,視為基準線,日後可改為事件同步並遷入 `test/_tmp/`.
- `srv.mjs` 之 `setTimeout(..., 11116000)` 為示範腳本,不影響套件.
