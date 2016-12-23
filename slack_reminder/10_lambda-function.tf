
resource "aws_lambda_function" "reminder" {
	function_name = "${var.prefix}-${var.name}"
	role = "${var.iam_for_lambda_arn}"
	runtime = "nodejs4.3"
	handler = "index.handler"
	timeout = 10
	filename = "${path.module}/zip-index.js/index.zip"
	source_code_hash = "${base64sha256(file("${path.module}/zip-index.js/index.zip"))}"

	environment {
		variables = {
			reminder_text = "${var.reminder_text}"
			slack_webhook_url = "${var.slack_webhook_url}"
			additional_holidays = "${var.additional_holidays}"
			channel = "${var.channel}"
			username = "${var.username}"
			icon_emoji = "${var.icon_emoji}"
		}
	}
}
