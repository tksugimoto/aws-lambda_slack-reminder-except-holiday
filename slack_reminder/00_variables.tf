variable "prefix" {}

# 実行roleのarn
variable "iam_for_lambda_arn" {}

# 個別のreminderの名前
variable "name" {}

# スケジュール設定
variable "schedule_name" {}

variable "schedule_expression" {}

# Remindするテキスト
# 改行は "\n"
variable "reminder_text" {}

# Slack WebhookのURL
variable "slack_webhook_url" {}

# 休みの追加（半角スペース[ ]区切り）
variable "additional_holidays" {
  default = ""
}

# Slack 投稿先チャンネル
# format: "#channel-name"
# デフォルト（空文字）はWebhookのデフォルト値
variable "channel" {
  default = ""
}

# Slack 通知のユーザー表示
# デフォルト（空文字）はWebhookのデフォルト値
# 既知の問題: 半角スペース以降は無視
variable "username" {
  default = ""
}

# Slack 通知のアイコン
# format: ":icon_name:"
# デフォルト（空文字）はWebhookのデフォルト値
variable "icon_emoji" {
  default = ""
}
