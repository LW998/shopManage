import {
    get,
    post
} from './request'

//登录接口
export const toLogin = (p) => get('/login', p);

//查询管理员
export const queryManage = () => get('/queryManage');

//查询用户
export const queryUser = () => get('/queryUser');

//修改用户信息
export const updateUser = (p) => post('/updateUser', p);

//修改用户权限
export const modifyUser = (p) => post('/modifyUser', p);

//添加管理员
export const addManage = (p) => post('/addManage', p);

//修改管理员权限
export const modifyManage = (p) => post('/modifyManage', p);

export class manageFormat {
    constructor(res) {
        this.uid = res.uid;
        this.username = res.username;
        this.password = res.password;
        this.role = res.role;
        this.show = res.role !== 0;
        this.list = this.getList(res);
    }
    getList(res) {
        let {
            product,
            queryOrder,
            makeOrder,
            permissions
        } = res,
        ary = [];
        if (product) {
            ary.push('product');
        }
        if (queryOrder) {
            ary.push('queryOrder');
        }
        if (makeOrder) {
            ary.push('makeOrder');
        }
        if (permissions) {
            ary.push('permissions');
        }
        return ary
    }
}