# 規則帳本

本檔為套件設計與開發階段之規則帳本,為要求程式碼須長成什麼樣,或由規格產出之測試(項目/說明/流程)有哪些,包含軸、單一擁有者、已知限制、破壞性變更紀錄,以及對應是哪些測試檔案或指令等,由agent自行編列、擴充與維護.

現況(各功能做到哪裡、已知缺口)見 `sgud/state/state.md`;累積經驗見 `sgud/exp/experience.md`.

## 一、程式規則(broker 與持久化)

### R-ARCH-01 建立 broker 一律 `await Aedes.createBroker(opts)`,具名匯入

- 規則:aedes 1.x 移除預設匯出,`aedes(opts)` 會丟錯;持久化 setup 為 async,須 await 啟動完成才可處理連線(遷移指南 `node_modules/aedes/docs/MIGRATION.md`).
- 盤點:Grep `from 'aedes'` 於 `src/`.
- 站點全集:`src/WPubsubServer.mjs:1`(`import { Aedes } from 'aedes'`)、`:171` 起 `start()` 內 `await Aedes.createBroker(...)`——已套.
- 判準:`src/` 內無 `import Aedes from 'aedes'`、無 `Aedes(`(不含 `Aedes.createBroker(`)之呼叫.

### R-ARCH-02 對外維持同步建構;監聽即時、連線延後交給 broker

- 規則:`new WPubsubServer(opt)` 仍同步回傳事件物件;`server.listen` 於建構時立即執行(與 0.x 相同),`net.createServer({ pauseOnConnect: true })` 之連線先暫停,待 broker 就緒(`pmStart`)才 `broker.handle(socket)`;broker 啟動失敗時 socket 即被銷毀並發 `broker-error`,不得成為未處理之拒絕.
- why:先 `createBroker` 完再 `listen` 時,同行程中先啟動之 client 首次連線被拒,多一次 close 與 2 秒重連,既有 2 案(`pubsub.test.mjs`、`pubsub_comu.test.mjs`)之事件序列即不符.
- 站點:`src/WPubsubServer.mjs` `pmStart`、`server`(同檔唯一站點).
- 測試:`test/pubsub.test.mjs`、`test/pubsub_comu.test.mjs`(事件序列);`test/api-persistence.test.mjs` R-PERSIST-03(啟動失敗之錯誤路徑).

### R-ARCH-03 `clear()` 之關閉順序:等啟動結束 → broker → server → 資料庫

- 規則:`clear()` 須先 `await pmStart`,再依序 `broker.close`、`server.close`、`db.close()`.aedes 1.x 之 `broker.close()` 不關閉持久化資料庫,不自行關閉則同行程無法以同 `storage` 重啟(LevelDB 鎖;舊版實測會以未處理 error 事件使行程崩潰).`server` 未在監聽(如 listen 失敗)時 `closeServer` 直接完成.
- 站點:`src/WPubsubServer.mjs` `clear`、`closeBroker`、`closeServer`、`closeDb`.
- 測試:`test/api-persistence.test.mjs` R-PERSIST-02;`test/api-restart.test.mjs` R-RECONNECT-01.

### R-ARCH-04 aedes、aedes-persistence、aedes-persistence-level 須同升

- 規則:aedes 1.x 之持久化介面為 async,須搭配 aedes-persistence ≥ 11、aedes-persistence-level ≥ 9.1.2(本套件取 9.2.0,含 `cleanIncoming`);三者之 `package.json` 宣告為 `^1.2.0`、`^11.0.0`、`^9.2.0`.`aedes-persistence-level` 之預設匯出為 `CallBackPersistence` 雙介面(無 callback 時回傳 Promise,`setup` 為 async),可直接用於 aedes 1.x,不需 deep import `asyncPersistence.js`.
- 盤點:Grep `"aedes` 於 `package.json`.
- 判準:三者主版號符合上列;`npm ls aedes aedes-persistence aedes-persistence-level` 無 invalid.

### R-ARCH-05 以線上輸入為鍵之物件查表須有守門

- 規則:clientId、topic、訊息 `id` 皆由對方決定,若以普通物件(`{}`)為鍵查表,`__proto__`、`constructor` 等會取到原型上之值(GHSA-52qw-whmv-87c5 之同類).須用 `Object.create(null)`、`Map`、`Object.hasOwn`,或查表前有型別/成員守門.
- 盤點:Grep `kpPm|kpTopic` 於 `src/`;Grep `hasOwnProperty` 於 `src/`(應為 0).
- 站點全集與判準(2026-11-09):
  - `src/WPubsubClientComu.mjs:243` `get(kpPm, id, null)`,`id` 為線上輸入——**刻意不套**:查得值後以 `ispm(pm)` 守門,原型上之值非 Promise 即返回,另 `kpPm[id]`(`:337`)與 `delete kpPm[id]`(`:367`)之 `id` 為本地 `genID()`,非線上輸入.
  - `src/WPubsubClientComu.mjs:155` `get(kpTopic, topic, '')`——**刻意不套**:`:124` 已以 `topics.indexOf(topic)` 守門,`kpTopic` 之寫入(`:72`)鍵為本地 funcs.
  - 測試:`test/api-proto-key.test.mjs` R-CLIENT-01(以 6 個原型名稱為 id 發布 input/output 訊息,服務端照常回應、未誤判、未污染原型).

## 二、測試規則(由規格產出之測試項目)

