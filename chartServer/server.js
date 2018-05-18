var express = require("express");
var bodyParser = require("body-parser");
var chokidar = require('chokidar');
const fs = require("fs");
const path = require('path');
const join = path.join;
var app = express();
app.all("*", function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,X-custom");
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    //接着执行下面的代码
    next();
});
app.use(bodyParser.urlencoded({extended: false}));
//分数段区间;
var jscoreImmediate = [0, 50, 50, 86, 86, 129, 129, 150, 150, 200, 200, 241, 241, 300, 300, 1000];

//获取日期d的前daysNumber天
function getBeforeDay(d, daysNumber) {
    d = new Date(d);
    d = +d - 1000 * 60 * 60 * 24 * daysNumber;
    d = new Date(d);
    var year = d.getFullYear();
    var mon = d.getMonth() + 1;
    var day = d.getDate();
    var s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
    return s;
}

//数据处理函数
function dataBack(score, req, data) {
    var arrlength = 0;
    if (req.query.sectionIpt == "true") {
        arrlength = Math.ceil(req.query.maxScore / req.query.subSection);
    } else {
        arrlength = jscoreImmediate.length / 2;
    }
    var chartArr = Array.apply(null, Array(arrlength)).map(() => 0);

    var backData = {
        today: {
            tableArr: [],
            chartData: JSON.parse(JSON.stringify(chartArr)),
            ratioData: []
        },
        lastWeek: {
            tableArr: [],
            chartData: JSON.parse(JSON.stringify(chartArr)),
            ratioData: []
        },
        last30Days: {
            tableArr: [],
            chartData: JSON.parse(JSON.stringify(chartArr)),
            ratioData: []
        }
    };


    var lastWeekDays = getBeforeDay(req.query.applyDate, 6);
    var last30Days = getBeforeDay(req.query.applyDate, 29);

    for (var i = 0; i < data.length; i++) {
        if (((req.query.productName == "全部") || (req.query.productName == data[i].productName)) && ((req.query.channelId == "0") || (req.query.channelId == data[i].channelId)) && ((req.query.isNew == "All") || ((req.query.isNew == 'isNew') && data[i].isNew)) && req.query.scoreName == data[i].scoreName) {
            if (new Date(data[i].applyDate) <= new Date(req.query.applyDate) && new Date(data[i].applyDate) >= new Date(last30Days)) {
                backData.last30Days.tableArr.push(data[i]);
                if (new Date(data[i].applyDate) <= new Date(req.query.applyDate) && new Date(data[i].applyDate) >= new Date(lastWeekDays)) {
                    if (data[i].applyDate == req.query.applyDate) {
                        backData.today.tableArr.push(data[i]);
                        for (var l = 0; l < backData.today.chartData.length; l++) {
                            if (data[i][data[i].scoreName] >= l * req.query.subSection && data[i][data[i].scoreName] < ((l + 1) * req.query.subSection)) {
                                backData.today.chartData[l]++;
                            }
                        }
                    }
                    backData.lastWeek.tableArr.push(data[i]);

                    if (req.query.sectionIpt == "true") {
                        for (var l = 0; l < arrlength; l++) {
                            if (data[i][data[i].scoreName] >= l * req.query.subSection && data[i][data[i].scoreName] < (l + 1) * req.query.subSection) {
                                backData.lastWeek.chartData[l]++;
                            }
                        }
                    } else {
                        for (var l = 0; l < (jscoreImmediate.length / 2); l++) {
                            if (data[i][data[i].scoreName] >= jscoreImmediate[l * 2] && data[i][data[i].scoreName] < jscoreImmediate[l * 2 + 1]) {
                                backData.lastWeek.chartData[l]++;
                            }
                        }
                    }
                }
                if (req.query.sectionIpt == "true") {
                    for (var l = 0; l < arrlength; l++) {
                        if (data[i][data[i].scoreName] >= l * req.query.subSection && data[i][data[i].scoreName] < ((l + 1) * req.query.subSection)) {
                            backData.last30Days.chartData[l]++;
                        }
                    }
                } else {
                    for (var l = 0; l < (jscoreImmediate.length / 2); l++) {
                        if (data[i][data[i].scoreName] >= jscoreImmediate[l * 2] && data[i][data[i].scoreName] < jscoreImmediate[l * 2 + 1]) {
                            backData.last30Days.chartData[l]++;
                        }
                    }
                }

            }
        }

    }

    function ratio(dataObj) {
        var allNum = 0;
        for (var k = 0; k < dataObj.chartData.length; k++) {
            allNum += dataObj.chartData[k];
        }
        for (var j = 0; j < dataObj.chartData.length; j++) {
            dataObj.ratioData[j] = (dataObj.chartData[j] / allNum * 100).toFixed(2);
        }
    }

    ratio(backData.today);
    ratio(backData.lastWeek);
    ratio(backData.last30Days);
    return backData;
}

