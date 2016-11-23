
resource "aws_iam_role" "iam_for_lambda" {
	name = "${var.prefix}-iam_for_lambda"
	assume_role_policy = "${file("./iam-role/assume_role_policy-trust_lambda.json")}"
}

resource "aws_iam_role_policy" "aws_lambda_basic_execution" {
	name = "aws_lambda_basic_execution"
	role = "${aws_iam_role.iam_for_lambda.id}"
	policy = "${file("./iam-role/policy-aws_lambda_basic_execution.json")}"
}
