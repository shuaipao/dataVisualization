var express = require("express");
var bodyParser = require("body-parser");
var chokidar = require('chokidar');
const fs = require("fs");
const path = require('path');
const join = path.join;
var app = express();
//cors(Cross-Origin Resource Sharing);
app.all("*", function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,X-custom");
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    //接着执行下面的代码
    next();
});
app.use(bodyParser.urlencoded({extended: false}));
//监听端口
app.listen(6781);

var data = JSON.parse(fs.readFileSync('./json/table02/table02.json').toString());

// console.log(data);
// function dataDo(d) {
//     let result = {
//         keys: [],
//     };
//     for (var i = 0; i < d.length; i++) {
//         Object.keys(d[i]).indexOf(item)
//         for (var item in d[i]) {
//             (result.keys.indexOf(item) == -1) && result.keys.push(item)
//         }
//     }
//     console.log(result);
// }
//
// var start = new Date().getTime();
// dataDo(data);
// var end = new Date().getTime();
// console.log(end - start + "ms");
// var k = [1, 2, 3, 4, 5, 6, 7];
// var t = [1, 2, 3];
// var [t1, t2, t3, ...res] = k;
// console.log(res);
//
// var l = {
//     name: "xiaowu",
//     age: "24",
//     a:1,
//     b:2,
//     c:3,
//     d:4
// };
// var {a=3,c=2,age=1,t=10} = l;
// console.log(a,c,age,t);
// var y = (new Date()).getYear(2018);
// var y2 = (new Date()).getFullYear();
// console.log(y, y2);
//
// var arr = {
//     a:1,
//     b:2,
//     c:3,
//     d:4,
// };
// let map = new Map(arr);
// // 遍历key值
// for (let key of map.keys()) {
//     console.log(key);
// }
// // 遍历value值
// for (let value of map.values()) {
//     console.log(value);
// }
// // 遍历key和value值
// for (let item of map.entries()) {
//     console.log(item[0], item[1]);
// }
// isNew productName scoreName channelId score区间 date区间
function filters(condition, data) {
    var newData = [];

    var conditions = {
        isNew: req.query.isNew,
        productName: req.query.productName,
        scoreName: req.query.scoreName,
        channelId: req.query.channelId
    };
    for (let i in data) {
        if (data[i].condition) {
            newData
        }
    }
}


//isNew:
function isNew({isNew = 0}) {
    if (conditions.isNew == 0 || conditions.isNew == isNew) {
        return true;
    } else {
        return false
    }
}

//productName:
function productName({productName = '全部'}) {
    if (conditions.productName == "全部" || conditions.productName == productName) {
        return true;
    } else {
        return false
    }
}

//scoreName:
function scoreName({scoreName = "appscore"}) {
    if (conditions.scoreName == "全部" || conditions.scoreName == scoreName) {
        return true;
    } else {
        return false
    }
}

//channelId:
function channelId(channelId = "0") {
    if (conditions.channelId == "0" || conditions.channelId == channelId) {
        return true;
    } else {
        return false
    }
}

Array.prototype




