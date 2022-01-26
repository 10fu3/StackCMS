# README

japanese

# コンテンツ管理システムの実装
## 1. はじめに
我々はヘッドレスコンテンツ管理システムの実現を目標にWebアプリケーションを作成した.

そもそもCMSとは、コンテンツ（画像や文章）を作成・更新・削除・読み取りできる機能を備えたソフトウェアである.

インターネット上に存在するWebページの半分がWordPressというコンテンツ管理システム（Content Management System：以下，CMS）によって作られていると言われている[1].
WordPressは
- すでに他の誰かが開発したプラグインを有効化するだけで基本の機能を拡張できること
- プラグインを開発する側になれば自分の理想となる機能を実装できる

という点で多くのWeb関係者に人気がある.

一方で
- フロントエンド（ブラウザで表示する画面そのものの実装）とバックエンド（コンテンツ管理機能やそれを動かすためのデータベース実装）などを分離しづらいために同時並行での開発作業がやりづらい
- 導入したプラグイン同士での機能の競合による不具合を自分で解決する必要がある
- シェア数が多く, ハッカーの標的になりやすい

などのデメリットも抱えている.

WordPressは通常, ブラウザからのリクエストごとにコンテンツ管理システム上で動いているデータベースを叩き, 用意されたマークアップにコンテンツの内容を埋め込んでブラウザに返却する. サーバー側でWebページを描画するため, これを Server Side Rendering (SSR)方式という.

一方現在のWeb開発のトレンドとして, JamStackというものがある.
これはWebサイトを構築するアーキテクチャの一種で,
- JavaScript (画面を構成するためのロジックを記述する)
- API (CMSとやり取りするための仕組み)
- Markup (テンプレート化されたマークアップ)

(それぞれの頭文字をとってJam)という技術で成り立っている.

JamStackで構成されたWebページは
- CMSの内容をCMSが用意したWEB APIを使って、HTML生成システムが事前にWebページを生成する
- 生成したWebページをContentsDeliveryNetwork(以下，CDN：素早くWebコンテンツを取得できるWebキャッシュサービス)にキャッシュする
- ブラウザからのリクエストに対応するのはCDNかつ, ブラウザに返却するコンテンツはすべて静的なので, 高速かつ安全にWebページを閲覧する仕組みを整えられる

という特徴がある.

このため, 従来のCMSの問題を解決したJamStack技術でWebページを作成するにはコンテンツ管理機能とフロントエンドの機能が分離しているCMSを用意する必要があり, この分離したCMSをヘッドレスCMSという.

そして今回はこのヘッドレスCMSを実装/用意した.

## 2. 目標
ヘッドレスCMSに要求される機能として,
- コンテンツそのものの定義(ブログに求められる項目とコメントに求められる項目, 著者情報に求められる項目はそれぞれバラバラかつ, Webサイトによって変わってくるために, あとから自分で定義できることが必要)
- 標準的なコンテンツの追加削除 (これはコンテンツ管理システムとして必須機能)
- コンテンツの作成更新等を行うアカウントの管理と認証
- ロールベースの権限認可機能
- 上記システムをWebページ上で管理するためのRESTful WebAPI
  をそれぞれ実装する必要がある．

## 3. 考えたシステム

このシステムには次の用語が登場する.
- コンテンツ
  これはこのシステムで管理される情報の集合を指す. 例えば,
  - ブログ記事
  - ブログのタグ
  - 著者情報

などを指す.

- API
  Application Programming Interfaceの略. このシステムでは, 管理しているコンテンツをRESTfulなWEB APIを通じて操作, 取得するために, エンドポイントを定義する必要がある.

- アカウント(ユーザー)
  このシステムでの管理者/利用者を抽象的に表現したものである.

- 権限
  このシステムで機能を利用するための権利を権限とし, 各機能に割り当てられている.

- ロール
  アカウントの集合であると同時に権限の集合.
  ロールに紐付いているアカウントは同じロールに紐付いている権限を保有しているものとしてサービスで扱われる.  (RBAC, ロールベースアクセス制御)

このシステムではコンテンツのCRUDを提供する.
またコンテンツの項目を定義することが可能で, あとからコンテンツの定義を更新することができる.
このコンテンツ情報そのものの保管はNoSQLであるMongoDBで実装した.
これらのコンテンツはRESTfulなWEB APIを通してCRUDをするためにエンドポイント（名）を自分で設定する必要がある.

