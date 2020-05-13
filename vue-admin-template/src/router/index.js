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
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// export const constantRoutes = [
//   {
//     path: '/login',
//     component: () => import('@/views/login/index'),
//     hidden: true
//   },

//   {
//     path: '/404',
//     component: () => import('@/views/404'),
//     hidden: true
//   },

//   {
//     path: '/',
//     component: Layout,
//     redirect: '/dashboard',
//     children: [{
//       path: 'dashboard',
//       name: 'Dashboard',
//       component: () => import('@/views/dashboard/index'),
//       meta: { title: '首页', icon: 'dashboard', affix: true }
//     }]
//   },

//   {
//     path: '/paper',
//     component: Layout,
//     redirect: '/paper/mine',
//     meta: { title: '试卷管理', icon: 'form' },
//     children: [
//       {
//         path: 'create',
//         name: 'Create',
//         component: () => import('@/views/paper/create/index'),
//         meta: { title: '创建试卷' }
//       },
//       {
//         path: 'mine',
//         name: 'Mine',
//         component: () => import('@/views/paper/mine/index'),
//         meta: { title: '我的试卷' }
//       },
//       {
//         path: 'edit/:id',
//         name: 'EditPaper',
//         component: () => import('@/views/paper/edit/index'),
//         meta: { title: '编辑试卷' },
//         hidden: true
//       }
//     ]
//   },

//   {
//     path: '/exam',
//     component: Layout,
//     meta: { title: '考试管理', icon: 'example' },
//     children: [
//       {
//         path: 'searchPaper',
//         name: 'SearchPaper',
//         component: () => import('@/views/exam/searchPaper'),
//         meta: { title: '查找试卷' }
//       },
//       {
//         path: 'examination',
//         name: 'Examination',
//         component: () => import('@/views/exam/examination'),
//         meta: { title: '考试' },
//         hidden: true
//       },
//       {
//         path: 'examDetail',
//         name: 'ExamDetail',
//         component: () => import('@/views/exam/examDetail'),
//         meta: { title: '考试详情' },
//         hidden: true
//       },
//       {
//         path: 'manage',
//         name: 'Manage',
//         component: () => import('@/views/exam/manage'),
//         meta: { title: '考试情况' }
//       },
//       {
//         path: 'mark',
//         name: 'Mark',
//         component: () => import('@/views/exam/mark'),
//         meta: { title: '批改试卷' },
//         hidden: true
//       }
//     ]
//   },

//   {
//     path: '/question',
//     component: Layout,
//     meta: { title: '我的试题', icon: 'nested' },
//     children: [
//       {
//         path: 'addQuestion',
//         name: 'AddQuestion',
//         component: () => import('@/views/question/addQuestion/index'),
//         meta: { title: '添加试题' }
//       },
//       {
//         path: 'wrongQuestion',
//         name: 'WrongQuestion',
//         component: () => import('@/views/question/wrongQuestion/index'),
//         meta: { title: '错题集' }
//       }
//     ]
//   },

//   {
//     path: '/userInfo',
//     component: Layout,
//     children: [{
//       path: 'index',
//       name: 'UserInfo',
//       component: () => import('@/views/userInfo/index'),
//       meta: { title: '个人中心', icon: 'user' }
//     }]
//   },
//   // 404 page must be placed at the end !!!
//   { path: '*', redirect: '/404', hidden: true }
// ]

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
      meta: { title: '首页', icon: 'dashboard', affix: true }
    }]
  }
]

export const asyncRoutes = [
  {
    path: '/paper',
    component: Layout,
    redirect: '/paper/mine',
    meta: { title: '试卷管理', icon: 'form', roles: ['T', 'S'] },
    children: [
      {
        path: 'create',
        name: 'Create',
        component: () => import('@/views/paper/create/index'),
        meta: { title: '创建试卷', roles: ['T'] }
      },
      {
        path: 'mine',
        name: 'Mine',
        component: () => import('@/views/paper/mine/index'),
        meta: { title: '我的试卷', roles: ['T', 'S'] }
      },
      {
        path: 'edit/:id',
        name: 'EditPaper',
        component: () => import('@/views/paper/edit/index'),
        meta: { title: '编辑试卷', roles: ['T'] },
        hidden: true
      }
    ]
  },

  {
    path: '/exam',
    component: Layout,
    redirect: '/exam/searchPaper',
    meta: { title: '考试管理', icon: 'example' },
    children: [
      {
        path: 'searchPaper',
        name: 'SearchPaper',
        component: () => import('@/views/exam/searchPaper'),
        meta: { title: '查找试卷', roles: ['T', 'S'] }
      },
      {
        path: 'examination',
        name: 'Examination',
        component: () => import('@/views/exam/examination'),
        meta: { title: '考试', roles: ['T', 'S'] },
        hidden: true
      },
      {
        path: 'examDetail',
        name: 'ExamDetail',
        component: () => import('@/views/exam/examDetail'),
        meta: { title: '考试详情', roles: ['T', 'S'] },
        hidden: true
      },
      {
        path: 'manage',
        name: 'Manage',
        component: () => import('@/views/exam/manage'),
        meta: { title: '考试情况', roles: ['T'] }
      },
      {
        path: 'mark',
        name: 'Mark',
        component: () => import('@/views/exam/mark'),
        meta: { title: '批改试卷', roles: ['T'] },
        hidden: true
      }
    ]
  },

  {
    path: '/question',
    component: Layout,
    meta: { title: '我的试题', icon: 'nested' },
    children: [
      {
        path: 'addQuestion',
        name: 'AddQuestion',
        component: () => import('@/views/question/addQuestion/index'),
        meta: { title: '添加试题' }
      },
      {
        path: 'collection',
        name: 'Collection',
        component: () => import('@/views/question/collection/index'),
        meta: { title: '收藏题集' }
      },
      {
        path: 'editQuestion',
        name: 'EditQuestion',
        component: () => import('@/views/question/editQuestion/index'),
        meta: { title: '编辑试题' },
        hidden: true
      }
    ]
  },

  {
    path: '/userInfo',
    component: Layout,
    children: [{
      path: 'index',
      name: 'UserInfo',
      component: () => import('@/views/userInfo/index'),
      meta: { title: '个人中心', icon: 'user' }
    }]
  },

  {
    path: '/userList',
    component: Layout,
    children: [{
      path: 'index',
      name: 'UserList',
      component: () => import('@/views/userList/index'),
      meta: { title: '用户列表', icon: 'peoples', roles: ['admin'] }
    }]
  },

  {
    path: '/paperList',
    component: Layout,
    children: [{
      path: 'index',
      name: 'paperList',
      component: () => import('@/views/paperList/index'),
      meta: { title: '试卷列表', icon: 'form', roles: ['admin'] }
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
