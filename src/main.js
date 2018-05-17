// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/router'
import ElementUI from 'element-ui'
import echarts from 'echarts'
import axios from 'axios'
import VueJsonp from 'vue-jsonp'
import vuex from 'vuex'

require('echarts/theme/macarons');
require('echarts/theme/infographic');
require('echarts/theme/shine');


import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);
Vue.use(VueJsonp);
Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;
Vue.prototype.$ajax = axios;
Vue.config.productionTip = false;

Vue.use(vuex);
var store = new vuex.Store({//store对象
    state: {
        subTitle: {},
        tableData: {}
    },
    getters: {
        subtitle: state => {
            return state.subTitle;
        },
        tableData: state => {
            return state.tableData;
        }
    }
});
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>'
});
