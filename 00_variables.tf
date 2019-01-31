variable "aws_access_key" {
  description = "AWSアクセスキーID"
}

variable "aws_secret_key" {
  description = "AWSシークレットアクセスキー"
}

variable "prefix" {
  description = "名前のPrefix"
}

variable "region" {
  description = "リージョン"
}

variable "slack_webhook_url" {
  description = "Slack WebhookのURL（一括設定したい場合用）"
  default     = ""
}

variable "additional_holidays" {
  description = "休みの追加（半角スペース[ ]区切り）"
  default     = ""
}
