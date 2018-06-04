<template>
    <div>
        <!--btn_group-->
        <el-button-group style="white-space: nowrap;">
            <el-button v-for="(item,index) in btnSet.btnNames"
                :loading="btnSet.loading[index]"
                :plain="btnSet.plain"
                :round="btnSet.round"
                :type="btnSet.type"
                :icon="btnSet.icon[index]"
                :disable="btnSet.disa"
                :key="item"
                @click="checkOn(item,index)"
                :class="changeCss(btnSet.type,index,btnSet.defaultName)"
                style="padding: 12px 10px">
                {{item}}
            </el-button>
        </el-button-group>
    </div>
</template>

<script>
    export default {
        name: "Btns",
        data() {
            return {
                backgroundColor: 0,

            }
        },
        props: ['btnSet'],
        methods: {
            // setColor: function (item, index) {
            //     this.backgroundColor = index;
            //     this.$emit("getColor", item)
            // },
            checkOn(item, index) {
                this.backgroundColor = index;
                this.$emit('getColor', item);
            },
            changeCss(btnType, index, thisBGC) {
                return index == this.backgroundColor ? btnType : null;
            }
        }
    }
</script>

<style scoped>
    .primary {
        background: #0078f5 !important;
        border: #0078f5 1px solid !important;
        color: #ffffff;
    }

    .success {
        background: #328609 !important;
        border: #328609 1px solid !important;
        color: #ffffff;
    }

    .info {
        background: #636467 !important;
        border: #636467 1px solid !important;
        color: #ffffff;
    }

    .warning {
        background: #ff9a00 !important;
        border: #ff9a00 1px solid !important;
        color: #ffffff;
    }

    .default {
        background: #c3c3c3 !important;
        border: #c3c3c3 1px solid !important;
        color: #ffffff;
    }

    .danger {
        background: #ea0101 !important;
        border: #ea0101 1px solid !important;
        color: #ffffff;
    }
</style>
