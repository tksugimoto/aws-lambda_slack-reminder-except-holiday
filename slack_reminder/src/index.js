"use strict";

const https = require("https");
const JapaneseHolidays = require("japanese-holidays");

/**** 設定ここから ****/
const reminder_text = process.env.reminder_text;
const slack_webhook_url = process.env.slack_webhook_url;
const additional_holidays_str = process.env.additional_holidays;
const channel = process.env.channel;
const username = process.env.username;
const icon_emoji = process.env.icon_emoji;
/**** 設定ここまで ****/

exports.handler = () => {

	const japaneseToday = (() => {
		const today = new Date();
		const hour = +9;
		const min = today.getTimezoneOffset();
		return new Date(today.getTime() + (hour * 60 + min) * 60 * 1000);
	})();

	if (isWeekend(japaneseToday)) return;
	if (isAdditionalHoliday(japaneseToday)) return;
	if (isHoliday(japaneseToday)) return;

	postToSlack(reminder_text);
};

function isWeekend(japaneseDate) {
	const day = japaneseDate.getDay();
	const sunday = 0;
	const saturday = 6;
	return day === sunday || day === saturday;
}

const additional_holidays = additional_holidays_str.trim().split(/\s+/).reduce((array, date_str) => {
	if (date_str.match(/(\d+)[/](\d+)(?:-(\d+))?/)) {
		const month = parseInt(RegExp.$1);
		const startDay = parseInt(RegExp.$2);
		const endDay = parseInt(RegExp.$3 || startDay);
		for (let day = startDay; day <= endDay; day++) {
			array.push(`${month}/${day}`);
		}
	}
	return array;
}, []);
function isAdditionalHoliday(japaneseDate) {
	const targetDate = `${japaneseDate.getMonth() + 1}/${japaneseDate.getDate()}`;
	return additional_holidays.some(date => {
		return date === targetDate;
	});
}

function isHoliday(japaneseDate) {
	return !!JapaneseHolidays.isHoliday(japaneseDate);
}

function postToSlack(text) {
	if (slack_webhook_url.match(/^https:[/][/]([^/]+)(.*)$/)) {
		const host = RegExp.$1;
		const path = RegExp.$2;
		const options = {
			host,
			path,
			method: "POST",
		};
		const req = https.request(options, res => {
			res.on("data", chunk => {
				const statusCode = res.statusCode;
				const result = statusCode === 200 ? "OK" : `NG(${statusCode})`;
				console.log(`[${result}] ${chunk.toString()}`);
			}).on('error', e => {
				console.log("ERROR:" + e.stack);
			});
		});

		const body = JSON.stringify({
			channel,
			username,
			icon_emoji,
			link_names: 1,
			text,
		});

		req.write(body);

		req.end();
	}
}
