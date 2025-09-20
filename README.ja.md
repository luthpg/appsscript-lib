# appsscript-lib

npmで公開されているパッケージを、GoogleAppsScript（GAS）のライブラリとして利用できるように提供します。

## 利用者向け (For Users)

### ライブラリの利用方法

1. Google Apps Scriptのエディタを開きます。
2. 「ライブラリ」の横にある `+` アイコンをクリックします。
3. 「スクリプトID」に、利用したいライブラリのIDを貼り付け、「検索」をクリックします。
4. バージョンを選択し、「追加」をクリックします。

### 利用可能なライブラリ

| ライブラリ名 | スクリプトID | 説明 | 公式HP |
| :--- | :--- | :--- | :--- |
| `diff` | `1cGsS5kFEuRxs4q4huY9zeEJKqwGuOpy3XIm9ZByWltW8ruS7czrMz1Rx` | テキストの差分を比較するためのライブラリ | [diff](https://github.com/kpdecker/jsdiff) |
| `luxon` | `1nTyDY64s57_wk2r8zOSz6fauz_Kt4l4BY74eajkHwR3RLPQ3P2p6PtN5` | 日付や時間を操作するためのライブラリ | [luxon](https://moment.github.io/luxon) |

### 使用例 (`diff`ライブラリ)

```js
function myFunction() {
  const text1 = 'Hello\nWorld';
  const text2 = 'Hello\nJavaScript';

  // ライブラリの識別子はデフォルトでライブラリ名になります
  const changes = diff.diffLines(text1, text2);

  changes.forEach(part => {
    const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
    console.log(part.value, color);
  });
}
```

### 使用例 (`luxon`ライブラリ)

```js
function myFunction() {
  // タイムゾーンを指定して現在の日時を取得
  // ライブラリの識別子はデフォルトで 'luxon' になります
  const dt = luxon.DateTime.now().setZone('Asia/Tokyo');

  // 日時をフォーマットする
  const formatted = dt.toFormat('yyyy-MM-dd HH:mm:ss');
  console.log(`現在の日時 (東京): ${formatted}`);

  // 1週間後の日時を計算する
  const nextWeek = dt.plus({ weeks: 1 });
  console.log(`1週間後の日時: ${nextWeek.toFormat('yyyy-MM-dd')}`);
}
```

## メンテナー向け (For Maintainers)

### プロジェクト概要

このプロジェクトは、[rolldown](https://rolldown.rs/)を利用してnpmパッケージを単一のJavaScriptファイルにバンドルし、[clasp](https://github.com/google/clasp)を使ってGoogleAppsScriptライブラリとしてデプロイします。

### 環境構築

```bash
# 依存関係のインストール
pnpm install
```

### ビルド

各ライブラリをビルドし、`dist`ディレクトリに出力します。

```bash
pnpm build
```

### デプロイ

`scripts/publish.ts`を実行することで、`lib`配下の各ライブラリがGoogleAppsScriptにプッシュされ、新しいバージョンが作成されます。

```bash
pnpm publish
```

### 新しいライブラリの追加手順

1. `lib`ディレクトリに新しいライブラリ用のディレクトリを作成します。（例: `lib/new-lib`）
2. `appsscript.json`と`.clasp.json`を新しいディレクトリに作成します。
   - `.clasp.json`にはGUIや`clasp create`で取得した新しいスクリプトIDを記載します。
3. `main.ts`を作成し、ライブラリとして公開する関数やオブジェクトを定義します。

### `.clasp.json`の管理について

通常、`.clasp.json`には秘匿情報が含まれるためGit管理から除外しますが、このプロジェクトでは**公開ライブラリ**として利用されるスクリプトIDのみを記載しているため、意図的にGit管理に含めています。これにより、利用者へのスクリプトIDの共有と、メンテナーによる管理を容易にしています。

## ライセンス

このプロジェクトは[LICENSE](./LICENSE)ファイルに基づきライセンスされています。
