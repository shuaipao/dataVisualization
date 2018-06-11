var chokidar = require('chokidar');

//文件夹监控chokidar
function monitor() {
    var watcher = null;
    var ready = false;
    var watchPath = './json';

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
            console.info('文件监控已ready.');
            ready = true
        });
}

function filters(data, names, req) {
    return data.filter(val => {
        let obj = true;
        for (let i = 0, l = names.length; i < l; i++) {
            console.log(Array.isArray(req[names[i]]))
            if (Array.isArray(req[names[i]])) {
                obj = obj && (req[names[i]].indexOf('All') + 1 || req[names[i]].indexOf(val[names[i]]) + 1);
                continue;
            }
            obj = obj && (req[names[i]] == 'All' || req[names[i]] == val[names[i]]);
        }
        return obj;
    });
}

module.exports.filters = filters;
module.exports.monitor = monitor;