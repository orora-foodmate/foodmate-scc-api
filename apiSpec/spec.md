# API SPEC

## 登入

### 使用者登入

```
登入取回 Token
```

route: /login

method: POST

```json
request: {
  employee
    - required
    - string

  password
    - required
    - string
}
```

response:

#### Success:

---

```json
{
  success: true,
    - required
    - boolean
  data: {
    token
      - string
      - required
  }
}
```

#### Error:

## status: 400

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### Error Status

- 0 - 密碼錯誤
- 1 - 使用者不存在

## 招募概況

### 兼職人員數量 與比例

route: /recruitment/statistics

method: GET

Header

- Authorization : token

request: {}

response:

#### Success:

---

```json
{
  success: true,
    - required
    - boolean
  data: {
    total_count: number, // 兼職人員總數 default: 0
      - number
      - default: 0
    today_count: number, // 今日新增 default: 0
      - number
      - default: 0
    yesterday_count: number // 昨日新增 default: 0
      - number
      - default: 0
    week_count: number // 過去 7 天新增 default: 0
      - number
      - default: 0

    charts: { // Jerry 會協助計算，到時候確認再補 response
      areas: []
      banks: [],
      security_deposit: []
    }
  }
}
```

#### Error:

## status: 400

```json
{
  "message": string,
  "status": 0
}
```

#### Error Status

- 0 - server sql error

## 兼職人員

### 檢查欄位

route: /users/check/field

method: POST

Header

- Authorization : token

request:

```json
{
  type
    - required
    - string
    - enums: ["account", "phone", "qq", "skype", "wechat"]
  value: ""
    - required
    - string
}
```

---

檢驗規則

- 用戶名 (account)
  - 是否有重複的用戶名
- 聯絡手機號
  - 符合手機格式
  - 是否有重複的手機號
- QQ
  - 是否有重複的 QQ 號
- skype
  - 是否有重複的 skype 帳號
- wechat
  - 是否有重複的 wechat 帳號

response:

#### Success:

---

```json
{
  success: true,
    - required
    - boolean
  repeat: true,
    - requied
    - boolean
  message
    - required
    - string
}
```

#### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### Error Status

- 0 - server sql error

### 新增兼職人員

route: /users

method: POST

Header

- Authorization : token

request:

```json
{
  account
    - required
    - string
  name: ""
    - required
    - string
  acc_type: ""
    - required
    - string
    - enums: ["normal", "tie_card"]
      - normal 一般
      - tie_card 加綁卡
  beyond_experience: true
    - required
    - boolean
    - 是否超出體驗
  salesId: ""
    - required
    - string
    - 個人代碼
  area: ""
    - required
    - string
    - enums: [] //跟 Jerry 取
    - 區域
  province: ""
    - required
    - string
    - enums: [] //跟 Jerry 取
    - 省份
  phone: ""
    - required
    - string
    - repeat 需要檢查，可以多號共用
    - 聯絡手機號
  qq: ""
    - required
    - string
    - repeat 需要檢查，可以多號共用
    - qq
  qq_name: ""
    - required
    - string
    - qq 名稱
  skype: ""
    - required
    - string
    - repeat 需要檢查，可以多號共用
    - skype 帳號
  skype_name: ""
    - required
    - string
    - skype 名稱
  wechat: ""
    - required
    - string
    - repeat 需要檢查，可以多號共用
  wechat_name: ""
    - required
    - string
  cv_type: ""
    - required
    - string
    - enums: ["experience", "unionPay", "cloudQuickPay"]
      - experience: 體驗方案
      - unionPay: 銀行卡
      - cloudQuickPay: 雲閃付
  margin_amount: 0
    - required
    - number
    - enums: [] // 抓系統設定跟 Jerry 確認
  bank_account: ""
    -required
    - string
    - 戶名
  bank_name: ""
    - required
    - string
    - enums: [] // 跟系統要 (Jerry)
  cv_init: 0
    - required
    - number
    - 初始金額
  device_brand: ""
    - required
    - string
    - enums [] // 跟系統要(Jerry)
  device_model
    - required
    - string
    - enums [] // 跟系統要(Jerry)
  imei_1: ""
    - required
    - string
  imei_2: ""
    - required
    - string
  ip: ""
    - required
    - string
  app_login_ip: ""
    - required
    - string
  package_login_ip: ""
    - required
    - string
}
```