//数组去重函数
function getCount(arr) {
    return arr.filter((val, index, self) => self.indexOf(val) == index)
}

//home接口(获取开关列表)
app.get("/home", function (req, res) {
    var data = fs.readFileSync('./json/filterData.json').toString();
    data = JSON.parse(data);
    res.send(data);
});

//appscore接口(获取appscore数据)
app.get("/appscore", function (req, res) {
    var data = fs.readFileSync('./json/applications.json').toString();
    data = JSON.parse(data);
    res.send(dataBack("appscore", req, data));

});

//jscore接口(获取jscore数据)
app.get("/jscore", function (req, res) {
    var data = fs.readFileSync('./json/applications.json').toString();
    data = JSON.parse(data);
    res.send(dataBack("jscore", req, data));

});

//unionpayscore接口(获取unionpayscore数据)
app.get("/upscore", function (req, res) {
    var data = fs.readFileSync('./json/applications.json').toString();
    data = JSON.parse(data);
    res.send(dataBack("upscore", req, data));

});

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//table02


//获取相对路径下的文件名
//table02文件数组
let fileNames = findSync('./json/table02');

//文件夹监控
var watcher = null;
var ready = false;
var watchPath = './json/table02';

// 文件新增时
function addFileListener() {
    if (ready) {
        fileNames = findSync('./json/table02');
        table02Api(fileNames);
    }
}

function addDirecotryListener() {
    if (ready) {
        fileNames = findSync('./json/table02');
        table02Api(fileNames);
    }
}

// 文件内容改变时
function fileChangeListener() {
    fileNames = findSync('./json/table02');
    table02Api(fileNames);
}

// 删除文件时，需要把文件里所有的用例删掉
function fileRemovedListener() {
    fileNames = findSync('./json/table02');
    table02Api(fileNames);
}

// 删除目录时
function directoryRemovedListener() {
    fileNames = findSync('./json/table02');
    table02Api(fileNames);
}

if (!watcher) {
    watcher = chokidar.watch(watchPath);
}
watcher.on('add', addFileListener)
    .on('addDir', addDirecotryListener)
    .on('change', fileChangeListener)
    .on('unlink', fileRemovedListener)
    .on('unlinkDir', directoryRemovedListener)
    .on('error', function (error) {
        log.info('Error happened', error);
    })
    .on('ready', function () {
        console.info('Initial scan complete. Ready for changes.');
        ready = true
    });

//生成table02 json文件名数组 返回值result(array[string]);
function findSync(startPath) {
    let result = [];

    function finder(path) {
        let files = fs.readdirSync(path);
        files.forEach((val, index) => {

            let fPath = join(path, val);
            let stats = fs.statSync(fPath);
            if (stats.isDirectory()) finder(fPath);
            if (stats.isFile() && fPath != "json\\table02\\template.json") result.push(val.split(".json")[0]);
        });
    }

    finder(startPath);
    return result;
}

