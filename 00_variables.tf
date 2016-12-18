# AWS APIキー変数設定
variable "aws_access_key" {}
variable "aws_secret_key" {}

# 名前のPrefix
variable "prefix" {}

# リージョン
variable "region" {}

# Slack WebhookのURL
# 一括設定したい場合用
variable "slack_webhook_url" {
	default = ""
}

# 休みの追加（[,]区切り）
variable "additional_holidays" {
	default = ""
}
