
resource "aws_lambda_function" "notification" {
	function_name = "${var.prefix}"
	role = "${aws_iam_role.iam_for_lambda.arn}"
	runtime = "nodejs4.3"
	handler = "index.handler"
	timeout = 10
	filename = "../01_zip-index.js/index.zip"
	source_code_hash = "${base64sha256(file("../01_zip-index.js/index.zip"))}"

	environment {
		variables = {
			reminder_text = "${var.reminder_text}"
			slack_webhook_url = "${var.slack_webhook_url}"
			channel = "${var.channel}"
			username = "${var.username}"
			icon_emoji = "${var.icon_emoji}"
		}
	}
}