response:

#### Success:

---

```json
{
  success: true,
    - required
    - boolean
}
```

#### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### Error Status

- 0 - server sql error

### 編輯兼職人員

route: /users

method: PUT

Header

- Authorization : token

request:

```json
{
  account
    - required
    - string
  name: ""
    - required
    - string
  type: ""
    - required
    - string
    - enums: ["normal", "tie_card"]
      - normal 一般
      - tie_card 加綁卡
  beyond_experience: true
    - required
    - boolean
    - 是否超出體驗
  salesId: ""
    - required
    - string
    - 個人代碼
  area: ""
    - required
    - string
    - enums: [] //跟 Jerry 取
    - 區域
  province: ""
    - required
    - string
    - enums: [] //跟 Jerry 取
    - 省份
  phone: ""
    - required
    - string
    - repeat 需要檢查，可以多號共用
    - 聯絡手機號
  qq: ""
    - required
    - string
    - repeat 需要檢查，可以多號共用
    - qq
  qq_name: ""
    - required
    - string
    - qq 名稱
  skype: ""
    - required
    - string
    - repeat 需要檢查，可以多號共用
    - skype 帳號
  skype_name: ""
    - required
    - string
    - skype 名稱
  wechat: ""
    - required
    - string
    - repeat 需要檢查，可以多號共用
  wechat_name: ""
    - required
    - string
  cv_type: ""
    - required
    - string
    - enums: ["experience", "unionPay", "cloudQuickPay"]
      - experience: 體驗方案
      - unionPay: 銀行卡
      - cloudQuickPay: 雲閃付
  margin_amount: 0
    - required
    - number
    - enums: [] // 抓系統設定跟 Jerry 確認
  bank_account: ""
    -required
    - string
    - 戶名
  bank_name: ""
    - required
    - string
    - enums: [] // 跟系統要 (Jerry)
  cv_init: 0
    - required
    - number
    - 初始金額
  device_brand: ""
    - required
    - string
    - enums [] // 跟系統要(Jerry)
  device_model
    - required
    - string
    - enums [] // 跟系統要(Jerry)
  imei_1: ""
    - required
    - string
  imei_2: ""
    - required
    - string
  ip: ""
    - required
    - string
  app_login_ip: ""
    - required
    - string
  package_login_ip: ""
    - required
    - string
}
```

response:

#### Success:

---

```json
{
  success: true,
    - required
    - boolean
}
```

#### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### Error Status

- 0 - server sql error

### 拉黑人員

route: /users/block/:user_id

method: POST

Header

- Authorization : token

---

request

```json
{}
```

---

response:

#### Success:

---

```json
{
  success: true,
    - required
    - boolean
    - true: 拉黑成功, false: 拉黑失敗
}
```

#### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### Error Status

- 0 - server sql error

### 將兼職人員移出黑名單

route: /users/block/:user_id

method: DELETE

Header

- Authorization : token

---

request

```json
{}
```

---

response:

#### Success:

---

```json
{
  success: true,
    - required
    - boolean
    - true: 移出黑名單成功, false: 移出黑名單失敗
}
```

#### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### Error Status

- 0 - server sql error

### 刪除兼職人員

route: /users/:user_id

method: DELETE

Header

- Authorization : token

---

request

```json
{}
```

---

response:

#### Success:

---

```json
{
  success: true,
    - required
    - boolean
    - true: 刪除成功, false: 刪除失敗
}
```

#### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### Error Status

- 0 - server sql error

### 檢查新增人員資料

route: /users/check

method: POST

Header

- Authorization : token

request:

