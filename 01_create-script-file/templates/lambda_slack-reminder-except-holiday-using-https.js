const https = require("https");
const JapaneseHolidays = require("japanese-holidays");

/**** 設定ここから ****/
const reminder_text = "%reminder_text%";
const slack_webhook_url = "%slack_webhook_url%";
const channel = "%channel%";
const username = "%username%";
const icon_emoji = "%icon_emoji%";
/**** 設定ここまで ****/

exports.handler = () => {

	const japaneseToday = (() => {
		const today = new Date();
		const hour = +9;
		const min = today.getTimezoneOffset();
		return JapaneseHolidays.shiftDate(today, /* year = */ 0, /* mon = */ 0, /* day = */ 0, hour, min);
	})();

	if (isWeekend(japaneseToday)) return;
	if (isHoliday(japaneseToday)) return;

	postToSlack(reminder_text);
};

function isWeekend(japaneseDate) {
	const day = japaneseDate.getDay();
	const sunday = 0;
	const saturday = 6;
	return day === sunday || day === saturday;
}

function isHoliday(japaneseDate) {
	return !!JapaneseHolidays.isHoliday(japaneseDate);
}

function postToSlack(text) {
	if (slack_webhook_url.match(/^https:[/][/]([^/]+)(.*)$/)) {
		const host = RegExp.$1;
		const path = RegExp.$2;
		const options = {
			host: host,
			path: path,
			method: "POST"
		};
		const req = https.request(options, res => {
			res.on("data", chunk => {
				console.log("[OK] " + chunk.toString());
			}).on('error', e => {
				console.log("ERROR:" + e.stack);
			});
		});

		const body = JSON.stringify({
			channel: channel,
			username: username,
			icon_emoji: icon_emoji,
			text: text
		});

		req.write(body);

		req.end();
	}
}