測試皆為本機起 broker 與 client、不連外之整合測試;以事件同步,不以固定延時偵測(僅以逾時防懸置);臨時資料放 `test/_tmp/<案名>/`,由 `before`/`after` 清除;輔助放 `test/tools/pubsubTestHelper.mjs`(不帶 `.test.`).

| 規則 | 描述 | 測試檔(`it` 標題以規則編號開頭) |
|---|---|---|
| R-BROKER-01 | QoS 0/1/2 發布皆送達訂閱者,主題與內容(字串/數字/物件)一致,server 端 publish/subscribe/client-in 事件正確 | `test/api-roundtrip.test.mjs` |
| R-BROKER-02 | 未訂閱之主題(含子層級)不送達 | `test/api-roundtrip.test.mjs` |
| R-BROKER-03 | unsubscribe 後不再收到 | `test/api-roundtrip.test.mjs` |
| R-AUTH-01 | token 錯誤或空者被拒:`error`『Connection refused: Bad username or password』後 `close`,不 connect(mqtt 5.16 實測不自動重連),server 無 client-in | `test/api-roundtrip.test.mjs` |
| R-PERSIST-01 | client 離線期間之 QoS1/2 於同 clientId 重連後依序補收且不需 subscribe,QoS0 不補收 | `test/api-persistence.test.mjs` |
| R-PERSIST-02 | 資料寫入 storage;broker 關閉、同 storage 重啟後離線訊息與訂閱關係仍在 | `test/api-persistence.test.mjs` |
| R-PERSIST-03 | storage 被另一 server 占用時,後啟動者發 `broker-error`、連線被關、不崩潰,先啟動者不受影響,`clear()` 可結束 | `test/api-persistence.test.mjs` |
| R-RECONNECT-01 | broker 關閉後以同 storage 重啟,client 自動重連(connect)並可再收發、再訂閱 | `test/api-restart.test.mjs` |
| R-RECONNECT-02 | 以全新 storage 重啟(無舊 session),client 重連後自動重新訂閱,可再收發 | `test/api-restart.test.mjs` |
| R-BROKER-04a/b/c/d | 以 `__proto__`、`constructor`、`toString`、`hasOwnProperty`、`valueOf`、`prototype` 為 clientId、完整 topic、重複 clientId 取代連線,broker 不崩潰且一般連線仍可用,無 uncaughtException、無 broker-error(驗 GHSA-52qw-whmv-87c5 修補) | `test/api-proto-key.test.mjs` |
| R-CLIENT-01 | 見 R-ARCH-05 | `test/api-proto-key.test.mjs` |
| (既有)事件序列 | server/client 事件之整體序列(`pubsub.test.mjs`)與服務調用(`pubsub_comu.test.mjs`) | `test/pubsub.test.mjs`、`test/pubsub_comu.test.mjs` |

### 埠與資料夾分配(固定,≥ 8000,各測試檔不同)

| 檔 | 埠 | storage |
|---|---|---|
| `pubsub.test.mjs`(既有) | 8080 | `./_db`(cwd) |
| `pubsub_comu.test.mjs`(既有) | 8081 | `./_db_comu`(cwd) |
| `api-roundtrip.test.mjs` | 8761 | `test/_tmp/api-roundtrip/db` |
| `api-persistence.test.mjs` | 8762、8765(R-PERSIST-03 之第二 server) | `test/_tmp/api-persistence/db` |
| `api-restart.test.mjs` | 8763 | `test/_tmp/api-restart/db1`、`db2` |
| `api-proto-key.test.mjs` | 8764 | `test/_tmp/api-proto-key/db` |

8766-8769 為探測腳本(`./tmp/`)保留,不入測試.

### 改動範圍 → 測試檔

| 改動 | 須跑 |
|---|---|
| `src/WPubsubServer.mjs`(broker、持久化、關閉、驗證) | 全部(`npm test`,約 10 秒) |
| `src/WPubsubClient.mjs`(連線、訂閱、發布) | 全部 |
| `src/WPubsubClientComu.mjs` | `pubsub_comu.test.mjs`、`api-proto-key.test.mjs` |
| 升級 aedes、aedes-persistence、aedes-persistence-level、mqtt | 全部,另驗 R-ARCH-04 |

### 測試所依之行為(改動時須同步檢查)

- QoS1 為至少一次:client 收到訊息後立即關閉 broker,其 PUBACK 可能尚未被處理,重連後以 DUP 重送;故重啟類測試不斷言總筆數(`api-restart.test.mjs` R-RECONNECT-01).
- 離線補收之測試須等 server 端 `client-out` 後才發布,否則訊息屬即時送達而非離線期間.
- `WPubsubClient` 之 `subscribe`/`publish` 以 `wsemi` `waitFun` 等待 online(週期 1 秒、至多 200 次);測試於 `connect` 事件後才呼叫,避免被輪詢週期拉長.

## 三、破壞性變更紀錄

- 2026-11-09:改用 aedes 1.2.0(原 0.51.3;0.x 無安全公告回補,見 `sgud/exp/experience.md`).對外 API 無簽名變更;須 Node.js ≥ 20(UMD 載入 ESM-only 之 aedes 另須 ≥ 20.19 / 22.12);`clear()` 現在亦關閉資料庫;broker 啟動失敗改發 `broker-error`.詳見 `README.md`〈Upgrade notes〉.
