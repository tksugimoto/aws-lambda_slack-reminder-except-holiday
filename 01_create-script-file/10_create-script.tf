
resource "null_resource" "create_index_js" {
	triggers = {
		reminder_text = "${var.reminder_text}"
		slack_webhook_url = "${var.slack_webhook_url}"
		channel = "${var.channel}"
		username = "${var.username}"
		icon_emoji = "${var.icon_emoji}"
		templates_file = "${base64sha256(file("./templates/lambda_slack-reminder-except-holiday-using-https.js"))}"
	}
	provisioner "local-exec" {
		command = "node create_index.js.js reminder_text=${var.reminder_text} slack_webhook_url=${var.slack_webhook_url} channel=${var.channel} username=${var.username} icon_emoji=${var.icon_emoji}"
	}
}