またシステムの利用者を識別するためにユーザーを事前に管理者アカウントを使って定義し, ユーザーアカウントを作成しておく. そのアカウントを使ってコンテンツのCRUDを行う.
ユーザーアカウントにはログイン・ログアウトの機能があり, ログイン中はCURDのHTTPリクエストにAuthorizationヘッダをもたせて, セッションキーを各リクエスト時に同時に送信する.

次の表1に示すエンドポイントをフロントエンドアプリケーション(Javascript製)からリクエストを送信することで各操作を実現する.

CRUDをするためのRESTful WEB API エンドポイント一覧
| RESTの種類 | エンドポイント名 | パスパラメーター | 役割 |
|-|-|-| - |
| GET (取得) | /api/v1/auth/me                         | なし | ログイン状態を返す, ログインしていればプロフィール情報がJSONで返却される |
| POST (作成)  | /api/v1/auth/login                      | なし | メールアドレスとパスワードを受け付ける, ログインできればセッションキーとプロフィール情報がJSONで返却される |
| POST (作成) | /api/v1/auth/logout                     | なし | セッションキーを受け付ける. システム上からセッションキーが破棄される |
| POST (作成) | /api/v1/contents/:api_id                | api_id: API固有のID | 定義されたAPIにコンテンツを投稿する |
| PATCH (更新) | /api/v1/contents/:api_id/:content_id    | api_id: API固有のID | 定義されたAPIに投稿されたコンテンツのうち, コンテンツ固有のIDをもつコンテンツを更新する |
| GET (取得) | /api/v1/contents/:api_id                | api_id: API固有のID | 定義されたAPIに投稿されたコンテンツを取得する. クエリパラメータで条件を設定し, 取得項目にフィルターできる. |
| DELETE (削除) | /api/v1/contents/:api_id/all            | api_id: API固有のID | API固有のIDをもつAPIに所属するコンテンツをすべて削除する |
| DELETE　(削除) | /api/v1/contents/:api_id/:content_id    | api_id: API固有のID,content_id: コンテンツ固有のID | 指定したAPIに所属する指定したコンテンツIDをもつコンテンツを削除する |
| GET (取得) | /api/v1/meta/:api_id                    | api_id: API固有のID | 定義されたAPIに投稿されたコンテンツのメタ情報(投稿日時などのコンテンツ情報を含まない情報)を取得する. クエリパラメータで条件を設定し, 取得項目にフィルターできる. |
| PATCH (更新) | /api/v1/meta/:api_id/:content_id/status | api_id: API固有のID, content_id: コンテンツ固有のID | コンテンツ固有のIDの公開状態を更新する(公開 or 非公開) |
| POST (作成) | /api/v1/define                          |  | API定義のリクエストを受け付ける |
| PATCH (更新) | /api/v1/define/:api_id                  | api_id: API固有のID | 指定したAPI固有のIDを持つAPIの情報(エンドポイント名, コンテンツ定義)を更新する |
| GET (取得) | /api/v1/define/:api_id                  | api_id: API固有のID | 指定したAPI固有のIDを持つAPIの情報(エンドポイント名, コンテンツ定義)を取得する |
| GET (取得) | /api/v1/define/all                      |  | 定義されたAPIの情報(エンドポイント名, コンテンツ定義)をすべて取得する |
| DELETE (削除) | /api/v1/define/:api_id                  | api_id: API固有のID | 指定したAPI固有のIDを持つAPIを削除する |
| POST (作成) | /api/v1/user                            |  | ユーザー登録のリクエストを受け付ける |
| PATCH (更新) | /api/v1/user/:user_id                   | user_id: ユーザー固有のID | 指定されたユーザーIDに該当するユーザー情報(プロフィール, パスワード)を更新する |
| GET (取得) | /api/v1/user                            |  | 登録されたすべてのユーザー情報を送信する |
| GET (取得) | /api/v1/user/:user_id                   | user_id: ユーザー固有のID | 指定されたユーザーIDに該当するユーザー情報(ハッシュ化されたパスワード以外)を取得する |
| DELETE (削除) | /api/v1/user/:user_id                   | user_id: ユーザー固有のID | 指定されたユーザーIDに該当するユーザーを削除する |
| POST (作成) | /api/v1/role                            |  | ロール登録のリクエストを受け付ける |
| PATCH (更新) | /api/v1/role/:role_id                   | role_id: ロール固有のID | 指定されたロールIDに該当するロールを更新する |
| DELETE (削除) | /api/v1/role/:role_id                   | role_id: ロール固有のID | パラメーターで指定されたロール固有のID |
| GET (取得) | /api/v1/role/all                        |  | 登録されたロールをすべて取得する |


