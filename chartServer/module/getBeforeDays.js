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
//前n周(最后一周:[第6天前(:)大大大大前天),date])
function getBeforeNWeeks(date, n) {
    let d = new Date(date);
    let dateArrs = [];
    for (let j = 0; j < n; j++) {
        let dateArr = [];
        for (let i = 0; i < 7; i++) {
            dateArr.push(getBeforeDay(d, i))
        }
        dateArr.reverse();
        d = getBeforeDay(dateArr[0], 1);
        dateArrs[j] = dateArr;
    }
    return dateArrs.reverse()
}
module.exports.getBeforeDay = getBeforeDay;
module.exports.getBeforeNWeeks = getBeforeNWeeks;