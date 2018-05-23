<template>
    <div>
        <!--newORold-->
        <el-button-group style="margin-left: 2%;white-space: nowrap;">
            <el-button v-for="(item,index) in btnArr" type="warning"
                :key="item"
                @click="checkOn(item,index)"
                :class="{active:backgroundColor == index}"
                style="padding: 12px 10px">
                {{item2}}
            </el-button>
        </el-button-group>
    </div>
</template>

<script>
    export default {
        name: "btns",
        data() {
            return {
                btnArr: ["new", "old"],

            }
        },
        method: {
            checkOn(item, idnex) {
                console.log(item, idnex);
            }
        }
    }
</script>

<style scoped>

</style>