```json
{
  account
    - required
    - string
  name: ""
    - required
    - string
  type: ""
    - required
    - string
    - enums: ["normal", "tie_card"]
      - normal 一般
      - tie_card 加綁卡
  beyond_experience: true
    - required
    - boolean
    - 是否超出體驗
  salesId: ""
    - required
    - string
    - 個人代碼
  area: ""
    - required
    - string
    - 區域
  province: ""
    - required
    - string
    - 省份
  phone: ""
    - required
    - string
    - repeat 需要檢查，可以多號共用
    - 聯絡手機號
  qq: ""
    - required
    - string
    - repeat 需要檢查，可以多號共用
    - qq
  qq_name: ""
    - required
    - string
    - qq 名稱
  skype: ""
    - required
    - string
    - repeat 需要檢查，可以多號共用
    - skype 帳號
  skype_name: ""
    - required
    - string
    - skype 名稱
  wechat: ""
    - required
    - string
    - repeat 需要檢查，可以多號共用
  wechat_name: ""
    - required
    - string
  cv_type: ""
    - required
    - string
    - enums: ["experience", "unionPay", "cloudQuickPay"]
      - experience: 體驗方案
      - unionPay: 銀行卡
      - cloudQuickPay: 雲閃付
  margin_amount: 0
    - required
    - number
    - enums: [] // 抓系統設定跟 Jerry 確認
  bank_account: ""
    -required
    - string
    - 戶名
  bank_name: ""
    - required
    - string
    - enums: [] // 跟系統要 (Jerry)
  cv_init: 0
    - required
    - number
    - 初始金額
  device_brand: ""
    - required
    - string
    - enums [] // 跟系統要(Jerry)
  device_model
    - required
    - string
    - enums [] // 跟系統要(Jerry)
  imei_1: ""
    - required
    - string
  imei_2: ""
    - required
    - string
  ip: ""
    - required
    - string
  app_login_ip: ""
    - required
    - string
  package_login_ip: ""
    - required
    - string
}
```

驗證規則

```
取資料庫中黑名單驗證欄位
針對那些欄位做檢查驗證

```

response:

#### Success:

---

```json
{
  success: true,
    - required
    - boolean
    - true: 驗證通過, false: 驗證失敗
  data: {
    block_users: []
  }
}
```

#### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### Error Status

- 0 - server sql error

### 黑名單列表

route: /users/block

method: GET

Header

- Authorization : token

request:

```json
{
  account: ""
    - option
    - string
  cname: ""
    - option
    - string
    - 姓名
  phone: ""
    - option
    - string
  qq: ""
    - option
    - string
  skype: ""
    - option
    - string
  bank_account: ""
    - option
    - string
    - 戶名
  imie_1: ""
    - option
    - string
  imie_2: ""
    - option
    - string
  page: 1
    - option
    - number
    - default: 1
  size: 10
    - option
    - number
    - default: 10
    - min: 1
    - max: 50
}
```

---

response:

#### Success:

---

```json
{
  success: true,
    - required
    - boolean
  data: {
    users: [
      {
        account
          - required
          - string
        cname: ""
          - required
          - string
          - 姓名
        phone: ""
          - required
          - string
          - repeat 需要檢查，可以多號共用
          - 聯絡手機號
        qq: ""
          - required
          - string
          - repeat 需要檢查，可以多號共用
          - qq
        qq_name: ""
          - required
          - string
          - qq 名稱
        skype: ""
          - required
          - string
          - repeat 需要檢查，可以多號共用
          - skype 帳號
        skype_name: ""
          - required
          - string
          - skype 名稱
        wechat: ""
          - required
          - string
          - repeat 需要檢查，可以多號共用
        wechat_name: ""
          - required
          - string
        area: ""
          - required
          - string
          - 區域
        province: ""
          - required
          - string
          - 省份
        device_brand: ""
          - required
          - string
          - 設備品牌
        device_model
          - required
          - string
          - 設備型號
        cv_type: ""
          - required
          - string
          - enums: ["experience", "unionPay", "cloudQuickPay"]
            - experience: 體驗方案
            - unionPay: 銀行卡
            - cloudQuickPay: 雲閃付
        margin_amount: 0
          - required
          - number
        imei_1: ""
          - required
          - string
        imei_2: ""
          - required
          - string
        ip: ""
          - required
          - string
        app_login_ip: ""
          - required
          - string
        package_login_ip: ""
          - required
          - string
        cv_init: 0
          - required
          - number
          - 初始金額
        bank_account: ""
          -required
          - string
          - 戶名
        bank_name: ""
          - required
          - string
          - 銀行名稱
      }
    ],
    total_page: 1
      - required
      - number
    page: 1
      - required
      - number
      - min: 1
    size: 10
      - required
      - number
      - default: 10
  }
}
```

#### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### Error Status

- 0 - server sql error

### 兼職人員列表

route: /users

method: GET

request:

