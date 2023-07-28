# Misstter

MisstterはTwitterにMisskeyへの投稿ボタンを追加するChrome拡張です。

# インストール方法

## Chromeの場合

1. `Misstter_Chrome.zip` をこの下部からダウンロード & 展開
2. [chrome://extensions/](chrome://extensions/) を開く
3. 「デベロッパーモード」を有効にする。
4. 「パッケージ化されていない拡張機能を読み込む」から展開したフォルダを開く
5. MisskeyのトークンをPopupに入力
6. (必要があれば) Popup に Misskey サーバーを入力

## Firefoxの場合

1. `Misstter_Firefox.xpi` をこの下部からダウンロード
2.  about:addons を開く
3.  右上の歯車マークから「ファイルからアドオンをインストール」
6. MisskeyのトークンをPopupに入力
7. (必要があれば) Popup に Misskey サーバーを入力



> PopupはChrome/Firefoxの右上の拡張機能ボタンからアクセスできます。
> 
> Misskey APIの発行は `Settings > API > アクセストークンの発行` から行ってください。
>  (全てを有効にしてください。)

##### 注意

Chromeへのインストールは開発者モードを用います。
作者が確認していますので、マルウェアが入ることはほとんどないはずですが、リスクをご承知の上でご使用ください。

現在Chromeストアに公開のための審査中です。不安がある方はChromeストアでの公開までお待ちください。
Firefox版は検証が終わっているためそのまま利用可能です。

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

