const startOfDay = require('date-fns/startOfDay');
const format = require('date-fns/format');
const isNull = require('lodash/isNull');
const { zonedTimeToUtc, utcToZonedTime } = require('date-fns-tz');

const DEFAULT_TIME_ZONE = 'Asia/Taipei';
const DEFAULT_FORMAT_DATE_TIME = 'yyyy-MM-dd HH:mm:ss';

module.exports.startOfDay = (date = null, timeZone = DEFAULT_TIME_ZONE) =>
  isNull(date)
    ? startOfDay(Date.now())
    : startOfDay(date);

module.exports.zonedTimeToUtc = (date, timeZone = DEFAULT_TIME_ZONE) =>
  zonedTimeToUtc(new Date(date), timeZone);

module.exports.formatDateTime = (date) =>
  format(utcToZonedTime(date, DEFAULT_TIME_ZONE), DEFAULT_FORMAT_DATE_TIME);

module.exports.now = (timeZone = DEFAULT_TIME_ZONE) => zonedTimeToUtc(Date.now(), timeZone);
