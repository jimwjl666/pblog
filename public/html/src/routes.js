import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import blogList from './views/blog/list.vue'
import addBlog from './views/blog/add.vue'
import blogType from './views/blogType/list.vue'
import tag from './views/blogTag/list.vue'
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
        name: '文章管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/blog', component: blogList, name: '文章列表' },
            { path: '/blog/add', component: addBlog, name: '新增文章' },
            { path:'/blog/type',component:blogType,name:'文章分类'},
            { path:'/blog/tag',component:tag,name:'文章tag'}
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;