import Vue from 'vue';
import VueRouter from 'vue-router';
import Users from '../views/Users';
import Login from '../views/Login';

localStorage.getItem('token');

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '*',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/activities',
    name: 'Activity Tracker',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "ActivityTracker'" */ '../views/ActivityTracker.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/new-opportunity',
    name: 'New Opportunity',
    component: () =>
      import(
        /* webpackChunkName: "newOpportunity" */ '../views/NewOpportunity.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/edit-opportunity',
    name: 'Edit Opportunity',
    component: () =>
      import(
        /* webpackChunkName: "EditOpportunity" */ '../views/EditOpportunity.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    meta: { requiresAuth: true }
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (window.USER === null && to.path !== 'login') {
      next({
        name: 'Login'
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
