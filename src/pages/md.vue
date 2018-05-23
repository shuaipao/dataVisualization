<template>
    <div>
        <!--newORold-->
        <el-button-group style="white-space: nowrap;">
            <el-button v-for="(item,index) in btnArr" :type="btnType"
                :key="item"
                
                @click="checkOn(item,index)"
                :class="changeCss(btnType,index)"
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
        props: ['btnArr', 'btnType'],
        methods: {
            setColor: function (item, index) {
                this.backgroundColor = index;
                this.$emit("getColor", item)
            },
            checkOn(item, index) {
                this.backgroundColor = index;
                this.$emit('getColor', item);
            },
            changeCss(btnType, index) {
                return index == this.backgroundColor ? btnType : null;
            }
        }
    }
</script>

<style scoped>
    .primary {
        background: #0078f5 !important;
        border: #3a8ee6 1px solid !important;
    }

    .success {
        background: #328609 !important;
        border: #328609 1px solid !important;
    }
</style>
