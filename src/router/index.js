import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const manage = () =>
    import ('../view/Manage');
const login = () =>
    import ('../view/Login');
const user = () =>
    import ('../view/User');

const routes = [{
    path: '/',
    redirect: '/manage'
}, {
    path: '/manage',
    name: '管理界面',
    component: manage,
    meta: {
        title: '管理界面'
    }
}, {
    path: '/login',
    name: '登录',
    component: login,
    meta: {
        title: '登录'
    }
}, {
    path: '/user',
    name: '我的信息',
    component: user,
    meta: {
        title: '我的信息'
    }
}]

const router = new VueRouter({
    routes,
    mode: 'history',
})

// router.beforeEach((to, from, next) => {
//     if (to.matched[0].meta.title) {
//         document.title = to.matched[0].meta.title;
//     }
//     next();
// })

export default router