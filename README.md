# aws-lambda_slack-reminder-except-holiday
平日（祝日も除く）にSlackへリマインダーするAWS Lambda環境を作成（Terraform使用）

## 使い方
1. 事前準備
	* Local
		* node をインストール
		* terraform をインストール
1. scriptをzip
	1. `cd slack_reminder/zip-index.js`
	1. npm モジュール [japanese-holidays](https://www.npmjs.com/package/japanese-holidays "https://www.npmjs.com/package/japanese-holidays") をインストール
		* `npm install japanese-holidays`
	1. `node_modules`ディレクトリと `index.js`ファイルを一緒にzip圧縮して `index.zip` にする
1. リマインダーの設定
	1. `cp 30_main.tf.sample 30_main.tf`
	1. `30_main.tf` に設定を書き込む
		* `module { ～～ }` が1ブロック（リマインダー）
		* 必須設定
			* `name`
			* `reminder_text`
			* `slack_webhook_url`
			* `schedule_name`
			* `schedule_expression`
				* UTCなので日本時間から -9時間 
				* 書式の詳細は→ [Rate または Cron を使用したスケジュール式 - AWS Lambda](http://docs.aws.amazon.com/ja_jp/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html "http://docs.aws.amazon.com/ja_jp/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html")
		* オプション設定
			* `channel` (投稿先チャンネル名)
			* `username` (投稿表示名)
			* `icon_emoji` (アイコン)
1. lamnda関数を作成
	1. `cp terraform.tfvars.sample terraform.tfvars`
	1. `terraform.tfvars` に設定を書き込む
		* aws_access_key
		* aws_secret_key
		* slack_webhook_url (一括設定する場合)
		* additional_holidays
			* 休みの追加（年末年始やお盆など）
			* 半角スペース[ ]区切り
			* 同月内の場合のみハイフン[-]で範囲指定可能
	1. `terraform get`
	1. `terraform apply`
