resource "aws_cloudwatch_event_rule" "schedule" {
  name                = "${var.prefix}-${var.name}"
  description         = "${var.schedule_description}"
  schedule_expression = "${var.schedule_expression}"
}

resource "aws_cloudwatch_event_target" "reminder_schedule_target" {
  rule = "${aws_cloudwatch_event_rule.schedule.name}"
  arn  = "${aws_lambda_function.reminder.arn}"
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_reminder" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.reminder.function_name}"
  principal     = "events.amazonaws.com"
  source_arn    = "${aws_cloudwatch_event_rule.schedule.arn}"
}
