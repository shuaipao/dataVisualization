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
//文件夹监控chokidar
var watcher = null;
var ready = false;
var watchPath = './json/table02';

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
console.log(findSync(watchPath));
// 文件新增时
function addFileListener() {
    if (ready) {
        console.log(findSync(watchPath));
        console.log("添加了fileNames")
    }
}

function addDirecotryListener() {
    if (ready) {
        console.log(findSync(watchPath));
        console.log("添加了fileNames")
    }
}

// 文件内容改变时
function fileChangeListener() {
    console.log(findSync(watchPath));
    console.log("改变了fileNames内容")
}

// 删除文件时，需要把文件里所有的用例删掉
function fileRemovedListener() {
    console.log(findSync(watchPath));
    console.log("删除了fileNames文件")
}

// 删除目录时
function directoryRemovedListener() {
    // fileNames = findSync('./json/table02');
    // table02Api(fileNames);
    console.log(findSync(watchPath));
    console.log("删除了fileNames目录")
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