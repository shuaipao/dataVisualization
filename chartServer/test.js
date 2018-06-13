let express = require("express");
let bodyParser = require("body-parser");
let fs = require("fs");
let path = require("path");
let join = path.join;

//module
let chokidar = require('./module/chokidar').monitor;
let filters = require('./module/filters').filters;
let getBeforeDay = require('./module/getBeforeDays').getBeforeDay;

var app = express();

//  cors(Cross-Origin Resource Sharing);
app.all("*", function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,X-custom");
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    //接着执行下面的代码
    next();
});
app.use(bodyParser.urlencoded({extended: false}));

//  文件监控
chokidar(findSync, './json');

//  监听端口
app.listen(6781);

//  获取数据
function PathData(path) {
    this.data = JSON.parse(fs.readFileSync(path).toString());
}

//chart
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

//  home接口(获取filters数据项)
app.get("/home", (req, res) => {
    let homeData = new PathData('./json/filterData.json').data;
    res.send(homeData);
});

//  前端部分filter处理
function applicationsData(req) {
    let pathData = new PathData('./json/applications.json').data;

    //filters规则;
    let names = ['scoreName', 'isNew', 'channelId', 'productName'];

    //分数段区间;
    let jscoreImmediate = [0, 50, 50, 86, 86, 129, 129, 150, 150, 200, 200, 241, 241, 300, 300, 1000];

    //区间数
    let arrLength = 0;

    //分区间数
    if (req.query.sectionIpt == "true") {
        arrLength = Math.ceil(req.query.maxScore / req.query.subSection);
    } else {
        arrLength = jscoreImmediate.length / 2;
    }

    //初始数组值为0
    let chartArr = new Array(arrLength).fill(0, 0, arrLength);

    return {
        chartArr: chartArr, pathData: pathData, names: names,
        //分数段内数据
        secIpt(data, val) {
            if (req.query.sectionIpt == "true") {
                for (let l = 0; l < arrLength; l++) {
                    if (val[val.scoreName] >= l * req.query.subSection && val[val.scoreName] < ((l + 1) * req.query.subSection)) {
                        data.chartData[l]++;
                    }
                }
            } else {
                for (let l = 0; l < (jscoreImmediate.length / 2); l++) {
                    if (val[val.scoreName] >= jscoreImmediate[l * 2] && val[val.scoreName] < jscoreImmediate[l * 2 + 1]) {
                        data.chartData[l]++;
                    }
                }
            }
        },

        //计算比例
        ratio(dataObj) {
            let allNum = 0;
            for (let k = 0; k < dataObj.chartData.length; k++) {
                allNum += dataObj.chartData[k];
            }
            for (let j = 0; j < dataObj.chartData.length; j++) {
                dataObj.ratioData[j] = allNum == 0 ? 0 : (dataObj.chartData[j] / allNum * 100).toFixed(2);
            }
        }
    }
}

//  applications接口
app.get("/applications", (req, res) => {

    let {chartArr, pathData, names, secIpt, ratio} = applicationsData(req);

    //返回数据格式
    let backData = {
        today: {
            tableArr: [],
            chartData: chartArr.concat(),
            ratioData: []
        },
        lastWeek: {
            tableArr: [],
            chartData: [...chartArr],
            ratioData: []
        },
        last30Days: {
            tableArr: [],
            chartData: [...chartArr],
            ratioData: []
        },
    };

    //29天前的日期,7天前的日期
    let lastWeekDays = getBeforeDay(req.query.applyDate, 6);
    let last30Days = getBeforeDay(req.query.applyDate, 29);

    //过滤
    filters(pathData, names, req.query).filter(val => {
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
    });

    //计算比例tadioData
    Object.keys(backData).filter(val => ratio(backData[val]));

    res.send(backData);
});

//  productsData接口
app.get("/productsData", (req, res) => {

    let {chartArr, pathData, names, secIpt, ratio} = applicationsData(req);

    let filterProductName = new PathData('./json/filterData.json').data[0].productName;

    let backData = {};


    filters(pathData, names, req.query).filter(val => {
        return new Date(val.applyDate) > new Date(req.query.timeSlot[0]) && new Date(val.applyDate) <= new Date(req.query.timeSlot[1]);
    }).filter(val => {
        //计算chartData
        if (filterProductName.indexOf(val.productName) > -1) {
            // backData[val.productName] = backData[val.productName] || {
            //     chartData: [...chartArr],
            //     ratioData: []
            // };
            if (!backData[val.productName]) {
                backData[val.productName] = {
                    chartData: [...chartArr],
                    ratioData: []
                };
            }
            secIpt(backData[val.productName], val);
        }
        return false;
    });

    //
    Object.keys(backData).forEach(val => ratio(backData[val]));
    res.send(backData);
});