## 4. 作成したテーブル

- ユーザーテーブル, ユーザー情報(メールアドレス,パスワード, プロフィール)を管理する

| usersテーブル | 型 | 役割 |
| - | - | - |
| (PK) user_id     | VARCHAR(40) | ユーザー固有のID |
| nick_name | VARCHAR(128) | ニックネーム |
| (PK) mail | VARCHAR(256) | メールアドレス |
| password_hash |VARCHAR(512)| ハッシュ化したパスワード |
|is_lock |BOOLEAN| 更新不可能フラグ, 管理者アカウントのみ有効 |

- ログインセッションテーブル, ログインしているユーザーを識別するセッションキー

| login_sessionテーブル | 型 | 役割 |
| - | - | - |
| (PK) session_id |VARCHAR(40)| セッションキー |
| user_id |VARCHAR(40)| ログインしているユーザーの固有ID |
| expired_at |DATETIME| 有効期限, ログイン時にセッションキーの有効期限が現在時刻を超えている場合, 破棄される |

- ロールテーブル, ロールそのものを定義するテーブル

| rolesテーブル | 型 | 役割 |
| - | - | - |
| (PK) role_id | VARCHAR(40)| ロール固有のID |
| role_name | VARCHAR(512) | ロール名 |
| is_lock | BOOLEAN| 更新不可能フラグ, 管理者ロールのみ有効 |

- ユーザーロールテーブル, ユーザーとロールを関連付ける中間テーブル

| user_roleテーブル | 型 | 役割 |
| - | - | - |
|(PK) user_role_id|VARCHAR(80)| ユーザーロール識別用カラム, user_idとrole_idを結合したものを格納することで, 重複した関係レコードを登録しないようにしている |
|user_id|VARCHAR(40)| ユーザー固有のID |
|role_id |VARCHAR(40)| ロール固有のID |

- ロールアビリティーテーブル, ロールと権限を関連付けるテーブル

| role_abilityテーブル| 型 | 役割 |
| - | - | - |
|(PK) role_ability_id|VARCHAR(80)| 固有のID |
|role_id |VARCHAR(40)| 固有のID |
|ability_id|VARCHAR(512)| 固有のID |

- APIテーブル, コンテンツの集合でもあり, コンテンツ管理用APIのエンドポイントとして機能するための情報を管理する

| apisテーブル | 型 | 役割 |
| - | - | - |
|(PK) id |VARCHAR(40)| API固有のID |
|api_id |VARCHAR(40)| RESTful WEB APIのエンドポイント名 |
|is_single|BOOLEAN| 扱うコンテンツが単数か複数かを表す |

- フィールドテーブル, コンテンツが持つ属性を定義する (例えばblogAPIを用意する場合, コンテンツにはtitle:文字列, body:文字列という属性が必要になるため, api_idにはblogAPIが入って, 各レコードにtitleとbodyが登録される)

| fieldsテーブル | 型 | 役割 |
| - | - | - |
|(PK) field_id  |VARCHAR(40)| フィールド固有のID |
|api_id |VARCHAR(40)| API固有のID,APIに紐付けられている |
|field_name|VARCHAR(40)| フィールド名 |
|field_type|VARCHAR(40)| フィールドのデータ型(文字列,数字,日付,参照) |
|relation_api |VARCHAR(40)| フィールドが他のAPIのコンテンツを参照する場合, そのAPIの固有IDを指定する |

- クライアントテーブル BOTやページジェネレーターがコンテンツを取得するためにクライアントとして登録する

| clientsテーブル  | 型 | 役割 |
| - | - | - |
|(PK) client_id   |VARCHAR(80)| クライント固有のID |
|api_id |VARCHAR(80)| API固有のID,APIに紐付けられている |
|client_name |VARCHAR(80)| クライアント名 |
|client_secret |VARCHAR(512)| クライアントシークレット, クライアントからリクエストを飛ばすときはクライアントシークレットをAuthorizationヘッダに持たせる |

