data "archive_file" "source_code" {
  type        = "zip"
  source_dir  = "${path.module}/src/"
  output_path = "${path.module}/dist/index.zip"
}

resource "aws_lambda_function" "reminder" {
  function_name    = "${var.prefix}-${var.name}"
  role             = "${var.iam_for_lambda_arn}"
  runtime          = "nodejs6.10"
  handler          = "index.handler"
  timeout          = 10
  filename         = "${data.archive_file.source_code.output_path}"
  source_code_hash = "${data.archive_file.source_code.output_base64sha256}"

  environment {
    variables = {
      reminder_text       = "${var.reminder_text}"
      slack_webhook_url   = "${var.slack_webhook_url}"
      additional_holidays = "${var.additional_holidays}"
      channel             = "${var.channel}"
      username            = "${var.username}"
      icon_emoji          = "${var.icon_emoji}"
    }
  }
}
