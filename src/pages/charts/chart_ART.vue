<template>
    <div id="chart_ART">
        <el-card class="box-card" id="chart" style="margin-top: 60px;margin-bottom: 30px">
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

            }
        },
        mounted() {
            this.$ajax.get('/chartART', {
                url: '/chartART',
                baseURL: process.env.API_BASEURL,
            }).then((res) => {
                // var data = [];
                // var dateArr = [];
                // var k = 0;
                // for (var i in res.data) {
                //     if (k > 0) {
                //         continue;
                //     }
                //     for (var j in res.data[i]) {
                //         if (j != 'all') {
                //             dateArr.push(j)
                //         }
                //     }
                //     k++
                // }
                // console.log(dateArr);
            });
            this.drawLine();
        },
        methods: {
            drawLine() {
                let myChart = this.$echarts.init(document.getElementById('myChart'), 'shine');
                window.onresize = function () {
                    myChart.resize();
                }
                myChart.setOption({

                    title: {
                        text: '用户score分布',
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
                        left: "80px",
                        top: '15%',
                        containLabel: true
                    },

                    legend: {
                        data: ['当日用户', '前一周用户', '前30天用户']
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

                    yAxis: {type: 'value'},

                    series: []
                });
            },

            xAxis() {
                // let arr = [];
                // if (this.sectionIpt) {
                //     var arrlength = Math.ceil(this.maxScore / this.subSection);
                //     for (let i = 0; i < arrlength; i++) {
                //         if ((arrlength - 1) == i) {
                //             arr.push(i * this.subSection + "-" + this.maxScore + "分");
                //             continue;
                //         }
                //         arr.push(i * this.subSection + "-" + (i + 1) * this.subSection + "分");
                //     }
                //     return arr
                // } else {
                var arr = ["2018/3/17-2018/3/23",
                    "2018/3/24-2018/3/30", "2018/3/31-2018/4/6", "2018/4/7-2018/4/13", "2018/4/14-2018/4/20",
                    "2018/4/21-2018/4/27", "2018/4/28-2018/5/4",]
                return arr
                // }
            },

            ART() {
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

                    series: [
                        {
                            name: '前30天用户',
                            type: 'line',
                            smooth: false,
                            data: this.chartDatas.last30Days.chartData
                        }, {
                            name: '前一周用户',
                            type: 'line',
                            smooth: false,
                            data: this.chartDatas.lastWeek.chartData
                        }, {
                            name: '当日用户',
                            type: 'line',
                            smooth: false,
                            data: this.chartDatas.today.chartData
                        }
                    ]
                });
            }
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
</style>
