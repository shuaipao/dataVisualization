function filters(data, names, req) {
    this.scoreName = function ({scoreName = "appscore"}, conditions) {
        return typeof conditions.scoreName != "undefined" && conditions.scoreName == scoreName
    };
    this.isNew = function ({isNew = 'All'}, conditions) {
        return typeof conditions.isNew != "undefined" && conditions.isNew == 'All' || conditions.isNew == isNew
    };
    this.productName = function ({productName = '全部'}, conditions) {
        return (typeof conditions.productName) != "undefined" && (conditions.productName.indexOf('全部') + 1 || conditions.productName.indexOf(productName.toString()) + 1)
    };
    this.channelId = function ({channelId = "0"}, conditions) {
        return typeof conditions.channelId != "undefined" && (conditions.channelId.indexOf('0') + 1 || conditions.channelId.indexOf(channelId.toString()) + 1)
    };

    return data.filter(val => {
        var isChecked = true;
        for (let i = 0, l = names.length; i < l; i++) {
            isChecked = isChecked && this[names[i]](val, req);
        }
        return isChecked;
    });
}

module.exports.filters = filters;