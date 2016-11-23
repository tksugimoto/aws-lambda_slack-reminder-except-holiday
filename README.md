# aws-lambda_slack-reminder-except-holiday
平日（祝日も除く）にSlackへリマインダーするAWS Lambda環境を作成（Terraform使用）

## 使い方
1. 事前準備
	* Local
		* node をインストール
		* terraform をインストール
		* npm モジュール [japanese-holidays](https://www.npmjs.com/package/japanese-holidays "https://www.npmjs.com/package/japanese-holidays") を `02_zip-index.js`ディレクトリにインストール
			1. `cd 02_zip-index.js`
			1. `npm install japanese-holidays`
1. lambda用scriptを作成
	1. `cd 01_create-script-file`
	1. `cp terraform.tfvars.sample terraform.tfvars`
	1. `terraform.tfvars` に設定を書き込む
		* [**必須**] `reminder_text`
		* [**必須**] `slack_webhook_url`
		* [任意] `channel` (投稿先チャンネル名)
		* [任意] `username` (投稿表示名)
		* [任意] `icon_emoji` (アイコン)
	1. `terraform apply`
1. 作成されたscriptをzip
	1. `cd 02_zip-index.js`
	1. `node_modules`ディレクトリと `index.js`ファイルを一緒にzip圧縮して `index.zip` にする
1. lamnda関数を作成
	1. `cd 03_create-lambda-function`
	1. `cp terraform.tfvars.sample terraform.tfvars`
	1. `terraform.tfvars` に設定を書き込む
		* aws_access_key
		* aws_secret_key
		* region (lambda関数を置く)
	1. `terraform apply`
