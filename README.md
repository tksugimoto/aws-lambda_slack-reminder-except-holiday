# aws-lambda_slack-reminder-except-holiday
平日（祝日も除く）にSlackへリマインダーするAWS Lambda環境を作成（Terraform使用）  
独自の休日（年末年始など）も設定可能

## 仕組み
1. AWS CloudWatch Eventsのスケジューラーを使って毎日定刻にLambda起動
1. AWS LambdaからIncoming WebHooksを使ってSlackに投稿
	* Lambda関数内で土日・祝日・独自定義休日の判定を行ない平日のみ投稿
	* 祝日判定にはnpm モジュール [japanese-holidays](https://www.npmjs.com/package/japanese-holidays "https://www.npmjs.com/package/japanese-holidays") を使用

## 使い方
1. 事前準備
	* [Node.js](https://nodejs.org/ja/ "https://nodejs.org/ja/") をインストール
	* [terraform](https://www.terraform.io/downloads.html "https://www.terraform.io/downloads.html") をインストール
		* バージョン `0.7.12` 以降必須 （AWS Lambdaの環境変数への対応が必要）
1. 依存 ライブラリのインストール
	1. `slack_reminder/zip-index.js` ディレクトリに移動
		* `cd slack_reminder/zip-index.js`
	1. npm モジュール [japanese-holidays](https://www.npmjs.com/package/japanese-holidays "https://www.npmjs.com/package/japanese-holidays") をインストール
		* `npm install japanese-holidays`
1. 共通設定
	1. 共通設定ファイル `terraform.tfvars` を `terraform.tfvars.sample` から作る
		* `cp terraform.tfvars.sample terraform.tfvars`
		* ※ `terraform.tfvars` はgit管理外
	1. `terraform.tfvars` に設定を書き込む
		* `aws_access_key`
			* AWSへのデプロイ時に入力（ファイルに残さない）も可。その場合は設定行を削除
		* `aws_secret_key`
			* AWSへのデプロイ時に入力（ファイルに残さない）も可。その場合は設定行を削除
		* `slack_webhook_url`
		* `additional_holidays`
			* 休みの追加（年末年始やお盆など）
			* 半角スペース[ ]区切り
			* 同月内の場合のみハイフン[-]で範囲指定可能
1. リマインダーの設定（リマインダーを変更する場合はこの手順から）
	1. 設定ファイル `30_main.tf` を `30_main.tf.sample` から作る
		* `cp 30_main.tf.sample 30_main.tf`
		* ※ `30_main.tf` はgit管理外
	1. `30_main.tf` に設定を書き込む
		* `module { ～～ }` が1ブロック（リマインダー）
		* 必須設定
			* `name`
			* `reminder_text`
			* `slack_webhook_url`
			* `schedule_name`
			* `schedule_expression`
				* UTCなので日本時間から -9時間
				* 曜日指定は不要（曜日の判定はLambda関数内で実行）
				* 書式の詳細は→ [Rate または Cron を使用したスケジュール式 - AWS Lambda](http://docs.aws.amazon.com/ja_jp/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html "http://docs.aws.amazon.com/ja_jp/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html")
			* `additional_holidays`
				* 休みの追加（年末年始やお盆など）
				* `"${var.additional_holidays}"` にしておけば共通設定と同じ値
				* 個別に設定/追加する場合は半角スペースで区切って設定/追加
					* `"12/30-31 1/1-7"`
					* `"12/27-31 1/1-10 ${var.additional_holidays}"`
		* オプション設定
			* `channel` （投稿先チャンネル名）
				* `#` 始まり：チャンネル （public / private）
				* `@` 始まり：ダイレクトメッセージ
				* `#@` 無し：ID（チャンネル名が変わる可能性のある場合用）
			* `username` （投稿表示名）
				* 空白・未設定 → SlackのWebhookで設定したデフォルト値
			* `icon_emoji` （アイコン）
				* 空白・未設定 → SlackのWebhookで設定したデフォルト値
1. lamnda関数を作成
	1. `terraform get`
		* 各リマインダー（Module）の有効化
	1. `terraform apply`
		* AWSにデプロイ