- コンテンツテーブル コンテンツのメタ情報を登録する

| contentsテーブル  | 型 | 役割 |
| - | - | - |
|(PK) content_id|VARCHAR(40)| コンテンツ固有のID |
| api_id |VARCHAR(40)  | API固有のID, APIに紐付けられている |
| created_at  | DATETIME | コンテンツ作成時刻 |
| updated_at  |DATETIME  | コンテンツ更新時刻 |
| published_at  | DATETIME | コンテンツ公開時刻 |
| revised_at |DATETIME  | コンテンツ改定時刻 |
| publish_will  | DATETIME | コンテンツ公開予定時刻 |
| stop_will  | DATETIME | コンテンツ公開停止時刻 |

## 5. 機能を実現するSQL文と実行結果

CRUDごとにSQL文を示す.

? の部分はWebアプリケーションが変数を埋め込むためのプリペアードステートメントである.

### ユーザーセッションテーブルのCURD
- C
```sql
INSERT INTO login_session values (?,?,?)
```
- U
  実装上アップデートすることがないのでなし
- R
  セッションキー検索時
```sql
SELECT * FROM login_session WHERE session_id = ?
```
- D
  セッションキーを破棄する
```sql
DELETE FROM login_session where session_id = ?
```
ユーザー削除時
```sql
DELETE FROM login_session where user_id = ?
```

### コンテンツテーブルのCURD
- C
```sql
INSERT INTO contents(content_id,api_id,created_at,updated_at,published_at,revised_at,created_by,updated_by,publish_will,stop_will) VALUES(?,?,?,?,?,?,?,?,?,?)
```

- U
```sql
UPDATE contents SET update_by = ?, update_at = ?, published_at = ? WHERE content_id = ?
```

- R
  すべてのコンテンツ（下書きを含む）検索時
```sql
SELECT * FROM contents WHERE content_id IN (?) order by created_at
```
公開されたコンテンツのみ検索時検索時
```sql
SELECT * FROM contents WHERE content_id IN (?) and published_at is not null order by published_at desc
```
- D
  コンテンツ削除時
```sql
DELETE FROM contents WHERE content_id = ?
```
API削除時
```sql
DELETE FROM contents WHERE api_id = ?
```

### ユーザーテーブルのCURD
- C
```sql
INSERT INTO users (user_id,nick_name,mail,password_hash,is_lock) VALUES(?,?,?,?,?)
```
- U
```sql
UPDATE users SET password_hash = ?, nick_name = ?, mail = ? WHERE user_id = ? AND is_lock = false
```
- R

#### メールアドレス検索時
```sql

SELECT * FROM users WHERE mail = ?
```
#### 全件検索時
```sql
SELECT * FROM users

```
- D
```sql
DELETE FROM users WHERE user_id = ? AND is_lock = false
```

### APIテーブルのCURD
- C
```sql
INSERT INTO apis (id,api_id,is_single) VALUES(?,?,?)
```
- U
```sql
UPDATE apis SET api_id = ?, is_single = ? WHERE id = ?
```
- R
  API検索時
```sql
SELECT * FROM apis WHERE id = ?
```
全件取得時
```sql
SELECT * FROM apis
```
- D
```sql
DELETE FROM apis WHERE id = ?
```

### フィールドテーブルのCURD
- C
```sql
INSERT INTO fields (field_id,api_id,field_name,field_type,relation_api) VALUES(?,?,?,?,?)
```
- U
  なし, 更新時はすべてフィールドは削除したうえでもう一度作成されなおす
- R
```sql
SELECT * FROM fields WHERE api_id = ?
```
- D
```sql
DELETE FROM fields WHERE field_id = ? AND api_id = ?
```
APIごと削除された場合
```sql
DELETE FROM fields WHERE api_id = ?
```

参照フィールドのうち, 参照先のAPIが削除された場合
```sql
DELETE FROM fields WHERE relation_api = ?
```

### ロールテーブルのCURD
- C
```sql
INSERT INTO roles (role_id,role_name,is_lock) VALUES (?,?,?)
```
- U
```sql
UPDATE roles SET role_name = ? WHERE role_id = ? AND is_lock = false
```
- R
  ロール検索時
```sql
SELECT * FROM roles WHERE role_id = ?
```
全件取得時
```sql
SELECT * FROM roles
```
- D
```sql
DELETE FROM roles WHERE role_id = ? AND is_lock = false
```

