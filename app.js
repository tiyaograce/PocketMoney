var express = require('express');
var moment = require('moment');
var app = express();

var workingsaturday = [
    new Date('07/11/2020').getTime(),
    new Date('07/18/2020').getTime(),
    new Date('06/20/2020').getTime(),
];

var startworkday = new Date('06/01/2020');

var cashpaiddate = new Date('07/17/2020');

var earnedsalary = 0;
var diningfee = 0;

var paidsalary = 0;
var unpaidsalary = 0;

app.get('/results', function (req, res) {
    var startdate = req.query.startdate;
    var enddate = req.query.enddate;

    var displays = getDateRangeDisplay(startdate, enddate);

    var weeks = weeksDiff(startdate, enddate);

    var parampackage = {
        displays: displays,
        earnedsalary: earnedsalary,
        paidsalary: paidsalary,
        unpaidsalary: unpaidsalary,
        weeks: weeks,
        dining: weeks * 40,
    };

    // console.log(parampackage["displays"][0]);
    res.render('result.ejs', { parampackage: parampackage });
});

app.get('/', function (req, res) {
    res.render('research.ejs');
});

app.listen(4000, function () {
    console.log('Server listening on port 4000');
});

function getDateRangeDisplay(startdate, enddate) {
    var displays = [];
    var loop = new Date(startdate);
    var end = new Date(enddate);
    earnedsalary = 0;
    paidsalary = 0;
    unpaidsalary = 0;

    var today = new Date();

    while (loop <= end) {
        if (loop >= startworkday && loop <= today) {
            if (loop.getDay() != 6 && loop.getDay() != 0 && loop <= cashpaiddate) {
                displays.push(loop.toString().slice(0, 15).replace(/-/g, '') + ' - 60' + ' - Paid');
                earnedsalary += 60;
                paidsalary += 60;
            } else if (workingsaturday.indexOf(loop.getTime()) > -1 && loop <= cashpaiddate) {
                displays.push(
                    loop.toString().slice(0, 15).replace(/-/g, '') + ' - 100' + ' - Paid'
                );
                earnedsalary += 100;
                paidsalary += 100;
            } else if (loop.getDay() != 6 && loop.getDay() != 0) {
                displays.push(loop.toString().slice(0, 15).replace(/-/g, '') + ' - 60');
                earnedsalary += 60;
                unpaidsalary += 60;
            } else if (workingsaturday.indexOf(loop.getTime()) > -1) {
                displays.push(loop.toString().slice(0, 15).replace(/-/g, '') + ' - 100');
                earnedsalary += 100;
                unpaidsalary += 100;
            } else {
                displays.push(loop.toString().slice(0, 15).replace(/-/g, '') + ' - 0');
            }
        }

        var newDate = loop.setDate(loop.getDate() + 1);
        loop = new Date(newDate);
    }

    return displays;
}

function weeksDiff(d1, d2) {
    var a = moment(new Date(d1), 'DD-MM-YYYY');
    var b = moment(new Date(d2), 'DD-MM-YYYY');
    var days = b.diff(a, 'day');
    var weeksDiff = Math.ceil(days / 7);
    return weeksDiff;
}