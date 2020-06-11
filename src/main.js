import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import 'vx-easyui/dist/themes/default/easyui.css';
import 'vx-easyui/dist/themes/icon.css';
import 'vx-easyui/dist/themes/vue.css';
import EasyUI from 'vx-easyui';
import tip from "./components/comment/tip"

Vue.config.productionTip = false
Vue.use(EasyUI);

Vue.use(tip)

router.beforeEach((to, from, next) => {
    document.title = to.matched[0].meta.title;
    if (to.path == '/login' || to.path == '/register') {
        next();
    } else {
        // 判断token是否存在
        if (sessionStorage.getItem('token')) {
            next();
        } else {
            Vue.prototype.$tip.show(`您还未登录，请先登录`, "info");
            next('/login');
        }
    }
})

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')