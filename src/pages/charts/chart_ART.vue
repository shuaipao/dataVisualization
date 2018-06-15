<template>
    <div id="chart_ART">
        <el-card class="box-card" id="chart" style="margin-top: 60px;margin-bottom: 30px">
            <!--date-->
            <div style="display: inline-block">
                <el-date-picker v-model="thisDay" type="datetime" placeholder="选择日期时间" align="right"
                    format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"
                    @change="changeDate" style="margin: 10px 20px">
                </el-date-picker>
            </div>


            <!--weeksNb-->
            <div class="demo-input-suffix"
                style="color: #a8a8a8;display: inline-block;width: 280px;margin: 5px 10px 5px">
                向前周数：
                <el-input placeholder="请输入内容" v-model="weeksNb" style="width: 100px"
                    :disabled="!sectionIpt"
                    @blur="nbWeeksAgo"
                    @keyup.enter.native="thisInputBlur($event)">
                </el-input>
            </div>

            <!--newORold-->
            <el-button-group style="margin-left: 2%;white-space: nowrap;">
                <el-button v-for="(item2,index2) in oldNew" type="success"
                    :key="item2"
                    @click="newOrOld(item2,index2)"
                    :class="{active2:backgroundColor2 == index2}"
                    style="padding: 12px 10px">
                    {{item2}}
                </el-button>
            </el-button-group>

            <!--channelId-->
            <el-form ref="form" label-width="60px"
                style="display: inline-block;line-height:40px;margin:10px 1% 20px
                2%;">
                <el-form-item label="渠道：">
                    <el-select multiple v-model="channelId" @input="channelIdCheck" placeholder="channelId">
                        <el-option v-for="item in channelIds" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <hr>

            <!--type-->
            <el-button-group style="margin: 10px 0px;margin-left: 2%;width: 300px">
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
                thisDay: new Date(),
                weeksNb: 12,
                sectionIpt: true,
                oldNew: ["All", "isNew", "isOld"],
                isNew: "All",
                backgroundColor2: 0,
                xaxis: ["2018/3/17-2018/3/23",
                    "2018/3/24-2018/3/30", "2018/3/31-2018/4/6", "2018/4/7-2018/4/13", "2018/4/14-2018/4/20",
                    "2018/4/21-2018/4/27", "2018/4/28-2018/5/4"],
                dataArr: [],
                backgroundColor3: 0,
                channelId: ["0"],
                channelIds: [],
            }
        },

        mounted() {
            this.$ajax.get('/home', {
                url: '/home',
                baseURL: process.env.API_BASEURL,
            }).then((res) => {
                this.channelIds = res.data[0].channelId;
            });
            this.getData();
        },

        methods: {

            newOrOld(boolString, index) {
                this.backgroundColor2 = index;
                switch (boolString) {
                    case "isNew" :
                        this.isNew = 0;
                        break;
                    case "All" :
                        this.isNew = "All";
                        break;
                    case "isOld":
                        this.isNew = 1;
                        break;
                    default:
                        ;
                }
                this.getData()
            },

            //获取后台数据
            getData() {
                console.log(this.channelId);
                let start = new Date().getTime();
                this.$ajax.get('/chartART', {
                    url: '/chartART',
                    baseURL: process.env.API_BASEURL,
                    params: {
                        date: this.thisDay,
                        weeksNb: this.weeksNb,
                        isNew: this.isNew,
                        channelId: this.channelId
                    }

                }).then((res) => {

                    this.xaxis = res.data.dateArr;
                    this.dataArr = res.data.backData;
                    console.log(res.data);
                    switch (this.backgroundColor3) {
                        case 0:
                            this.ART_Ratio();
                            break;
                        case 1:
                            this.ART_Number(this.seriesNb("passNo"));
                            break;
                        case 2:
                            this.ART_Number(this.seriesNb("applyNo"));
                            break;
                        default:
                    }
                    ;
                });
            },

            //去重
            uniq(Array) {
                Array = Array.sort();
                let Ary = JSON.parse(JSON.stringify(Array));
                let newArr = [];
                for (let i = 0; i < Ary.length; i++) {
                    if (newArr.indexOf(Ary[i]) == -1) {
                        newArr.push(Ary[i]);
                    }
                }
                return newArr;
            },

            //x轴坐标(["2018/3/17-2018/3/23",...] 周5-周5的日期区间段)
            xAxis() {
                let arr = this.xaxis;
                return arr;
            },

            //产品名( [易借款 , 易借款_前期收费产品, ...] )
            legend() {
                let arr = [];
                for (let i in this.dataArr) {
                    arr.push(i)
                }
                return arr;
            },

            //批复分布/申请分部 chart图数据
            seriesNb(c) {
                let sarr = [];
                for (let i in this.dataArr) {
                    sarr.push({
                        name: i,
                        type: 'bar',
                        smooth: false,
                        stack: "堆叠",//折叠显示
                        data: this.dataArr[i][c]
                    })
                }
                return sarr;
            },

            //批复比率 chart图数据
            seriesRt() {
                let sarr = [];
                for (let i in this.dataArr) {
                    sarr.push({
                        name: i,
                        type: 'line',
                        smooth: false,
                        data: this.dataArr[i].applyRt
                    })
                }
                return sarr;
            },

            //批复分布数量/申请分部数量 chart
            ART_Number(series) {
                let myChart = this.$echarts.init(document.getElementById('myChart'), 'shine');
                myChart.clear();
                myChart.setOption({
                    title: {
                        text: 'dec比例',
                        x: '0px',
                        y: '65px',
                        textStyle: {
                            fontSize: 14,
                            color: "#40cc90"
                        }
                    },

                    grid: {
                        left: "50px",
                        top: '15%',
                        containLabel: true
                    },

                    tooltip: {
                        trigger: 'axis',
                        position: function (p) {   //其中p为当前鼠标的位置
                            return [p[0] - 65, p[1] - 10];
                        },
                        align: 'left',
                        formatter: function (params) {
                            let relVal = params[0].name;
                            for (let i = 0, l = params.length; i < l; i++) {
                                relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + "人";
                            }
                            return relVal;
                        }
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
                        y: 60
                    },

                    legend: {
                        data: this.legend()
                    },

                    calculable: true,

                    xAxis: [{
                        type: 'category',

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
                            formatter: '{value}',
                            textStyle: {
                                align: 'right',
                                baseline: 'middle'
                            }
                        },
                    },

                    series: series
                });
            },

            //产品当前周批复比率(本周此产品申请数 / 本周所有申请数) chart
            ART_Ratio() {
                let myChart = this.$echarts.init(document.getElementById('myChart'), 'shine');
                myChart.clear();
                window.onresize = function () {
                    myChart.resize();
                };
                myChart.setOption({
                    title: {
                        text: 'dec比例',
                        x: '0px',
                        y: '65px',
                        textStyle: {
                            fontSize: 14,
                            color: "#40cc90"
                        }
                    },

                    tooltip: {
                        trigger: 'axis',
                        position: function (p) {   //其中p为当前鼠标的位置
                            return [p[0] - 65, p[1] - 10];
                        },
                        align: 'left',
                        formatter: function (params) {
                            let relVal = params[0].name;
                            for (let i = 0, l = params.length; i < l; i++) {
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

                    grid: {
                        left: "50px",
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
                        y: 60
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
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            formatter: '{value}%',
                            textStyle: {
                                align: 'right',
                                baseline: 'middle'
                            }
                        },
                    },

                    series: this.seriesRt()
                });
            },

            //修改channelId
            channelIdCheck() {
                if (this.channelId) {
                    this.getData()
                }
            },

            //产品当前周批复比率
            typeRatio() {
                this.backgroundColor3 = 0;
                this.ART_Ratio()
            },

            //批复分布
            typeReply() {
                this.backgroundColor3 = 1;
                this.ART_Number(this.seriesNb("passNo"))
            },

            //申请分布
            typeApply() {
                this.backgroundColor3 = 2;
                this.ART_Number(this.seriesNb('applyNo'))
            },

            //修改日期
            changeDate() {
                this.getData()
            },

            //向前周数
            nbWeeksAgo() {
                this.getData()
            },

            //回车事件
            thisInputBlur(ev) {
                ev.target.blur();
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