//tableName02接口返回table02表名列表
app.get("/tableName02", function (req, res) {
    res.send(fileNames);
});

//获取table02文件夹内json文件内数据并处理
function table02Date(jsonFileName) {
    var data = fs.readFileSync('./json/table02/' + jsonFileName + '.json').toString();
    var template = fs.readFileSync('./json/table02/template.json').toString();

    if (data) {
        data = JSON.parse(data);
        template = JSON.parse(template);
        var subtitle = [];
        for (var i = 0; i < template.length; i++) {
            subtitle.push(template[i].name);
        }

        return {tableData: data, subtitle: subtitle};
    } else {
        return {tableData: [], subtitle: []};
    }

}

//获取table02文件夹内首个json表的信息
app.get("/template", function (req, res) {
    res.send({table: table02Date(fileNames[0]), name: fileNames[0]});
});

//循环生成table02文件夹内json文件名的接口
function table02Api(Names) {
    for (let i = 0; i < Names.length; i++) {
        app.get("/" + Names[i], function (req, res) {
            res.send(table02Date(Names[i]));
        });
    }
}

table02Api(fileNames);

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//dec.json

//从前面n周周五到周五的日期数组函数
function getFriday(date, n) {
    var d;
    if (date) {
        d = new Date(date);
    } else {
        d = new Date();
    }
    var dd = d.getDay();
    // var ddd = dd > 5 ? dd - 12 : dd - 5;
    var ddd = (dd >= 5 ? dd - 5 : 2 + dd);

    var dateArrs = [];
    var lastFriday = getBeforeDay(d, ddd);
    for (var j = 0; j < n; j++) {
        var dateArr = [];
        for (var i = 0; i < 7; i++) {
            dateArr.push(getBeforeDay(lastFriday, i))
        }
        lastFriday = getBeforeDay(dateArr[6], 1);
        dateArrs[j] = dateArr;
    }
    return dateArrs
}

function dec(data) {
    var backData = {};
    var productNames = JSON.parse(fs.readFileSync('./json/filterData.json').toString())[0].productName;
    for (var i = 0; i < data.length; i++) {

        for (var l = 0; l < productNames.length; l++) {
            if (data[i].productName == productNames[l]) {
                if (backData[data[i].productName]) {
                    backData[data[i].productName].push(data[i]);
                } else {
                    backData[data[i].productName] = [];
                    backData[data[i].productName].push(data[i]);
                }
            }
        }
    }

    return backData;
}



app.get("/chartART", function (req, res) {
    var data = fs.readFileSync('./json/dec.json').toString();
    var classfiyName = dec(JSON.parse(data));
    var weeks = getFriday("2018-04-13", 17);
    var backData = {};
    var ratio = {};
    for (var i in classfiyName) {
        backData[i] = {all: 0};
        ratio[i] = {};
        for (var k = 0; k < classfiyName[i].length; k++) {
            for (var j = 0; j < weeks.length; j++) {

                if (new Date(classfiyName[i][k].applyDate) >= new Date(weeks[j][6]) && new Date(classfiyName[i][k].applyDate) <= new Date(weeks[j][0])) {
                    backData[i][weeks[j][6] + "-" + weeks[j][0]] = backData[i][weeks[j][6] + "-" + weeks[j][0]] ? backData[i][weeks[j][6] + "-" + weeks[j][0]] : 0;
                    backData[i].all ++;
                    if (classfiyName[i][k].decCode == "SUCCESS") {
                        backData[i][weeks[j][6] + "-" + weeks[j][0]]++;
                    }
                } else {
                    backData[i][weeks[j][6] + "-" + weeks[j][0]] = backData[i][weeks[j][6] + "-" + weeks[j][0]] ? backData[i][weeks[j][6] + "-" + weeks[j][0]] : 0;
                }
            }
        }

    }
    res.send(backData);
});


//监听端口
app.listen(6780);