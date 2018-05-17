<template>
    <div id="app">
        <el-menu :default-active.stop="activeIndex" class="el-menu-demo" mode="horizontal"
            @select="handleSelect"
            background-color="#545c64" text-color="#fff" active-text-color="#40cc90"
            style="position: fixed;width: 100%;z-index: 100;top: 0px; white-space: nowrap">
            <el-menu-item index="1" style="max-width:40px;padding: 0px 10px;" @click="toChart"
            ><img src="../static/img/img_pic.png" alt="" width="24" @click="toChart"></el-menu-item>

            <!--score分布图-->
            <el-menu-item index="2" style="max-width:90px;padding: 0px 5px;" @click="toChart">
                <a href="#chart" style="width: 100%;height:100%;text-decoration: none;display: block;">
                    score分布图
                </a>
            </el-menu-item>

            <!--applications表-->
            <el-menu-item index="3" style="max-width:110px;padding: 0px 5px;" @click="toChart">
                <a href="#table01"
                    style="width: 100%;height:100%;text-decoration: none;display: block;">
                    applications表
                </a>
            </el-menu-item>

            <!--table02列表-->
            <el-submenu index="4" style="max-width:85px; padding: 0px;">

                <template slot="title" style="padding:0px;">data表</template>

                <el-menu-item :index="item" v-for="item in tableNames" :key="item"
                    :to.stop="{path: '/', query: {tableNames: item}}"
                    style="width: 100%;height:100%;text-decoration: none;display: block;color: #ffffff;">
                    {{item}}
                </el-menu-item>

            </el-submenu>

            <!--dec周对比图-->
            <el-menu-item index="5" style="max-width:150px;padding: 0px 10px;" @click="toChartART">
                <a href="#chart" style="width: 100%;height:100%;text-decoration: none;display: block;">
                    dec图
                </a>
            </el-menu-item>
        </el-menu>
        <keep-alive>
            <router-view :jsonName="key"/>
        </keep-alive>
    </div>
</template>

<script>
    export default {
        name: 'App',
        data() {
            return {
                activeIndex: '1',
                tableNames: [],
                tipName03: "",
                key: "",
            };
        },
        mounted() {
            if (this.tableNames) {
                this.$ajax.get('/tableName02', {
                    url: '/tableName02',
                    baseURL: process.env.API_BASEURL,
                }).then((res) => {
                    this.tableNames = res.data;
                });
            }

        },
        methods: {
            handleSelect(key, keyPath) {
                if (key == "1" || key == "2" || key == "3") {
                } else {
                    this.key = key;
                    if (this.$route.path != "/table") {
                        this.$router.push('/table');
                    }
                }
            },

            toChart() {
                this.$router.push('/chart');
            },
            toChartART() {
                this.$router.push('/chartART');
            }
        }
    }
</script>

<style>
    #app {
        text-align: center;
        color: #2c3e50;
    }
</style>
