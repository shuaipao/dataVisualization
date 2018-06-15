//  node_modules
let express = require("express");
let bodyParser = require("body-parser");
let fs = require("fs");
let path = require("path");
let join = path.join;

//  module
let chokidar = require('./module/chokidar').monitor;
let filters = require('./module/filters').filters;
let getBeforeDay = require('./module/getBeforeDays').getBeforeDay;
let getBeforeNWeeks = require('./module/getBeforeDays').getBeforeNWeeks;

let app = express();

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
app.listen(6780);

//  获取JSON数据
class PathData {
    constructor(path) {
        this.data = JSON.parse(fs.readFileSync(path).toString() ? fs.readFileSync(path).toString() : '[]');
    }
}

//  chart
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

    class BackData {
        constructor(arrTemplate) {
            this.tableArr = [];
            this.chartData = arrTemplate.concat();
            this.ratioData = []
        }
    }

    //返回数据格式
    let backData = {
        today: new BackData(chartArr),
        lastWeek: new BackData(chartArr),
        last30Days: new BackData(chartArr),
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
        return Date.parse(val.applyDate) > Date.parse(req.query.timeSlot[0]) && Date.parse(val.applyDate) <= Date.parse(req.query.timeSlot[1]);
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

//  table02
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
    let data = new PathData('./json/table02/' + jsonFileName + '.json').data;
    let template = new PathData('./json/table02/template.json').data;

    if (data) {
        let subtitle = [];
        for (let i = 0, l = template.length; i < l; i++) {
            subtitle.push(template[i].name);
        }
        return {tableData: data, subtitle: subtitle};
    } else {
        return {tableData: [], subtitle: []};
    }

}

//  tableNames接口    返回table02表名列表
app.get("/tableNames", (req, res) => {
    res.send(fileNames);
});

//  firstTable接口    返回table02/首个json文件的信息
app.get('/firstTable', (req, res) => {
    res.send({table: table02Date(fileNames[0]), name: fileNames[0]});
});

//  循环生成table02文件夹内json文件名的接口
for (let i = 0, l = fileNames.length; i < l; i++) {
    app.get(`/${fileNames[i]}`, (req, res) => {
        res.send(table02Date(fileNames[i]));
    });
}

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//dec.json

//chartART接口API
app.get("/chartART", (req, res) => {

    let data = new PathData('./json/dec.json').data;

    let filterProductName = new PathData('./json/filterData.json').data[0].productName;

    let weeks = getBeforeNWeeks(req.query.date, req.query.weeksNb);
    //返回数据
    let backData = {}, dateArr = [];

    let arrLength = req.query.weeksNb - 0;
    for (let i = 0; i < arrLength; i++) {
        dateArr[i] = `${weeks[i][0].replace('-', '/').replace('-', '/')}-${weeks[i][6].replace('-', '/').replace('-', '/')}`;
    }
    let chartArr = new Array(arrLength).fill(0, 0, arrLength);
    filters(data, ['isNew', 'channelId'], req.query).forEach(val => {
        let name = val.productName;
        if (filterProductName.indexOf(name) > -1) {
            if (!backData[name]) {
                backData[name] = {
                    applyRt: chartArr.concat(),
                    applyNo: chartArr.concat(),
                    passNo: chartArr.concat()
                };
            }
            for (let i = 0; i < req.query.weeksNb; i++) {
                if (weeks[i].indexOf(val.applyDate) > -1) {
                    if (val.decCode == "SUCCESS") {
                        backData[name].passNo[i]++
                    }
                    backData[name].applyNo[i]++
                }
                // 计算比例
                let ratio = backData[name].applyNo[i] == 0 ? 0 : (backData[name].passNo[i] / backData[name].applyNo[i] * 100).toFixed(2);
                backData[name].applyRt[i] = ratio;
            }

        }
    });
    res.send({backData, dateArr});
});


//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//embedding selector

function appData() {
    let data = new PathData('./json/embedding/similarities.json').data;
    let dataTitle = [];
    data.forEach(val => {
        dataTitle.push(val.appname);
    });
    return {data, dataTitle}
}

app.get("/embeddingTitle", (req, res) => {
    let {dataTitle} = appData();
    res.send(dataTitle);
});

app.get("/relevance", (req, res) => {
    let {dataTitle, data} = appData();
    let arrLength = data[0].mostSimApp.length;
    let backData = new Array(arrLength).fill({}, 0, arrLength);
    backData.forEach((val,index) => {
        let row = val;
        data.forEach((item) => {
            row[item.appname] = `${item.mostSimApp[index]}
${item.similarity[index]}`;
        })
    });
    console.log(backData);
    res.send(data);
});

