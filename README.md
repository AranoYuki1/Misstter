# Misstter

MisstterはTwitterにMisskeyへの投稿ボタンを追加するChrome拡張です。

## インストール方法
1. [リリースページ](https://github.com/AranoYuki1/Misstter/releases)から最新版をダウンロード
1. `Misstter.zip` をダウンロード
2. `Misstter.zip` を展開
3. Chromeで[chrome://extensions/](chrome://extensions/) を開く
4. 「デベロッパーモード」を有効にする。
5. 「パッケージ化されていない拡張機能を読み込む」から展開したフォルダを開く
6. MisskeyのトークンをPopupに入力
7. (必要があれば) Popup に Misskey サーバーを入力

> Misskey APIの発行は `設定 > API > アクセストークンの発行` から行ってください。 (全てを有効にしてください。)

##### 注意

この方法でのインストールは開発者モードを用います。
作者が確認していますので、マルウェアが入ることはほとんどないはずですが、リスクをご承知の上でご使用ください。

現在Chromeストアに公開のための審査中です。不安がある方はChromeストアでの公開までお待ちください。

---

# Misstter 

Misstter is Chrome addon to add misskey button on Twitter.

## How to Install

1. Go to the [release page](https://github.com/AranoYuki1/Misstter/releases) and download the latest version.
2. Download `Misstter.zip`. 
3. Unzip `Misstter.zip`
4. Open [chrome://extensions/](chrome://extensions/)
5. Activate "Developer Mode"
6. Load extension from "Load Unpacked"
7. Enter misskey token in Extension Popup


---

## 開発者へ / For Developers

## Prerequisites

* [node + npm](https://nodejs.org/) (Current Version)

## Setup

```
npm install
```

## Build

```
# chrome
npm run build_chrome

# firefox
npm run build_firefox
```

## Build in watch mode

### terminal

```
# chrome
npm run watch_chrome

# firefox
npm run watch_firefox
```

## Load extension to browser

Load `dist/[browser_name]` directory

## Test

`npx jest` or `npm run test`