```json
{
  cdt_start
    - option
    - string
  cdt_end
    - option
    - string
  account: ""
    - option
    - string
  cname: ""
    - option
    - string
    - 姓名
  phone: ""
    - option
    - string
  qq: ""
    - option
    - string
  skype: ""
    - option
    - string
  bank_account: ""
    - option
    - string
    - 戶名
  imie_1: ""
    - option
    - string
  imie_2: ""
    - option
    - string
  operator
    - option
    - string
    - 建立者
    - mapping from admin_emp.empname
  exper
    - option
    - boolean
    - 是否超出體驗
  cv_type: ""
    - required
    - string
    - enums: ["experience", "unionPay", "cloudQuickPay"]
      - experience: 體驗方案
      - unionPay: 銀行卡
      - cloudQuickPay: 雲閃付
  margin_amount: 0
    - required
    - number
    - enums: [] // 抓系統設定跟 Jerry 確認
  area: ""
    - required
    - string
    - enums: [] //跟 Jerry 取
    - 區域
  province: ""
    - required
    - string
    - enums: [] //跟 Jerry 取
    - 省份
  type: ""
    - required
    - string
    - enums: [0, 1]
      - 0: 一般卡
      - 1: 加綁卡
  page: 1
    - option
    - default: 1
    - min: 1
  size: 20
    - option
    - default: 20
    - min: 1
    - max: 50
}
```

---

response:

#### Success:

---

```json
{
  success: true,
    - required
    - boolean
  data: {
    success: true,
      - required
      - boolean
    users: [
      {
        account
          - required
          - string
        cname: ""
          - required
          - string
          - 姓名
        type: ""
          - required
          - string
          - enums: ["normal", "tie_card"]
            - normal 一般
            - tie_card 加綁卡
        salesId: ""
          - required
          - string
          - 個人代碼
        phone: ""
          - required
          - string
          - repeat 需要檢查，可以多號共用
          - 聯絡手機號
        qq: ""
          - required
          - string
          - repeat 需要檢查，可以多號共用
          - qq
        qq_name: ""
          - required
          - string
          - qq 名稱
        skype: ""
          - required
          - string
          - repeat 需要檢查，可以多號共用
          - skype 帳號
        skype_name: ""
          - required
          - string
          - skype 名稱
        wechat: ""
          - required
          - string
          - repeat 需要檢查，可以多號共用
        wechat_name: ""
          - required
          - string
        area: ""
          - required
          - string
          - 區域
        province: ""
          - required
          - string
          - 省份
        device_brand: ""
          - required
          - string
          - 設備品牌
        device_model
          - required
          - string
          - 設備型號
        cv_type: ""
          - required
          - string
          - enums: ["experience", "unionPay", "cloudQuickPay"]
            - experience: 體驗方案
            - unionPay: 銀行卡
            - cloudQuickPay: 雲閃付
        margin_amount: 0
          - required
          - number
        imei_1: ""
          - required
          - string
        imei_2: ""
          - required
          - string
        exper
          - required
          - boolean
          - 是否超出體驗
        ip: ""
          - required
          - string
        app_login_ip: ""
          - required
          - string
        package_login_ip: ""
          - required
          - string
        cv_init: 0
          - required
          - number
          - 初始金額
        bank_account: ""
          -required
          - string
          - 戶名
        bank_name: ""
          - required
          - string
          - 銀行名稱
        cdt: ""
          - required
          - string
          - 建立時間
        operator
          - required
          - string
          - 建立者
          - mapping from admin_emp.empname
      }
    ],
    total_page: 1
      - required
      - number
      total_page: 1
      - required
      - number
    page: 1
      - required
      - number
      - min: 1
    size: 10
      - required
      - number
      - default: 10
  }
}
```

#### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### Error Status

- 0 - server sql error

## 操作記錄

### 取回操作記錄

route: /logs

method: GET

Header

- Authorization : token

---

request

```json
  {
    cdt_start: ""
      - option
      - string
    cdt_end: ""
      - option
      - string
    account: ""
      - option
      - string
    backend_account: ""
      - option
      - string
    action: ""
      - option
      - string
      enums: [
        "create", // 新增
        "update", // 編輯
        "delete", // 刪除
        "block", // 拉黑
        "unblock" // 移出黑名單
      ]
  }
```

---

response

#### Success

```json
{
  success: true,
    - required
    - boolean
  data: {
    logs: [{
      cdt: ""
        - requried
        - string
      backend_account: ""
        - required
        - string
      action: ""
        - required
        - string
        - enums: [
          "新增",
          "編輯",
          "刪除",
          "移出黑名單",
          "拉黑"
        ],
      account: ""
        -required
        - string
    }],
    total_page: 1
      - required
      - number
    page: 1
      - required
      - number
      - min: 1
    size: 10
      - required
      - number
      - default: 10
  }
}
```

#### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### Error Status

- 0 - server sql error

## 後台帳號設置

### 新增後台帳號

route: /backend_users

method: POST

Header

- Authorization : token

---

request

```json
  {
    employee
      - required
      - string
    actid
      - required
      - number
      - mapping from admin_actor_id
  }
```

規則

- 密碼預設: a12345678
- 狀態預設是 啟用
- 帳號不可重複

---

response

#### Success

```json
{
  success: true,
    - required
    - boolean
    - true: 驗證通過, false: 驗證失敗
  data: {
    backend_user_id
      - number
      - required
      - user id
  }
}
```

#### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### Error Status

- 0 - server sql error

### 後台帳號列表

route: /backend_users

method: GET

Header

- Authorization : token

---

request

```json
{}
```

---

response

#### Success

```json
{
  success: true,
    - required
    - boolean
  data: {
    users: [{
      employee: ""
        - required
        - string
      actid: ""
        - required
        - string
        - enums: ["組員", "組長", "經理", "總管理者"]
      status:
        - required
        - 要看Jerry 的 DB 設計
      permissions: [] //看 Jerry DB設計再處理
    }]
  }
}
```

#### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### Error Status

- 0 - server sql error

### 編輯後台帳號

route: /backend_users

method: PUT

Header

- Authorization : token

---

request

```json
  {
    employee: ""
      - required
      - string
    actid: ""
      - required
      - string
      - enums: ["組員", "組長", "經理", "總管理者"]
    status: ""
      - required
      - 要看Jerry 的 DB 設計
  }
```

規則

- 帳號不可重複

---

response

#### Success

```json
{
  success: true,
    - required
    - boolean
    - true: 驗證通過, false: 驗證失敗
  data: {
    user: {
      account: ""
        - required
        - string
      actor: ""
        - required
        - string
        - enums: ["組員", "組長", "經理", "總管理者"]
      status:
        - required
        - 要看Jerry 的 DB 設計
    }
  }
}
```

#### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### Error Status

- 0 - server sql error

### 重置後台帳號密碼

route: /backend_users/password/:user_id

method: PUT

Header

- Authorization : token

---

request

```json
{}
```

規則

---

response

#### Success

```json
{
  success: true,
    - required
    - boolean
    - true: 修改通過, false: 修改失敗
}
```

#### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### Error Status

- 0 - server sql error

### 刪除後台帳號

route: /backend_users

method: DELETE

Header

- Authorization : token

---

request

```json
{}
```

規則

---

response

#### Success

```json
{
  success: true,
    - required
    - boolean
    - true: 刪除通過, false: 刪除失敗
}
```

#### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### Error Status

- 0 - server sql error

### 新增角色

route: /actors

method: POST

Header

- Authorization : token

---

request

```json
  {
    actor: ""
      - requried
      - string
    depiction: ""
      - required
      - string
    permissions: [] //看 Jerry DB設計再處理
  }
```

規則

---

response

#### Success

```json
{
  success: true,
    - required
    - boolean
    - true: 新增通過, false: 新增失敗
}
```

#### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### Error Status

- 0 - server sql error

### 編輯角色

route: /actors/:actor_id

method: PUT

Header

- Authorization : token

---

request

```json
  {
    actor: ""
      - requried
      - string
      - 角色名稱
    depiction: ""
      - required
      - string
      - 角色描述
    permissions: [] //看 Jerry DB設計再處理
  }
```

規則

---

response

#### Success

```json
{
  success: true,
    - required
    - boolean
    - true: 編輯成功, false: 編輯失敗
}
```

#### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### Error Status

- 0 - server sql error

### 角色列表

route: /actors

method: GET

Header

- Authorization : token

---

request

```json
{}
```

---

response

#### Success

```json
{
  success: true,
    - required
    - boolean
    - true: 新增通過, false: 新增失敗
  data: {
    actors: [{
      id: ""
        - required
        - string
      actor: ""
        - required
        - string
        - 角色名稱
      depiction
        - required
        - string
        - 角色描述
      permissions: [] //看 Jerry DB設計再處理
    }]
  }
}
```

#### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### Error Status

- 0 - server sql error

## 系統設定

