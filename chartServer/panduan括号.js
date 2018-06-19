let str = "asdasd(sja{{}''}\"\"J(()hfkjasf))";

function checkBracket(str) {
    let left = ["(", "[", "{", "'", '"', "<"];
    let right = [")", "]", "}", "'", '"', ">"];
    let strArr = [...str];
    let tarr = [strArr[0]];
    for (let i = 0; i < strArr.length; i++) {
        if ([...left, ...right].indexOf(tarr[0]) == -1) {
            tarr[0] = strArr[i];
            continue;
        }
        if ([...left, ...right].indexOf(strArr[i]) == -1) {
            continue;
        }
        if (left.indexOf(tarr[tarr.length - 1]) != right.indexOf(strArr[i])) {
            tarr.push(strArr[i])
        } else {
            tarr.pop();
        }
    }
    console.log(tarr);
    if (tarr.length == 0) {
        return true
    }
    return false
}

console.log(checkBracket(str));