### ユーザーロールテーブルのCURD
- C
```sql
INSERT INTO user_role (user_role_id,user_id,role_id) VALUES (?,?,?)
```
- U

実装上, CRDのみ必要なためなし

- R
```sql
SELECT * FROM roles WHERE role_id IN (SELECT role_id FROM user_role WHERE user_id = ?)
```
- D
#### ユーザーの削除時
```sql
DELETE FROM user_role WHERE user_id = ?
```

#### ロールの削除時
```sql
DELETE FROM user_role WHERE role_id = ?
```

- その他
  #### ユーザーAとユーザーBが同じロールに属しているかどうか調べる
  ```sql
  SELECT * FROM roles WHERE role_id IN (SELECT role_id FROM user_role WHERE user_id = ? AND role_id IN (SELECT role_id FROM user_role WHERE user_id = ?))
  ```

  #### 特定のユーザーが特定の権限を持っているかを調べる
  ```sql
  select * from role_ability inner join user_role on role_ability.role_id = role_ability.role_id where ser_id = ? and ability_id IN (?)
  ```
## 6. 実行画面/画面遷移

本画像では, ブログ用のCMSを構築する際に必要となる設定をスクリーンショットしたものである

ブログ用のCMSには次のAPIとフィールドを定義した

API名:API内容
author:筆者を管理する
|フィールド名|フィールドの用途|データ型|
|-|-|-|
|name|筆者の名前|文字列|
|introduction|筆者の自己紹介|文字列|
|icon|ブログに表示される|文字列|

blog:ブログに必要な情報を管理する
|フィールド名|フィールドの用途|データ型|
|-|-|-|
|title|記事のタイトル|文字列|
|body|記事本文|文字列|
|author|著者紹介|参照型(authorAPIを参照する)|
|related_blog|関連記事|参照型(blogAPIを参照する)|

