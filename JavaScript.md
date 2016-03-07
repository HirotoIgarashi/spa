# JavaScript入門

## JavaScriptの文法

### 変数

変数には、関数ポインタ、オブジェクトポインタ、配列ポインタ、文字列、数値、null、undefinedを割り当てることができる。

変数(variable)を定義するときは名前をつけます。この名前は識別子(identifier)と呼ばれることもあります。また変数はスコープを持ちます。スコープとは有効範囲のことです。

識別子で使える文字は英数字、_(アンダースコア)、$です。
識別子の先頭には数字は使えません。`var 5variable;`はエラーになります。また予約語を使うこともできません。
下の例ではvariable、_variable、$variableが識別子になります。先頭に`var`をつけることで変数であることを宣言します。
> JavaScript 1.5以降では変数の識別子にUnicodeも利用できるようになりましたがUnicodeは利用しないほうが無難です。

```
var variable,
    _variable,
    $variable;
```
JavaScriptの予約語
```
break     else        let     typeof
case      finally     new     var
catch     for         return  void
continue  function    switch  while
default   if          this    with
delete    in          throw   yeild
do        instanceof  try 
```

ECMA-262仕様の予約語
```
abstract  enum        int       short
boolean   export      interface static
byte      extends     long      super
char      final       native    synchronized
class     float       package   throws
const     goto        private   transient
debugger  implements  protected volatile
double    iport       public
```

ブラウザでよく使われている予約語
```
alert     eval      location  open
array     focus     math      outerHeight
blur      function  name      parent
boolean   history   navigator parseFloat
date      image     number    regExp
document  isNaN     object    status
escape    length    onload    string
```
#### 変数の命名規則
変数として定義できるものには以下のものがあります。

```
ブール値      文字列    整数
数値          正規表現  オブジェクト
マップ        配列      関数
型がわからない
```

また変数がモジュールの中でのみ使用する場合をローカルスコープ、モジュールの外から使用する場合はモジュールスコープと呼びます。

| 変数の種類    | 説明          | ローカルスコープ  | モジュールスコープ  |
| :------------ | :------------ | :---------------- | :----------------   |
| ブール値      | 論理値とも呼ばれる。trueかfalseの値を格納します | is_opened         | isOpened            |
| 文字列        |               | email_text        | emailText           |
| 整数          |               | employee_count    | employeeCount       |
| 数値          |               | size_num          | sizeNum             |
| 正規表現      |               | regex_filter      | regexFilter         |
| オブジェクト  |               | user          | storeUser       |
| 配列          |               | user_list     | userList        |
| マップ        |               | user_map      | userMap         |
| 関数(汎用)    | 汎用的な関数  | fn_sync           | fnSync              |
| 関数(生成)    | オブジェクトを生成する  | create_user   | createUser  |
| 関数(参照)    | オブジェクトを読み込む  | read_user     | readUser    |
| 関数(変更)    | オブジェクトを変更する  | update_user   | updateUser  |
| 関数(削除)    | オブジェクトを削除する  | destroy_user  | destroyUser |
| 関数(取得)    | 外部のリソースからデータを取得する  | fetch_user  | fetchUser |
| 関数(保存)    | 外部のリソースにデータを保存する  | store_user  | storeUser |

### 演算子と文

### JavaScriptオブジェクト

#### 単純データ型
#### オブジェクト
#### Boolean
#### Number
#### String
#### Date
#### Math
#### Array

### 関数

## よく使われるデザインパターン
### シングルトン

### ファクトリ
ファクトリの目的はオブジェクトを作ることです。