//table02
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

//  table02文件数组
let fileNames = findSync('./json/table02');

//  table02/ .json文件名数组
function findSync(startPath) {
    let result = [];

    function finder(path) {
        let files = fs.readdirSync(path);
        files.forEach((val) => {
            let fPath = join(path, val);
            let stats = fs.statSync(fPath);
            if (stats.isDirectory()) finder(fPath);
            if (stats.isFile() && fPath != "json\\table02\\template.json" && (fPath.split('.json')[1] == "")) result.push(val.split(".json")[0]);
        });
    }

    finder(startPath);
    return result;
}

//  table02/[jsonFileName].json 数据处理
function table02Date(jsonFileName) {
    var data = new PathData('./json/table02/' + jsonFileName + '.json').data;
    var template = new PathData('./json/table02/template.json').data;

    if (data) {
        var subtitle = [];
        for (var i = 0, l = template.length; i < l; i++) {
            subtitle.push(template[i].name);
        }
        return {tableData: data, subtitle: subtitle};
    } else {
        return {tableData: [], subtitle: []};
    }

}

//  tableNames接口    返回table02表名列表
app.get("/tableNames", function (req, res) {
    res.send(fileNames);
});

//  firstTable接口    返回table02/首个json文件的信息
app.get('/firstTable', (req, res) => {
    res.send({table: table02Date(fileNames[0]), name: fileNames[0]});
});

//  循环生成table02文件夹内json文件名的接口
for (let i = 0, l = fileNames.length; i < l; i++) {
    app.get(`/${fileNames[i]}`, function (req, res) {
        res.send(table02Date(fileNames[i]));
    });
}

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//dec.json

//前n周(最后一周:[第6天前(:)大大大大前天),date])
function getBeforeNWeeks(date, n) {
    let d = new Date(date);
    let dateArrs = [];
    for (let j = 0; j < n; j++) {
        let dateArr = [];
        for (let i = 0; i < 7; i++) {
            dateArr.push(getBeforeDay(d, i))
        }
        d = getBeforeDay(dateArr[6], 1);
        dateArrs[j] = dateArr;
    }
    return dateArrs
}


//改变数据结构: {产品名1:[{订单},{订单},...], 产品名2: [{...}]}
function dec(data) {
    var backData = {};
    var productNames = JSON.parse(fs.readFileSync('./json/filterData.json').toString())[0].productName;
    // console.log(productNames);
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

//chartART接口API
app.get("/chartART", function (req, res) {
    var data = new PathData('./json/dec.json').data;
    var classfiyName = dec(data);
    var weeks = getBeforeNWeeks(req.query.date, req.query.weeksNb);
    var backData = {};
    var ratio = {};

    var f = filters(data, ['isNew', 'channelId'],req.query).filter(val => {
        return new Date(val.applyDate) > new Date(req.query.timeSlot[0]) && new Date(val.applyDate) <= new Date(req.query.timeSlot[1]);
    }).filter(val => {
        //计算chartData
        if (filterProductName.indexOf(val.productName) > -1) {
            // backData[val.productName] = backData[val.productName] || {
            //     chartData: [...chartArr],
            //     ratioData: []
            // };
            if (!backData[val.productName]) {
                backData[val.productName] = {
                    chartData: [...chartArr],
                    ratioData: []
                };
            }
            secIpt(backData[val.productName], val);
        }
        return false;
    });
    for (var i in classfiyName) {
        backData[i] = {all: 0};
        ratio[i] = {};
        for (var k = 0; k < classfiyName[i].length; k++) {
            for (var j = 0; j < weeks.length; j++) {
                if ((channelId(classfiyName[i][k], req.query)) && isNew(classfiyName[i][k], req.query) && new Date(classfiyName[i][k].applyDate) >= new Date(weeks[j][6]) && new Date(classfiyName[i][k].applyDate) <= new Date(weeks[j][0])) {
                    backData[i][weeks[j][6] + "-" + weeks[j][0]] = backData[i][weeks[j][6] + "-" + weeks[j][0]] ? backData[i][weeks[j][6] + "-" + weeks[j][0]] : [0, 0];
                    backData[i].all++;
                    if (classfiyName[i][k].decCode == "SUCCESS") {
                        backData[i][weeks[j][6] + "-" + weeks[j][0]][0]++;
                    }
                    backData[i][weeks[j][6] + "-" + weeks[j][0]][1]++;
                } else {
                    backData[i][weeks[j][6] + "-" + weeks[j][0]] = backData[i][weeks[j][6] + "-" + weeks[j][0]] ? backData[i][weeks[j][6] + "-" + weeks[j][0]] : [0, 0];
                }
            }
        }
    }
    // console.log(backData);
    res.send(backData);
});
