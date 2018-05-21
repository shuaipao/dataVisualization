<template>
    <div id="home">
        <el-card class="box-card" id="chart" style="margin-top: 60px;margin-bottom: 30px">

            <div class="block" style="margin-bottom: 5px">

                <!--date-->
                <div style="display: inline-block">
                    <el-date-picker v-model="thisDay" type="date" placeholder="选择日期时间" align="right"
                        format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"
                        @change="changeDate" style="margin: 10px 20px">
                    </el-date-picker>
                </div>

                <!--scoreName-->
                <div style="display: inline-block;margin-bottom: 10px;width: 260px;white-space: nowrap">
                    <el-button-group style="margin-left: 2%;white-space: nowrap;">
                        <el-button v-for="(item1,index1) in scoreNames" type="primary"
                            :key="item1"
                            @click="changeScoreName(item1,index1)"
                            :class="{active1:backgroundColor1 == index1}"
                            style="padding: 12px 10px">
                            {{item1}}
                        </el-button>
                    </el-button-group>
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

                <!--productName-->
                <el-form ref="form" label-width="60px"
                    style="display: inline-block;height: 40px;line-height:40px;margin:10px 1% 0px 2%;">
                    <el-form-item label="产品：">
                        <el-select v-model="productName" @input="productNameCheck" placeholder="proctName"
                            style="">

                            <el-option v-for="item in productNames" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>

                <!--channelId-->
                <el-form ref="form" label-width="60px"
                    style="display: inline-block;height: 40px;line-height:40px;margin:10px 1% 0px
                2%;">
                    <el-form-item label="渠道：">
                        <el-select v-model="channelId" @input="channelIdCheck" placeholder="channelId">
                            <el-option v-for="item in channelIds" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>

            <!--subSection-->
            <div class="demo-input-suffix"
                style="color: #a8a8a8;display: inline-block;width: 280px;margin: 5px 10px 5px">
                分数区间：
                <el-tooltip content="(区间前闭后开[100): 0 <= x < 100,100 <= x < 200...)" placement="bottom-end"
                    effect="light">
                    <el-input placeholder="分数区间" v-model="subSection" style="width: 100px"
                        :disabled="!sectionIpt"
                        @blur="sectionCheck()" @keyup.enter.native="thisInputBlur($event)">
                    </el-input>
                </el-tooltip>
            </div>

            <!--maxScore-->
            <div class="demo-input-suffix"
                style="color: #a8a8a8;display: inline-block;width: 280px;margin: 5px 10px 5px">
                最大分数：
                <el-input placeholder="请输入内容" v-model="maxScore" style="width: 100px"
                    :disabled="!sectionIpt"
                    @blur="maxScoreCheck"
                    @keyup.enter.native="thisInputBlur($event)">
                </el-input>
            </div>

            <!--isometric-->
            <el-button-group v-show="!isometry"
                style="color: #a8a8a8;display: inline-block;width: 280px;margin: 5px 10px 5px">
                <el-button type="success" :class="{active2:backgroundColor5 == 0}" @click="isFIS()">
                    等距
                </el-button>
                <el-button type="success" :class="{active2:backgroundColor5 == 1}" @click="isNotFIS()">
                    异距
                </el-button>
            </el-button-group>
            <hr style="margin-top: 5px"/>

            <!--type-->
            <el-button-group style="margin: 10px 0px;margin-left: 2%;">
                <el-button type="primary" :class="{active1:backgroundColor3 == 0}" @click="typeRatio();typeRatio2();">
                    比例
                </el-button>
                <el-button type="primary" :class="{active1:backgroundColor3 == 1}" @click="typeNumber();typeNumber2()">
                    数量
                </el-button>
            </el-button-group>

            <!--chart-->
            <div id="myChart" :style="{width:'100%',height:'400px'}"></div>

            <!--PSI-->
            <div>
                <el-tag style="margin-bottom: 20px">PSI(日): {{dayPSI}}</el-tag>
                <el-tag style="margin-bottom: 20px">PSI(周): {{weekPSI}}</el-tag>
            </div>
        </el-card>

        <!--时间段-->
        <el-card class="box-card" id="chartProducts" style="margin-bottom: 30px">
            <!--日期段-->
            <div class="block">
                <el-date-picker
                    v-model="timeSlot"
                    type="datetimerange"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="getProductsData"
                    align="right">
                </el-date-picker>
            </div>
            <!--chart-->
            <div id="productsChart" :style="{width:'100%',height:'400px'}"></div>
        </el-card>

        <!--scoreTable-->
        <el-card class="box-card" id="table01" style="text-align: left;margin-bottom: 20px;text-align: center;">
            <el-row>
                <el-col :span="24">
                    <el-button-group style="white-space: nowrap">
                        <el-button type="primary" style="padding: 12px 10px" :class="{active1:backgroundColor4 == 0}"
                            @click="today(0)">
                            所选日
                        </el-button>
                        <el-button type="primary" style="padding: 12px 10px" :class="{active1:backgroundColor4 == 1}"
                            @click="lastWeek(1)">
                            前一周
                        </el-button>
                        <el-button type="primary" style="padding: 12px 10px" :class="{active1:backgroundColor4 == 2}"
                            @click="last30Days(2)">
                            前30天
                        </el-button>
                    </el-button-group>

                    <div style="margin: 0px auto 30px">
                        <el-table :data="tabledataobj" stripe header-align="center" border height="500"
                            style="min-width: 0px;max-height: 500px;margin-top: 50px;overflow-y: auto;overflow-x:
                            hidden;float:
                        right;text-align:center">
                            <el-table-column v-for="item in subTitle" :key="item" :prop="item" :label="item"
                                header-align="center" sortable>
                                {{item}}
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
            </el-row>
        </el-card>

    </div>
