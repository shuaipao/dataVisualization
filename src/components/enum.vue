<template>
    <div style="display: inline-block">
        <!--productName-->
        <el-form ref="form" label-width="60px"
            style="display: inline-block;height: 40px;line-height:40px;margin:10px 1% 0px 2%;">
            <el-form-item :label="enumSet.label | addStr">
                <el-select v-model="productName" @input="productNameCheck"
                    :placeholder="enumSet.label"
                    style="">
                    <el-option v-for="item in enumSet.productNames" :key="item" :label="item" :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "enum",
        data() {
            return {
                productName: "",
                enum: this.enumSet,
            }
        },
        props: ['enumSet'],
        methods: {
            productNameCheck: function (item, index) {
                this.$emit("getCpntVal", {
                    item: item,
                    name: this.enum.name,
                })
            }
        },
        filters: {
            addStr(value) {
                return value.toString() + "：";
            }
        }
    }
</script>

<style scoped>

</style>
