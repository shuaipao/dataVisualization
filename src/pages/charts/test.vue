<template>
    <div id="test" style="margin-top: 80px">
        <btns :btnSet="btnSet[0]" @getCpntVal="getCpntsValue"></btns>
        <btns :btnSet="btnSet[1]" @getCpntVal="getCpntsValue"></btns>
        <!--<btns :btnSet="btnSet[2]" @getCpntVal="getCpntsValue"></btns>-->
        <!--<br>-->
        <!--<btns :btnSet="btnSet[3]" @getCpntVal="getCpntsValue"></btns>-->
        <!--<br>-->
        <!--<btns :btnSet="btnSet[4]" @getCpntVal="getCpntsValue"></btns>-->
        <!--<br>-->
        <!--<btns :btnSet="btnSet[5]" @getCpntVal="getCpntsValue"></btns>-->
        <!--<br>-->
        <Enum :enumSet="enumSet[0]" @getCpntVal="getCpntsValue"></Enum>
        <Enum :enumSet="enumSet[1]" @getCpntVal="getCpntsValue"></Enum>

    </div>
</template>
<script>
    import Btns from "../../components/md"
    import Enum from "../../components/enum"

    export default {
        name: "test",
        components: {Btns, Enum},
        data() {
            return {
                //button设置
                btnSet: [
                    {
                        name: 'isNew',
                        type: "primary",
                        btnNames: ["All", "isNew", "isOld"],
                        defaultName: 0,
                    },
                    {
                        name: 'scoreName',
                        type: "success",
                        btnNames: ["appscore", "jscore", "upscore"],
                        defaultName: 1,
                        // plain: false,
                        // round: false,
                        // icon: ['el-icon-edit', '', ''],
                        // loading: [true, false, false],
                        // disabled: [false, false, true]
                    }
                ],
                //select设置
                enumSet: [
                    {
                        display: "block",
                        productNames: [0, 2, 1, 5, 4, 8],
                        label: "产品",
                        name: 'productName'
                    },
                    {
                        display: "block",
                        productNames: [0, 2, 1, 5, 4, 8],
                        label: "渠道",
                        name: 'channelId'
                    }
                ],
                //获取的信息
                postData: {}
            }
        },
        mounted() {
            for (var i = 0; i < this.btnSet.length; i++) {
                this.postData[this.btnSet[i].name] = this.btnSet[i].btnNames[this.btnSet[i].defaultName];
            }
        },
        methods: {
            //获取button数据
            getCpntsValue(d) {
                this.postData[d.name] = d.item;
                console.log(this.postData);
            },
        }
    }
</script>

<style scoped>

</style>
