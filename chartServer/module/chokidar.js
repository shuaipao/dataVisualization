var chokidar = require('chokidar');

//文件夹监控chokidar
function monitor(findSync,watchPath) {
    let watcher = null;
    let ready = false;
    const filePath = './json/table02';
// 文件新增时
    function addFileListener() {
        if (ready) {
            fileNames = findSync(filePath);
        }
    }

    function addDirecotryListener() {
        if (ready) {
            fileNames = findSync(filePath);
        }
    }

// 文件内容改变时
    function fileChangeListener() {
        fileNames = findSync(filePath);
    }

// 删除文件时，需要把文件里所有的用例删掉
    function fileRemovedListener() {
        fileNames = findSync(filePath);
    }

// 删除目录时
    function directoryRemovedListener() {
        fileNames = findSync(filePath);
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

module.exports.monitor = monitor;

