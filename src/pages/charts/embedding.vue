<template>
    <div id="embedding">

        <el-card class="box-card" style="text-align: left;margin-bottom: 20px;text-align: center;">
            <!--productName-->
            <el-form ref="form" label-width="60px"
                style="display: inline-block;line-height:40px;margin:10px 1% 0px 2%;">
                <el-form-item label="产品：">
                    <el-select v-model="productName" @input="productNameCheck()"
                        style="">
                        <el-option v-for="item in []" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-row>
                <el-col :span="24">
                    <div>

                    </div>
                    <div style="margin: 0px auto 30px">
                        <el-table :data="tableData" stripe header-align="center" border height="500"
                            style="min-width: 0px;margin-top: 50px;overflow-y: auto;overflow-x:
                            hidden;float:
                        right;text-align:center">
                            <el-table-column v-for="item in subTitle" :prop="item" :label="item"
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
        name: "embedding",
        data() {
            return {
                tableData: [],
                subTitle: [],
                tableName: '',
                productName:''
            }
        },
        mounted() {
            this.$ajax.get('/relevance', {
                url: '/relevance',
                baseURL: process.env.API_BASEURL,
            }).then(res => {
                console.log(res);
                this.subTitle = res.data.dataTitle;
                this.tableData = res.data.backData;
            })
        },
        methods:{

        }
    }
</script>

<style scoped>

</style>