</template>

<script>
    export default {
        name: "chart",
        data() {
            return {
                applications: [],
                pickerOptions: {},
                chartDatas: {},
                dayPSI: 0,
                weekPSI: 0,
                productNames: [],
                channelIds: [],
                ischartDatas: false,
                tableData: {},
                formInline: {
                    user: '',
                    region: ''
                },
                tabledataobj: [],
                backgroundColor1: 0,
                backgroundColor2: 0,
                backgroundColor3: 0,
                backgroundColor4: 0,
                backgroundColor5: 0,
                scoreNames: [],
                oldNew: ["All", "isNew", "isOld"],
                isometry: true,
                sectionIpt: true,
                isNew: "All",
                thisDay: '',
                scoreName: 'appscore',
                subTitle: ["applicationId",
                    "idNumber",
                    "applyDate",
                    "scoreName",
                    "productName",
                    "channelId",
                    "isNew",
                    "appscore"],

                subSection: 100,
                maxScore: 1000,
                productName: '全部',
                channelId: '0',

                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                timeSlot: [new Date("2018-03-27"), new Date()],
                chart2Names: [],
                seriesNb: [],
                seriesRt: []

            }
        }
        ,
        mounted() {
            this.$ajax.get('/home', {
                url: '/home',
                baseURL: process.env.API_BASEURL,
            }).then((res) => {
                this.productNames = res.data[0].productName;
                this.channelIds = res.data[0].channelId;
                this.scoreNames = res.data[0].scoreName;
            });
            this.drawLine();
            this.drawLine2();
            this.getProductsData()
        }
        ,
        methods: {
            //echarts初始化
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
                        left: '3%',
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

            //以数值展示图片
            typeNumber() {
                this.backgroundColor3 = 1;
                if (this.ischartDatas == true) {
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
                                // areaStyle: {
                                //     normal: {
                                //         type: 'default',
                                //     }
                                // },
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
                                // areaStyle: {
                                //     normal: {
                                //         type: 'default',
                                //     }
                                // },
                                smooth: false,
                                data: this.chartDatas.today.chartData
                            }]
                    });
                }
            },

            //以比例展示图片
            typeRatio() {
                this.backgroundColor3 = 0;
                if (this.ischartDatas == true) {
                    let myChart = this.$echarts.init(document.getElementById('myChart'), 'infographic');
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

                        series: [
                            {
                                name: '前30天用户',
                                type: 'line',
                                // areaStyle: {
                                //     normal: {
                                //         type: 'default',
                                //     }
                                // },
                                smooth: false,
                                data: this.chartDatas.last30Days.ratioData
                            }, {
                                name: '前一周用户',
                                type: 'line',
                                // areaStyle: {
                                //     normal: {
                                //         type: 'default',
                                //     }
                                // },
                                smooth: false,
                                data: this.chartDatas.lastWeek.ratioData
                            }, {
                                name: '当日用户',
                                type: 'line',
                                // areaStyle: {
                                //     normal: {
                                //         type: 'default',
                                //     }
                                // },
                                smooth: false,
                                data: this.chartDatas.today.ratioData
                            }]
                    });
                }
            },

            //修改x轴坐标区间段
            xAxis() {
                let arr = [];
                if (this.sectionIpt) {
                    var arrlength = Math.ceil(this.maxScore / this.subSection);
                    for (let i = 0; i < arrlength; i++) {
                        if ((arrlength - 1) == i) {
                            arr.push(i * this.subSection + "-" + this.maxScore + "分");
                            continue;
                        }
                        arr.push(i * this.subSection + "-" + (i + 1) * this.subSection + "分");
                    }
                    return arr
                } else {
                    arr = ["0-50分", "50-86分", "86-129分", "129-150分", "150-200分", "200-241分", "241-300分", "300-1000分",]
                    return arr
                }
            },

            //是否为新用户
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
                if (this.thisDay) {
                    this.getDatas()
                }
                this.getProductsData()
            },

            //修改查询的scoreName
            changeScoreName(name, index) {
                this.backgroundColor1 = index;
                if (index == 1) {
                    this.isometry = false;
                } else {
                    this.isometry = true;
                }
                this.scoreName = name;
                this.subTitle[7] = name;
                if (this.thisDay) {
                    this.getDatas()
                }
                this.getProductsData()
            },

            isFIS() {
                this.backgroundColor5 = 0;
                this.sectionIpt = true;
                this.getDatas();
                this.getProductsData()
            },

            isNotFIS() {
                this.backgroundColor5 = 1;
                this.sectionIpt = false;
                this.getDatas();
                this.getProductsData()
            },

            //修改日期获取数据
            changeDate() {
                if (this.thisDay) {
                    this.getDatas()
                }
            },

            //验证分数区间
            sectionCheck() {

                if (this.subSection > 0 && this.subSection <= 1000) {
                    if (this.thisDay) {
                        this.getDatas()
                    }
                    this.getProductsData()
                } else {
                    this.$alert('数值不能为负或者超过最大值', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            // this.$message({
                            //     type: 'info',
                            //     // message: `action: ${ action }`
                            // });
                        }
                    });
                    this.subSection = 100;
                }
            },

            //验证最大分数
            maxScoreCheck() {
                if ((this.maxScore - this.subSection) > 0) {
                    if (this.thisDay) {
                        this.getDatas()
                    }
                    this.getProductsData()
                } else {
                    this.$alert('数值需要大于区间段', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                        }
                    });
                    this.maxScore = 1000;
                }
            },

            //enter事件
            thisInputBlur(ev) {
                ev.target.blur();
            },

            //验证productName
            productNameCheck() {
                if (this.productName) {
                    if (this.thisDay) {
                        this.getDatas()
                    }

                }
                this.getProductsData()
            },

            //修改channelId
            channelIdCheck() {
                if (this.channelId) {
                    if (this.thisDay) {
                        this.getDatas()
                    }
                }
                this.getProductsData()
            },

            //ajax请求数据
            getDatas() {
                this.$ajax.get('/' + this.scoreName,
                    {
                        url: '/' + this.scoreName,
                        baseURL: process.env.API_BASEURL,
                        params: {
                            applyDate: this.thisDay.toString(),
                            maxScore: this.maxScore,
                            subSection: this.subSection,
                            channelId: this.channelId,
                            productName: this.productName,
                            isNew: this.isNew,
                            scoreName: this.scoreName,
                            sectionIpt: this.sectionIpt
                        }
                    }).then(res => {
                    this.chartDatas = res.data;
                    this.ischartDatas = true;
                    var tableData = {
                        day: res.data.today.tableArr,
                        week: res.data.lastWeek.tableArr,
                        month: res.data.last30Days.tableArr,
                    };
                    this.dayPSI =
                        this.assessPSI(this.chartDatas.today.ratioData, this.chartDatas.last30Days.ratioData);
                    this.weekPSI =
                        this.assessPSI(this.chartDatas.lastWeek.ratioData, this.chartDatas.last30Days.ratioData);

                    this.tableData = tableData;
                    this.tabledataobj = this.tableData.day;
                    console.log(tableData.day);
                }).then(() => {
                    this.typeRatio();
                })
            },

            //计算PSI
            assessPSI(ratio1, ratio2) {
                var PSI = 0;
                for (var i = 0; i < Math.ceil(this.maxScore / this.subSection); i++) {
                    if (parseFloat(ratio2[i]) != 0 && parseFloat(ratio1[i]) != 0) {
                        PSI += (ratio1[i] - ratio2[i]) / 100 * Math.log(parseFloat(ratio1[i]) / parseFloat(ratio2[i]));
                    }
                }
                if (PSI) {
                    return PSI
                } else {
                    return 0
                }


            },

            today(index) {
                this.backgroundColor4 = index;
                this.tabledataobj = this.tableData.day;
            },

            lastWeek(index) {
                this.backgroundColor4 = index;
                this.tabledataobj = this.tableData.week;
            },

            last30Days(index) {
                this.backgroundColor4 = index;
                this.tabledataobj = this.tableData.month;
            },

            filter_01(days) {
                var day = new Date(this.$store.state.value01);
                var dayArr = [];

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

                for (var i = 0; i < days; i++) {
                    dayArr.push({
                        text: getBeforeDay(day, 1),
                        value: getBeforeDay(day, 1)
                    })
                }
                return dayArr;
            },

            filterHandler(value, row, column) {
                const property = column['property'];
                return row[property] === value;
            },

            //productsCahrt

            datedifference(sDate1, sDate2) {
                var dateSpan,
                    tempDate,
                    iDays;
                sDate1 = Date.parse(sDate1);
                sDate2 = Date.parse(sDate2);
                dateSpan = sDate2 - sDate1;
                dateSpan = Math.abs(dateSpan);
                iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
                return iDays
            },

            getProductsData() {
                console.log(this.timeSlot);
                if (this.timeSlot == null) return;
                this.$ajax.get('/productsData',
                    {
                        url: '/productsData',
                        baseURL: process.env.API_BASEURL,
                        params: {
                            timeSlot: this.timeSlot,
                            sectionIpt: this.sectionIpt,
                            maxScore: this.maxScore,
                            subSection: this.subSection,
                            dayNb: this.timeSlot,
                            productName: this.productName,
                            channelId: this.channelId,
                            isNew: this.isNew,
                            scoreName: this.scoreName
                        }
                    }).then(res => {
                    this.chart2Names = [];
                    this.seriesNb = [];
                    this.seriesRt = [];
                    for (var i in res.data) {
                        if (i.indexOf('_') == -1) {

                            this.chart2Names.push(i);
                            this.seriesNb.push({
                                name: i,
                                type: 'line',
                                smooth: false,
                                data: res.data[i]
                            });
                            this.seriesRt.push({
                                name: i,
                                type: 'line',
                                smooth: false,
                                data: res.data["_" + i]
                            })
                        }

                    }

                    this.typeRatio2();
                });


            },

            drawLine2() {
                let myChart2 = this.$echarts.init(document.getElementById('productsChart'), 'shine');
                window.onresize = function () {
                    myChart2.resize();
                }
                myChart2.setOption({

                    title: {
                        text: '产品score分布',
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
                        left: '3%',
                        top: '15%',
                        containLabel: true
                    },

                    legend: {
                        data: this.chart2Names
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

                    series: this.seriesRt
                });
            },

            typeNumber2() {
                this.backgroundColor3 = 1;
                let myChart2 = this.$echarts.init(document.getElementById('productsChart'), 'shine');
                myChart2.setOption({

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

                    legend: {
                        data: this.chart2Names
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

                    series: this.seriesNb
                });

            },

            typeRatio2() {
                this.backgroundColor3 = 0;
                let myChart2 = this.$echarts.init(document.getElementById('productsChart'), 'shine');
                myChart2.setOption({

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
                    legend: {
                        data: this.chart2Names
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

                    series: this.seriesRt
                });
            }
        }

    }
</script>

<style scoped>
    #home {
        margin: 10px;
        padding: 10px;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
    }

    .mr {
        background: #409EFF;
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
