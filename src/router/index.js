import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import store from '../store'

Vue.use(Router);

const routes = [
  {
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/Login.vue')
  },
  {
    path: '/task',
    name: 'Task',
    meta: {
      requireAuth: true,
      roles: [1, 2]
    },
    component: () => import('../components/Task.vue')
  },
  {
    path: '/allot',
    name: 'Allot',
    meta: {
      requireAuth: true,
      roles: [1, 2]
    },
    component: () => import('../components/Allot.vue')
  },
  {
    path: '/tools',
    name: 'Tools',
    component: () => import('../components/Tools.vue')
  },
  {
    path: '/trans',
    name: 'Trans',
    meta: {
      requireAuth: true,
      roles: [1, 2]
    },
    component: () => import('../components/Trans.vue')

  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../components/test.vue')
  },
];

const router = new Router({
  routes
});

//路由权限拦截，先判断是否需要的登录，在判断role是否允许；未登录会跳转登录。
router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {
        if (to.meta.roles.includes(store.state.role)) {
            if (store.state.token) {
                next()
            } else {
                plus.nativeUI.toast("请登录");
                next({
                    path: '/login',
                    query: {redirect: to.fullPath}
                })
            }
        } else {
            if (!store.state.token) {
                next({
                    path: 'login',
                    query: {redirect: to.fullPath}
                })
            }
            else {
              plus.nativeUI.alert("没有权限","权限验证","确定")
            }
        }
    } else {
        next()
    }
});


export default router
