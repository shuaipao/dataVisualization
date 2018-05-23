<template>
    <div id="table02">

        <el-card class="box-card" style="text-align: left;margin-bottom: 20px;text-align: center;">

            <el-row>
                <el-col :span="24">
                    <div>

                    </div>
                    <div style="margin: 0px auto 30px">
                        <el-table :data="tableData" stripe header-align="center" border height="500"
                            style="min-width: 0px;margin-top: 50px;overflow-y: auto;overflow-x:
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
        name: "table02",

        data() {
            return {
                tableData: [],
                subTitle: [],

            }
        },
        props: ['jsonName'],
        watch: {
            jsonName(curVal, oldVal) {
                this.getData(curVal);
            },
        },
        mounted() {
            if (this.jsonName) {
                this.getData(this.jsonName);
            } else {
                this.$ajax.get('/template', {
                    url: '/template',
                    baseURL: process.env.API_BASEURL,
                }).then((res) => {
                    this.tableData = res.data.table.tableData;
                    this.subTitle = res.data.table.subtitle;
                    this.$store.state.subTitle[res.data.name] = this.subTitle;
                    this.$store.state.tableData[res.data.name] = this.tableData;
                });
            }
        },
        methods: {
            getData(jsonName) {
                if (this.$store.state.tableData[jsonName] == undefined) {
                    this.$ajax.get('/' + jsonName, {
                        url: '/' + jsonName,
                        baseURL: process.env.API_BASEURL,
                    }).then((res) => {
                        this.tableData = res.data.tableData;
                        this.subTitle = res.data.subtitle;
                        this.$store.state.subTitle[jsonName] = this.subTitle;
                        this.$store.state.tableData[jsonName] = this.tableData;
                    });
                } else {
                    this.subTitle = this.$store.state.subTitle[jsonName];
                    this.tableData = this.$store.state.tableData[jsonName];
                }
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


        }

    }
</script>

<style scoped>

</style>
