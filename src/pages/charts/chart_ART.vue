<template>
    <div id="chart_ART">
        <el-card class="box-card" id="chart" style="margin-top: 60px;margin-bottom: 30px">
            <!--type-->
            <el-button-group style="margin: 10px 0px;margin-left: 2%;">
                <el-button type="primary" :class="{active1:backgroundColor3 == 0}" @click="typeRatio">
                    批复比例
                </el-button>
                <el-button type="primary" :class="{active1:backgroundColor3 == 1}" @click="typeReply">
                    批复分布
                </el-button>
                <el-button type="primary" :class="{active1:backgroundColor3 == 2}" @click="typeApply">
                    申请分布
                </el-button>
            </el-button-group>
            <!--chart-->
            <div id="myChart" :style="{width:'100%',height:'600px'}"></div>
        </el-card>
    </div>
</template>

<script>
    export default {

        name: "chart_ART",

        data() {
            return {
                xaxis: ["2018/3/17-2018/3/23",
                    "2018/3/24-2018/3/30", "2018/3/31-2018/4/6", "2018/4/7-2018/4/13", "2018/4/14-2018/4/20",
                    "2018/4/21-2018/4/27", "2018/4/28-2018/5/4"],
                dataArr: {},
                backgroundColor3: 0,
            }
        },

        mounted() {
            this.$ajax.get('/chartART', {
                url: '/chartART',
                baseURL: process.env.API_BASEURL,
            }).then((res) => {
                var dataArr = {};
                var dateArr = [];
                for (var i in res.data) {
                    dataArr[i] = [];
                    for (var j in res.data[i]) {
                        if (j != 'all') {
                            dateArr.push(j);
                            dataArr[i].push({[j]: res.data[i][j]});
                        }
                    }
                    dataArr[i].sort(function (a, b) {
                        var c, d;
                        for (var s in a) {
                            c = s;
                        }
                        for (var t in b) {
                            d = t;
                        }
                        return c > t ? 1 : -1;
                    });

                    for (var s = 0; s < dataArr[i].length; s++) {
                        for (var u in dataArr[i][s]) {
                            dataArr[i][s] = dataArr[i][s][u];
                        }
                    }
                }
                dateArr = this.uniq(dateArr);
                for (var i = 0; i < dateArr.length; i++) {
                    dateArr[i] = dateArr[i].split('-')[0] + "/" + dateArr[i].split('-')[1] + "/" + dateArr[i].split('-')[2] + "-" + dateArr[i].split('-')[3]
                        + "/" + dateArr[i].split('-')[4] + "/" + dateArr[i].split('-')[5];
                }
                this.xaxis = dateArr;
                this.dataArr = dataArr;
                this.drawLine();
                this.ART_Ratio();
            });

        },

        methods: {

            uniq(Array) {
                Array = Array.sort();
                var Ary = JSON.parse(JSON.stringify(Array));
                var newArr = [];
                for (var i = 0; i < Ary.length; i++) {
                    if (newArr.indexOf(Ary[i]) == -1) {
                        newArr.push(Ary[i]);
                    }
                }
                return newArr;
            },

            drawLine() {
                let myChart = this.$echarts.init(document.getElementById('myChart'), 'shine');
                window.onresize = function () {
                    myChart.resize();
                }
                myChart.setOption({

                    title: {
                        text: 'dec比例',
                        x: '0px',
                        y: '25px',
                        textStyle: {
                            fontSize: 14,
                            color: "#40cc90"
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        position: function (p) {   //其中p为当前鼠标的位置
                            return [p[0] - 65, p[1] - 10];
                        }
                    },

                    grid: {
                        left: "40px",
                        top: '15%',
                        containLabel: true
                    },

                    legend: {
                        data: this.legend()
                    },

                    toolbox: {
                        show: true,
                        feature: {
                            mark: {
                                show: true
                            },
                            dataView: {
                                show: false,
                                readOnly: false
                            },
                            magicType: {
                                show: true,
                                type: ['line', 'bar', 'stack', 'tiled']
                            },
                            restore: {
                                show: true
                            },
                            saveAsImage: {
                                show: true
                            }
                        },
                        x: 100,
                        y: 20
                    },

                    calculable: true,

                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        data: this.xAxis(),
                        axisLabel: {
                            interval: 'auto',
                            rotate: 55
                        },
                    }],

                    yAxis: {
                        type: 'value',
                        axisLine: {
                            onZero: false
                        },
                        axisLabel:{
                            interval:0,
                            padding:[0, 20, 0, 0],
                            textStyle: {
                                align:'right',
                                baseline:'middle'
                            }
                        },
                        x: 250,
                        y: 220
                    },

                    series: []
                });
            },

            xAxis() {
                var arr = this.xaxis;
                return arr;
            },

            legend() {
                var arr = [];
                for (var i in this.dataArr) {
                    arr.push(i)
                }
                return arr;
            },

            seriesNb(c) {
                var arr = [];
                var dataArr = [];
                for (var i in this.dataArr) {
                    dataArr[i] = [];
                    for (var j = 0; j < this.dataArr[i].length; j++) {
                        dataArr[i].push(this.dataArr[i][j][c]);
                    }
                    arr.push({
                        name: i,
                        type: 'bar',
                        stack: '小嘻嘻嘻嘻嘻嘻嘻嘻寻',
                        smooth: false,
                        data: dataArr[i]
                    })
                }
                return arr;
            },

            seriesRt() {
                var sarr = [];
                var all = 0;

                function rt(data, t) {
                    var newArr = [];

                    for (var j = 0; j < data[t].length; j++) {
                        var all = 0;
                        for (var k in data) {
                            all += data[k][j][0]
                        }
                        if (all != 0) {
                            newArr[j] = (data[t][j][0] / all * 100).toFixed(2);
                        } else {
                            newArr[j] = 0
                        }
                    }
                    return newArr;
                }

                for (var i in this.dataArr) {
                    sarr.push({
                        name: i,
                        type: 'line',
                        smooth: false,
                        data: rt(this.dataArr, i)
                    })
                }
                return sarr;
            },

            ART_Number(series) {
                let myChart = this.$echarts.init(document.getElementById('myChart'), 'shine');
                myChart.setOption({

                    tooltip: {
                        align: 'left',
                        formatter: function (params) {
                            var relVal = params[0].name;
                            for (var i = 0, l = params.length; i < l; i++) {
                                relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + "人";
                            }
                            return relVal;
                        }
                    },

                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        data: this.xAxis(),
                        axisLabel: {
                            interval: 'auto',
                            rotate: 55
                        },
                    }],

                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            formatter: '{value}'
                        },
                    },

                    series: series
                });
            },

            ART_Ratio() {
                let myChart = this.$echarts.init(document.getElementById('myChart'), 'shine');
                myChart.setOption({

                    tooltip: {
                        align: 'left',
                        formatter: function (params) {
                            var relVal = params[0].name;
                            for (var i = 0, l = params.length; i < l; i++) {
                                if (params[i].value != "NaN") {
                                    relVal +=
                                        '<br/>' + params[i].seriesName + ' : ' + params[i].value + "%";
                                } else {
                                    relVal +=
                                        '<br/>' + params[i].seriesName + ' : ' + '0' + "%";
                                }
                            }
                            return relVal;
                        }
                    },

                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        data: this.xAxis(),
                        axisLabel: {
                            interval: 'auto',
                            rotate: 55
                        },
                    }],

                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            formatter: '{value}%'
                        },
                    },

                    series: this.seriesRt()
                });
            },

            typeRatio() {
                this.backgroundColor3 = 0;
                this.ART_Ratio()
            },

            typeReply() {
                this.backgroundColor3 = 1;
                this.ART_Number(this.seriesNb(0))
            },

            typeApply() {
                this.backgroundColor3 = 2;
                this.ART_Number(this.seriesNb(1))
            },
        }
    }
</script>

<style scoped>
    #chart_ART {
        margin: 10px;
        padding: 10px;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
    }

    .active1 {
        background: #0078f5 !important;
        border: #3a8ee6 1px solid !important;
    }

    .active2 {
        background: #328609 !important;
        border: #328609 1px solid !important;
    }
</style>
