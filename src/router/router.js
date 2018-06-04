import Vue from 'vue'
import Router from 'vue-router'
import Chart from '@/pages/charts/chart'
import Table from '@/pages/charts/table'
import ChartART from '@/pages/charts/chart_ART'
import Test from '@/pages/charts/test'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            name: "chart",
            component: Chart,
        },
        {
            path: "/chart",
            redirect: {
                name: 'chart'
            }
        },
        {
            path: "/table01",
            name: "table",
            component: Chart,
        },
        {
            path: "/table",
            name: "tables",
            component: Table,
        },
        {
            path: "/ChartART",
            name: "chart_ART",
            component: ChartART,
        },
        {
            path: "/test",
            name: "test",
            component: Test,
        }
    ],

})
