'use strict';

const {
    parse: parseUrl,
} = require('url');
const https = require('https');
const JapaneseHolidays = require('japanese-holidays');

/**** 設定ここから ****/
const reminderText = process.env.reminder_text;
const slackWebhookUrl = process.env.slack_webhook_url;
const additionalHolidaysStr = process.env.additional_holidays;
const channel = process.env.channel;
const username = process.env.username;
const iconEmoji = process.env.icon_emoji;
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

	postToSlack(reminderText);
};

function isWeekend(japaneseDate) {
	const day = japaneseDate.getDay();
	const sunday = 0;
	const saturday = 6;
	return day === sunday || day === saturday;
}

const additionalHolidays = additionalHolidaysStr.trim().split(/\s+/).reduce((array, dateStr) => {
	if (dateStr.match(/(\d+)[/](\d+)(?:-(\d+))?/)) {
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
	return additionalHolidays.some(date => {
		return date === targetDate;
	});
}

function isHoliday(japaneseDate) {
	return !!JapaneseHolidays.isHoliday(japaneseDate);
}

function postToSlack(text) {
	const options = parseUrl(slackWebhookUrl);
	options.method = 'POST';
	
	const body = JSON.stringify({
		channel,
		username,
		icon_emoji: iconEmoji,
		link_names: 1,
		text,
	});

	https.request(options, res => {
		res.on('data', chunk => {
			const statusCode = res.statusCode;
			const result = statusCode === 200 ? 'OK' : `NG(${statusCode})`;
			console.log(`[${result}] ${chunk.toString()}`);
		}).on('error', e => {
			console.log('ERROR:' + e.stack);
		});
	})
	.end(body);
}