### 支援銀行

#### 銀行列表

routes: /banks

method: GET

request:

```json
{
  "bank_name": string // 銀行名稱
}
```

response:

##### Success

```json
{
  success: true,
    - required
    - boolean
  data: {
    banks: [
      {
        id: number
        bank_code:
          - string
          - 銀行代碼
        bank_name:
          - string
          - 銀行名稱
        stat
          - boolean
          - 銀行狀態 true: 開啟 false: 關閉
      }
    ]
  }
}
```

##### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### 新增銀行

routes: /banks

method: POST

request:

```json
{
  bank_code:
    - string
    - 銀行代碼
  bank_name:
    - string
    - 銀行名稱
  stat
    - boolean
    - 銀行狀態 true: 開啟 false: 關閉
}
```

response:

##### Success

```json
{
  success: true,
    - required
    - boolean
  data: {
    id: number
    bank_code:
      - string
      - 銀行代碼
    bank_name:
      - string
      - 銀行名稱
    stat
      - boolean
      - 銀行狀態 true: 開啟 false: 關閉
  }
}
```

##### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```


#### 編輯銀行

routes: /banks

method: PUT

request:

```json
{
  bank_code:
    - string
    - 銀行代碼
  bank_name:
    - string
    - 銀行名稱
  stat:
    - boolean
    - 銀行狀態 true: 開啟 false: 關閉
}
```

response:

##### Success

```json
{
  success: true,
    - required
    - boolean
  data: {
    id: number
    bank_code:
      - string
      - 銀行代碼
    bank_name:
      - string
      - 銀行名稱
    stat
      - boolean
      - 銀行狀態 true: 開啟 false: 關閉
  }
}
```

##### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### 新增手機品牌

route: /mobile/brand

method: POST

request:

```json
{
  name: string //品牌名稱
}
```

response:

##### Success

```json
{
  success: true,
    - required
    - boolean
  data: {
    brands: [
      {
        id: number
        name: string //品牌名稱
        count: num // 品牌目前裝置數量
      }
    ]
  }
}
```

##### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### 取回同品牌的手機裝置列表

route: /mobile/brands/:id

method: GET

request:

```json
{}
```

response:

##### Success

```json
{
  success: true,
    - required
    - boolean
  data: {
    devices: [
      {
        id:
          - number
        device_name:
          - string
          - 裝置名稱
        device_id:
          - string
          - 所屬品牌手機 id
      }
    ]
  }
}
```

##### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### 編輯同品牌的手機裝置

route: /mobile/brands/:id

method: PUT

request:

```json
{
  device_name: string //品牌名稱
  device_id: string
}
```

response:

##### Success

```json
{
  success: true,
    - required
    - boolean
    - true: 移除裝置成功, false: 移除裝置失敗
}
```

##### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### 刪除同品牌的手機裝置

route: /mobile/brands/:id

method: DELETE

request:

```json
{}
```

response:

##### Success

```json
{
  success: true,
    - required
    - boolean
    - true: 移除裝置成功, false: 移除裝置失敗
}
```

##### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

### 黑名單驗證

#### 取回欄位資料

route: /block/field/:uid

method: GET

request

```json
{}
```

response:

##### Success

```json
{
  success: true,
    - required
    - boolean
  data: {
    fields: {
      account: 
        - boolean
        - 用戶驗證欄位
      name:
        - boolean
        - 姓名
      phone:
        - boolean
        - 聯絡手機
      qq:
        - boolean
        - 聯絡 QQ 號
      qq_name:
        - boolean
        - 聯絡 QQ 名稱
      wechat:
        - boolean
        - 微信
      wechat_name:
        - boolean
        - 文信 名稱
      skype:
        - boolean
        - skype 帳號
      skype_name:
        - boolean
        - skype 名稱
      imei1:
        - boolean
        - imei-1
      imei2:
        - boolean
        - imei-2
      ip:
      - boolean
      - 註冊 IP
      app_login_ip:
        - boolean
        - 軟件登錄 IP
      bank_account:
        - boolean
        - 銀行卡戶名
    }
  }
}
```

##### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### 編輯驗證欄位

route: /block/field/:uid

method: PUT

request

