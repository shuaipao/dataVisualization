<template>
    <div id="test" style="margin-top: 80px">
        <btns :btnSet="btnSet[0]" @getColor="getButtonValue"></btns>
        <br>
        <btns :btnSet="btnSet[1]" @getColor="getButtonValue"></btns>
        <br>
        <btns :btnSet="btnSet[2]" @getColor="getButtonValue"></btns>
        <br>
        <btns :btnSet="btnSet[3]" @getColor="getButtonValue"></btns>
        <br>
        <btns :btnSet="btnSet[4]" @getColor="getButtonValue"></btns>
        <br>
        <btns :btnSet="btnSet[5]" @getColor="getButtonValue"></btns>
        <br>
        <Enum :enumSet="enumSet[0]" @getEnumVal="getEnumVal"></Enum>
        <Enum style="display: block" :enumSet="enumSet[1]" @getEnumVal="getEnumVal"></Enum>
    </div>
</template>

<script>
    import Btns from "../md"
    import Enum from "../enum"

    export default {
        name: "test",
        components: {Btns, Enum},
        data() {
            return {
                btnSet: [
                    {
                        type: "primary",
                        btnNames: ["All", "isNew", "isOld"],
                        defaultName: 2,
                        plain: false,
                        round: false,
                        icon: false,
                        loading: [true, false, false],
                        disabled: [false, false, true]
                    },
                    {
                        type: "success",
                        btnNames: ["appscore", "jscore", "upscore"],
                        defaultName: 1,
                        plain: false,
                        round: false,
                        icon: ['el-icon-edit', '', ''],
                        loading: [true, false, false],
                        disabled: [false, false, true]
                    },
                    {
                        type: "default",
                        btnNames: ["a", "b", "c"],
                        defaultName: 0,
                        plain: false,
                        round: false,
                        icon: ['el-icon-edit', '', ''],
                        loading: [true, false, false],
                        disabled: [false, false, true]
                    },
                    {
                        type: "info",
                        btnNames: ["d", "e", "f"],
                        defaultName: 0,
                        plain: false,
                        round: false,
                        icon: ['el-icon-edit', '', ''],
                        loading: [true, false, false],
                        disabled: [false, false, true]
                    },
                    {
                        type: "warning",
                        btnNames: ["g", "h", "i"],
                        defaultName: 0,
                        plain: false,
                        round: false,
                        icon: '',
                        loading: [true, false, false],
                        disabled: [false, false, true]
                    },
                    {
                        type: "danger",
                        btnNames: ["j", "k", "l"],
                        defaultName: 0,
                        plain: false,
                        round: false,
                        icon: '',
                        loading: [true, false, false],
                        disabled: [false, false, true]
                    }
                ],
                enumSet: [
                    {
                        display: "block",
                        productNames: [0, 2, 1, 5, 4, 8],
                        label: "产品："
                    },
                    {
                        display: "block",
                        productNames: [0, 2, 1, 5, 4, 8],
                        label: "渠道："
                    }
                ],
                iptSet: [
                    {

                    }
                ],
            }
        },
        methods: {
            getButtonValue(item) {
                console.log(item);

            },
            getEnumVal(item) {
                if (1) {
                    console.log(item);
                }
            }
        }

    }
</script>

<style scoped>

</style>
