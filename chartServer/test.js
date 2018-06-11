var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");

var chokidar = require('./module/chokidar').monitor;
var filters = require('./module/filters').filters;
var getBeforeDay = require('./module/getBeforeDays').filters;


//cors(Cross-Origin Resource Sharing);
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

//文件监控
chokidar();

//监听端口
app.listen(6781);

//获取数据
function PathData(path) {
    this.data = JSON.parse(fs.readFileSync(path).toString());
}

//home接口(获取filters列表)
app.get("/home", function (req, res) {
    var homeData = fs.readFileSync('./json/filterData.json').toString();
    homeData = JSON.parse(homeData);
    console.log(homeData);
    res.send(homeData);
});


//applications接口(返回数据);
app.get("/applications", function (req, res) {

    var Date = new PathData('./json/applications.json');

    //filters规则;
    var names = ['scoreName', 'isNew', 'channelId', 'productName'];

    //分数段区间;
    var jscoreImmediate = [0, 50, 50, 86, 86, 129, 129, 150, 150, 200, 200, 241, 241, 300, 300, 1000];

    //区间数
    var arrLength = 0;

    //分区间数
    if (conditions.sectionIpt == "true") {
        arrlength = Math.ceil(req.query.maxScore / req.query.subSection);
    } else {
        arrlength = jscoreImmediate.length / 2;
    }

    //初始数组值为0
    var chartArr = [].fill(0, 0, arrLength - 1);

    //返回数据格式
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
        },
    };

    //29天前的日期,7天前的日期
    var lastWeekDays = getBeforeDay(req.query.applyDate, 6);
    var last30Days = getBeforeDay(req.query.applyDate, 29);

    //量
    function secIpt(date, val) {
        if (req.query.sectionIpt == "true") {
            for (var l = 0; l < arrlength; l++) {
                if (val[val.scoreName] >= l * req.query.subSection && val[val.scoreName] < ((l + 1) * req.query.subSection)) {
                    date.chartData[l]++;
                }
            }
        } else {
            for (var l = 0; l < (jscoreImmediate.length / 2); l++) {
                if (val[val.scoreName] >= jscoreImmediate[l * 2] && val[val.scoreName] < jscoreImmediate[l * 2 + 1]) {
                    date.chartData[l]++;
                }
            }
        }
    }

    //过滤
    filters(applications, name, req.query).filter(val => {
        return new Date(val.applyDate) <= new Date(req.query.applyDate) && new Date(val.applyDate) >= new Date(last30Days);
    }).filter(val => {
        //29月前的数据;
        backData.last30Days.tableArr.push(val);
        secIpt(backData.last30Days, val);
        return new Date(val.applyDate) <= new Date && new Date(val.applyDate) >= new Date(lastWeekDays);
    }).filter(val => {
        //6天前的数据
        backData.lastWeek.tableArr.push(val);
        secIpt(backData.lastWeek, val);
        return val.applyDate == req.query.applyDate;
    }).filter(val => {
        //今天的数据
        backData.today.tableArr.push(val);
        secIpt(backData.today, val);
    })
});