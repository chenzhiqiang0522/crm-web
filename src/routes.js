import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Forbidden from './views/403.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'
import Deparment from './views/org/Department.vue'
import Authority from "./views/permission/Authority.vue";
import Role from "./views/permission/Role.vue";
import Employee from "./views/org/Employee.vue";
import OperateMenu from "./views/permission/OperateMenu.vue";

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '',
        hidden: true,
        children: [
            {
                path: '/403',
                component: Forbidden
            }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '首页',
        iconCls: 'fa fa-bar-chart',
        leaf: true,
        children: [
            {path: '/echarts', component: echarts, name: 'echarts'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '机构管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            {path: '/department', component: Deparment, name: '部门列表'},
            {path: '/form', component: Form, name: 'Form'},
            {path: '/employee', component: Employee, name: '员工列表'},
        ]
    },
    {
        path: '/',
        component: Home,
        name: '权限管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            {path: '/authority', component: Authority, name: '权限列表'},
            {path: '/role', component: Role, name: '角色列表'},
            {path: '/menu', component: OperateMenu, name: '菜单列表'},
        ]
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '导航一',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            {path: '/main', component: Main, name: '主页', hidden: true},
            {path: '/table', component: Table, name: 'Table'},
            {path: '/form', component: Form, name: 'Form'},
            {path: '/user', component: user, name: '列表'},
        ]
    },
    {
        path: '/',
        component: Home,
        name: '导航二',
        iconCls: 'fa fa-id-card-o',
        children: [
            {path: '/page4', component: Page4, name: '页面4'},
            {path: '/page5', component: Page5, name: '页面5'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            {path: '/page6', component: Page6, name: '导航三'}
        ]
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: 'Charts',
    //     iconCls: 'fa fa-bar-chart',
    //     children: [
    //         {path: '/echarts', component: echarts, name: 'echarts'}
    //     ]
    // },
    {
        path: '*',
        hidden: true,
        redirect: {path: '/404'}
    }
];

export default routes;