1. ログイン画面
   ![](https://i.imgur.com/KlULUdh.png)
   ![](https://i.imgur.com/UpMrkLd.png)

2. ホーム画面
   ![](https://i.imgur.com/bw18G3A.png "図2 ホーム画面")

3. API作成画面
   ![](https://i.imgur.com/EVtOPwh.png)
   ![](https://i.imgur.com/JelUtIz.png)
   ![](https://i.imgur.com/mpB24Zu.png)
   ![](https://i.imgur.com/invoV35.png)
   ![](https://i.imgur.com/bBJQ5BJ.png)
   ![](https://i.imgur.com/AmZlcH2.png)

4. コンテンツ新規投稿画面
   ![](https://i.imgur.com/KCMv4sW.png)
   ![](https://i.imgur.com/5bvN6Xv.png)

5. 同様にコンテンツをもう一つ追加した場合
   ![](https://i.imgur.com/qNFSjMt.png)

6. APIを更に追加 (ブログ本文用のAPIを作成)
   ![](https://i.imgur.com/bAcVaTM.png)

7. 自分自身を参照するフィールドを追加, APIを更新する (関連記事を参照させるためのフィールドを定義する)
   ![](https://i.imgur.com/d8TufNb.png)
   ![](https://i.imgur.com/ArVmDox.png)
   (related_blogのフィールドが追加された)
   ![](https://i.imgur.com/anp0Ia8.png)

8. blogAPIに記事を投稿する
   (参照型のフィールドを持つAPIの場合, 次のように参照先のAPIの画面が表示されて, 参照先APIのコンテンツを登録できるようになる)
   ![](https://i.imgur.com/vBcjPTG.png)
   作成すると次の表示になる
   ![](https://i.imgur.com/LBV1Y5d.png)

9. コンテンツの編集
   次のようにコンテンツ編集画面が表示され, コンテンツの編集と公開状態の設定, 削除などができる
   ![](https://i.imgur.com/ylIeV8J.png)
   公開状態を変更すると次の表示になる
   ![](https://i.imgur.com/4bviqQD.png)

10. ユーザーの新規登録
    ![](https://cdn.discordapp.com/attachments/935569143493722152/935571935205671003/2022-01-26_1.28.47.png)
    ![](https://cdn.discordapp.com/attachments/935569143493722152/935572247979126875/2022-01-26_1.29.36.png)
    ![](https://media.discordapp.net/attachments/935569143493722152/935572248222367794/2022-01-26_1.29.43.png)
11. ユーザー一覧の表示
    ![](https://media.discordapp.net/attachments/935569143493722152/935572248474058842/2022-01-26_1.30.00.png)
12. ユーザーのプロフィール表示
    ![](https://media.discordapp.net/attachments/935569143493722152/935572298797309982/2022-01-26_1.30.15.png)
13. ロールの新規登録
    ![](https://media.discordapp.net/attachments/935569143493722152/935572350571786291/2022-01-26_1.30.28.png)
    ![](https://media.discordapp.net/attachments/935569143493722152/935572453835546715/2022-01-26_1.30.52.png)
    ![](https://media.discordapp.net/attachments/935569143493722152/935572511540777000/2022-01-26_1.31.00.png)
    ![](https://media.discordapp.net/attachments/935569143493722152/935572511867953162/2022-01-26_1.31.06.png)
14. ロールの権限表示
    ![](https://media.discordapp.net/attachments/935569143493722152/935572511867953162/2022-01-26_1.31.06.png)
    ![](https://media.discordapp.net/attachments/935569143493722152/935572545833431071/2022-01-26_1.31.14.png)
15. ロールの権限更新
    今回はコンテンツの投稿権限を与えるようにロールを更新する.
    ロールの権限一覧画面から
    ![](https://media.discordapp.net/attachments/935569143493722152/935572545833431071/2022-01-26_1.31.14.png)
    ロール編集画面を開き
    ![](https://media.discordapp.net/attachments/935569143493722152/935572615127511110/2022-01-26_1.31.29.png)
    ![](https://media.discordapp.net/attachments/935569143493722152/935572615127511110/2022-01-26_1.31.29.png)
    更新する権限を選択する
    ![](https://media.discordapp.net/attachments/935569143493722152/935573212299948032/2022-01-26_1.33.38.png)
    適用を押して
    ![](https://media.discordapp.net/attachments/935569143493722152/935573212538998905/2022-01-26_1.33.45.png)
    ロールの権限が更新されたことがわかる
    ![](https://media.discordapp.net/attachments/935569143493722152/935573212803252294/2022-01-26_1.33.52.png)

16. コンテンツの取得 (WEB API)
    今回はRESTfulAPI を使ってサイトジェネレーターに本CMSのAPIを利用するために, 便宜上ブラウザのRESTfulAPIを叩くためのツールを使って実行する.
    このように違うセッションキーが入るとエラーが帰ってくる
    ![](https://cdn.discordapp.com/attachments/935569143493722152/935573645080817674/2022-01-26_1.34.38.png)
    正しいセッションキーを入れて, APIを実行すると, 下の図のようにCMSに投稿したコンテンツが表示される
    ![](https://cdn.discordapp.com/attachments/935569143493722152/935573645500239902/2022-01-26_1.35.35.png)
    あとはこの構造化されたデーターをサイトジェネレーターが読み込んで, WEBページを作成する


9. 参考文献
[1] WordPress powers 25% of all websites - The market share among the 300+ content management system which we monitor is now at 58.7% より https://w3techs.com/blog/entry/wordpress-powers-25-percent-of-all-websites
[2] 業務システムにおけるロールベースアクセス制御 - RBACの基礎 https://qiita.com/kawasima/items/8dd7eda743f2fdcad78e
[3] 権限制御の仕組み[ロールベースアクセスコントロール(RBAC)] - ロールベースアクセスコントロールrbachttps://www.bnote.net/dataroom/rbac.html
[4] ロールベースアクセス制御（RBAC）とは？ メリットとABACとの比較 - ロールベースアクセス制御（RBAC）とは具体的に何か？ https://www.okta.com/jp/identity-101/what-is-role-based-access-control-rbac/


english:

Headless CMS software

This CMS can...
- define your original 'contents' field
- define relation about your 'contents' to your 'contents'
- search contents by 'filter' (that is mongo db filter)

## based on
- golang
  - gin (web framework)
- maria db (mysql)
  - contents field management
  - account management
  - permission management
  - role management
- mongo db
  - contents maneged
  
## feature

- user login

- content
  - create
  - update
  - read
  - delete
  - publish
  
- api
  - create
  - read
  - update
  - delete

- user
  - read
  - create
  - update
  - delete

- role
  - read
  - create
  - update
  - delete

## not implement

- webhook


