# 累積經驗

本檔為執行工作時特有之累積經驗,留給後續之嘗試、執行與判斷,由agent自行編列、擴充與維護.

## aedes 0.x → 1.x 遷移(2026-11-09)

- **為何升**:0.51.x 有未修之安全公告且 0.x 不回補:GHSA-52qw-whmv-87c5(單一封包以 `constructor`/`__proto__` 為 topic 或 clientId 即使 broker 崩潰,1.1.3 修)、GHSA-xxqp-5qx8-gj5q、GHSA-5jvp-3p2v-5qgf、GHSA-p8r9-qf8w-p73r.實測舊版:以 `__proto__` 為 clientId 連線即逾時、以其為 topic 訂閱時連線被關閉(`ErrorWithSubackPacket: Connection closed`)、帶其訂閱之 session 重連時 `MQEmitter.removeListener` 斷言失敗(未捕捉).
- **三件同升**:aedes、aedes-persistence、aedes-persistence-level;`aedes-persistence-level` 預設匯出為 `CallBackPersistence` 雙介面,可直接傳給 aedes 1.x,不必 deep import.
- **`Aedes.createBroker` 為 async**:本套件對外為同步建構,故內部非同步啟動;若等 broker 就緒才 `listen`,同行程先啟動之 client 首次連線會被拒(多一次 close、2 秒重連),既有 2 案之事件序列即不符;改為建構時立即 `listen`、`pauseOnConnect: true`、待 broker 就緒才 `broker.handle(socket)`.aedes 以 `conn.on('readable')`/`conn.read()` 讀取,與暫停之 socket 相容(實測).
- **`broker.close()` 不關資料庫**(aedes 1.x),須自行 `db.close()`;否則同行程以同 storage 重啟時,第二個 `Level` 開啟失敗,`CallBackPersistence` 發未處理之 `error` 事件使行程崩潰(舊版 `clear()` 亦未關庫,同病).
- **`aedes` 為 ESM-only、Node ≥ 20**:`rollupFiles` 轉出之 UMD 以 `require('aedes')` 取得命名空間後用 `.Aedes`,Node 24 實測可載入(依賴 `require(esm)`,即 Node ≥ 20.19 / 22.12).
- **`aedes-server-factory` 本套件從未使用**(`net.createServer(broker.handle)` 為 aedes 1.x 文件之 TCP 作法);勿因其名稱而以為須隨 aedes 升級.
- **新預設**:`drainTimeout` 60000(原 0)、`maxInflightInbound` 1000、`maxClientsIdLength` 23(僅 MQTT 3.1 協定,本套件 client 為 3.1.1,不受限).
- **舊 storage 相容**:舊版(aedes 0.51 + level 9.1.2)寫入之 LevelDB 可由新版開啟,訂閱關係與離線 QoS1 訊息保留.

## mqtt 5.16 之行為(實測)

- 本套件 client 未讀 CONNACK 寫回 options,無須調整.
- token 錯誤:`error`『Connection refused: Bad username or password』後 `close`,**不自動重連**(連續等待 3 秒無 `reconnect`).
- 重連後 session 存在(同 storage)則不重送 subscribe;全新 storage(sessionPresent 為 false)則 client 自動重新訂閱(server 端可見 `subscribe` 事件).
- `subscribe([])` 於 5.13.3 與 5.16.1 皆回 `Invalid topic empty_topic_list`(見 state.md 已知缺口).

## 測試撰寫經驗

- **舊版驗證法**:`git archive HEAD src package.json` 解到 `./tmp/<夾>/`,於該夾 `npm i --omit=dev` 並釘舊版(`aedes-persistence-level@9.1.2 aedes-persistence@10.2.2 --save-exact`),把新測試與 `test/tools` 複製進去,用本套件之 mocha 直接跑該夾之測試檔,即得「修前」結果(不需 stash/checkout).舊版案例有逾時掛起,須給 `quiet-run --timeout`.
- **QoS1 重送**:收到訊息後立即關閉 broker,PUBACK 可能未被處理,重連後 DUP 重送(probe:無等待 3/3 重送、等 300 ms 後 2/2 不重送);重啟類測試勿斷言總筆數.
- **離線補收**:須等 server `client-out` 後才發布;新 client 以同 clientId、不呼叫 subscribe 即可補收.
- **先查後等**:server 事件已發生之競態以「先查 `startServer` 紀錄之 events,無才掛 `waitEvent`」解(查與掛之間無 await 即不漏),見 `waitServerSubscribed`.
- `waitFun`(`WPubsubClient` 等待 online 用)週期 1 秒:離線時呼叫 `publish`/`subscribe` 會被輪詢週期拉長,測試於 `connect` 後才呼叫.
- LevelDB 於 Windows 之資料夾刪除須先 `db.close()`;`fs.rmSync` 加 `maxRetries`.
