import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },
  {
    path: '/tasks',
    name: '任务管理',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: '任务管理',
      icon: 'skill',
      menu: 'tasks-manage'
    },
    redirect: ''
  },
  {
    path: '/monitor',
    name: '监控管理',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: '监控管理',
      icon: 'eye',
      menu: 'monitor-manage'
    },
    redirect: ''
  },
  {
    path: '/service',
    name: '服务管理',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: '服务管理',
      icon: 'cc-service',
      menu: 'service-manage'
    },
    redirect: ''
  },
  {
    path: '/cmdb',
    name: '资源管理',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: '资源管理',
      icon: 'cc-architecture',
      menu: 'cmdb-manage'
    },
    redirect: '/cmdb/model',
    children: [
      {
        path: 'model',
        component: () => import('@/views/cmdb/model'),
        meta: { title: '模型', icon: 'cc-module', menu: 'cmdb-model' }
      },
      {
        path: 'edit_type/:id',
        hidden: true,
        component: () => import('@/views/cmdb/editModel'),
        meta: { title: '修改模型', menu: 'cmdb-type-edit' }
      },
      {
        path: 'instance',
        component: () => import('@/views/cmdb/instance'),
        meta: { title: '实例', icon: 'cc-vmware', menu: 'cmdb-instance' }
      },
      {
        path: 'all_instances/:id',
        hidden: true,
        component: () => import('@/views/cmdb/allInstance'),
        meta: { title: '所有实例', menu: 'cmdb-all-instance' }
      }
    ]
  },
  {
    path: '/cmdb/web_ssh/:id',
    hidden: true,
    component: () => import('@/views/cmdb/webSsh'),
    meta: { title: '网页终端', menu: 'cmdb-web-ssh' }
  },
  {
    path: '/manage',
    component: Layout,
    name: '系统管理',
    alwaysShow: true,
    meta: {
      title: '系统管理',
      icon: 'el-icon-s-tools',
      menu: 'system-manage'
    },
    redirect: '/manage/users',
    children: [
      {
        path: 'users',
        component: () => import('@/views/user/userList'),
        meta: { title: '用户管理', icon: 'el-icon-user-solid', menu: 'user-manage' }
      },
      {
        path: '/user/modify_self',
        component: () => import('@/views/user/editSelf'),
        meta: { title: '修改用户信息' },
        hidden: true
      },
      {
        path: '/user/add',
        component: () => import('@/views/user/userAdd'),
        meta: { title: '新增用户', menu: 'user-add' },
        hidden: true
      },
      {
        path: 'roles',
        component: () => import('@/views/role/roleList'),
        meta: { title: '角色管理', icon: 'peoples', menu: 'role-manage' }
      },
      {
        path: '/role/edit/:id',
        component: () => import('@/views/role/roleEdit'),
        hidden: true,
        meta: { title: '角色编辑', menu: 'role-edit' }
      },
      {
        path: 'perms',
        component: () => import('@/views/perm/permList'),
        meta: { title: '权限管理', icon: 'eye-open', menu: 'perm-manage' }
      },
      {
        path: 'menus',
        component: () => import('@/views/menu/menuList'),
        meta: { title: '菜单管理', icon: 'list', menu: 'menu-manage' }
      },
      {
        path: 'records',
        component: () => import('@/views/record/recordList'),
        meta: { title: '操作记录', icon: 'el-icon-postcard', menu: 'record-manage' }
      }]
  },
  {
    path: 'gitlab',
    component: Layout,
    children: [
      {
        path: 'http://git.si-tech.com.cn:9002/opsapi/opsapi-webserver',
        meta: { title: 'gitlab', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

/**
 * 根据role动态构建路由
 */
export const asyncRoutes = [
  {
    path: '/manage',
    component: Layout,
    name: '系统管理',
    alwaysShow: true,
    meta: {
      title: '系统管理',
      icon: 'el-icon-s-tools',
      menu: 'system-manage'
    },
    redirect: '/manage/users',
    children: [
      {
        path: 'users',
        component: () => import('@/views/user/userList'),
        meta: { title: '用户管理', icon: 'el-icon-user-solid', menu: 'user-manage' }
      },
      {
        path: '/user/modify_self',
        component: () => import('@/views/user/editSelf'),
        meta: { title: '修改用户信息' },
        hidden: true
      },
      {
        path: '/user/add',
        component: () => import('@/views/user/userAdd'),
        meta: { title: '新增用户', menu: 'user-add' },
        hidden: true
      },
      {
        path: 'roles',
        component: () => import('@/views/role/roleList'),
        meta: { title: '角色管理', icon: 'peoples', menu: 'role-manage' }
      },
      {
        path: '/role/edit/:id',
        component: () => import('@/views/role/roleEdit'),
        hidden: true,
        meta: { title: '角色编辑', menu: 'role-edit' }
      },
      {
        path: 'perms',
        component: () => import('@/views/perm/permList'),
        meta: { title: '权限管理', icon: 'eye-open', menu: 'perm-manage' }
      },
      {
        path: 'menus',
        component: () => import('@/views/menu/menuList'),
        meta: { title: '菜单管理', icon: 'list', menu: 'menu-manage' }
      },
      {
        path: 'records',
        component: () => import('@/views/record/recordList'),
        meta: { title: '操作记录', icon: 'el-icon-postcard', menu: 'record-manage' }
      }]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