```json
{
  account: 
    - boolean
    - 用戶驗證欄位
  name:
    - boolean
    - 姓名
  phone:
    - boolean
    - 聯絡手機
  qq:
    - boolean
    - 聯絡 QQ 號
  qq_name:
    - boolean
    - 聯絡 QQ 名稱
  wechat:
    - boolean
    - 微信
  wechat_name:
    - boolean
    - 文信 名稱
  skype:
    - boolean
    - skype 帳號
  skype_name:
    - boolean
    - skype 名稱
  imei1:
    - boolean
    - imei-1
  imei2:
    - boolean
    - imei-2
  ip:
   - boolean
   - 註冊 IP
  app_login_ip:
    - boolean
    - 軟件登錄 IP
  bank_account:
    - boolean
    - 銀行卡戶名
}
```

response:

##### Success

```json
{
  success: true,
    - required
    - boolean
  data: {
    fields: {
      account
        - boolean
        - 用戶驗證欄位
      name
        - boolean
        - 姓名
      phone
        - boolean
        - 聯絡手機
      qq
        - boolean
        - 聯絡 QQ 號
      qq_name
        - boolean
        - 聯絡 QQ 名稱
      wechat
        - boolean
        - 微信
      wechat_name
        - boolean
        - 文信 名稱
      skype
        - boolean
        - skype 帳號
      skype_name
        - boolean
        - skype 名稱
      imei1
        - boolean
        - imei-1
      imei2
        - boolean
        - imei-2
      ip
        - boolean
        - 註冊 IP
      app_login_ip
        - boolean
        - 軟件登錄 IP
      bank_account
        - boolean
        - 銀行卡戶名
    }
  }
}
```

##### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### 取回地區

route: /areas

method: GET

request

```json
{}
```


response:

##### Success

```json
{
  success: true,
    - required
    - boolean
  data: {
    areas: {
      id
        - number
        - 地區 ID
      name
        - string
        - 地區名稱
    }
  }
}
```

##### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### 取回省份

route: /provinces/:area_id

method: GET

request

```json
{}
```


response:

##### Success

```json
{
  success: true,
    - required
    - boolean
  data: {
    provinces: {
      id
        - number
        - 省份 ID
      name
        - string
        - 省份名稱
    }
  }
}
```

##### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### 取回保證金方案列表

route: /commissions

method: GET

request

```json
{}
```


response:

##### Success

```json
{
  success: true,
    - required
    - boolean
  data: {
    commissions: [
      {
        id
          - number
          - commission ID
        group_id
          - number
          - 群組ID
        comm_type
          - number
          - 保證金類型
          - enums: [1, 2]
            - 1: 銀行卡
            - 2: 雲閃付
        comm_amount
          - number
          - 保證金金額
      }
    ]
  }
}
```

##### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```


#### 新增保證金方案

route: /commissions

method: POST

request

```json
{
  group_id
    - number
    - 群組ID
  comm_type
    - number
    - 保證金類型
    - enums: [1, 2]
      - 1: 銀行卡
      - 2: 雲閃付
  comm_amount
    - number
    - 保證金金額
}
```

response:

##### Success

```json
{
  success: true,
    - required
    - boolean
  data: {
    id
      - number
      - commission ID
    group_id
      - number
      - 群組ID
    comm_type
      - number
      - 保證金類型
      - enums: [1, 2]
        - 1: 銀行卡
        - 2: 雲閃付
    comm_amount
      - number
      - 保證金金額
  }
}
```

##### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```

#### 編輯保證金方案

route: /commissions

method: PUT

request

```json
{
  id
    - number
    - commission ID
  group_id
    - number
    - 群組ID
  comm_type
    - number
    - 保證金類型
    - enums: [1, 2]
      - 1: 銀行卡
      - 2: 雲閃付
  comm_amount
    - number
    - 保證金金額
}
```

response:

##### Success

```json
{
  success: true,
    - required
    - boolean
  data: {
    id
      - number
      - commission ID
    group_id
      - number
      - 群組ID
    comm_type
      - number
      - 保證金類型
      - enums: [1, 2]
        - 1: 銀行卡
        - 2: 雲閃付
    comm_amount
      - number
      - 保證金金額
  }
}
```

##### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```


#### 刪除保證金方案

route: /commissions

method: DELETE

request

```json
{}
```

response:

##### Success

```json
{
  success: true,
    - required
    - boolean
    - true: 刪除成功 false: 刪除失敗
}
```

##### Error:

status: 400

---

```json
{
  "data": {
    "message"
    "status": 0
  }
}
```
