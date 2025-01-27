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
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/Login.vue')
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
    path: '/myOpportunities',
    name: 'My Opportunities',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "myOpportunities" */ '../views/MyOpportunities.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboardAdmin',
    name: 'Dashboard Admin',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "DashboardAdmin" */ '../views/DashboardAdmin.vue'
      ),
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
    path: '/activitiesLog',
    name: 'Activity Log',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "ActivityLog'" */ '../views/ActivityLog.vue'),
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
    path: '/opportunities',
    name: 'Opportunities',
    component: () =>
      import(
        /* webpackChunkName: "Opportunities" */ '../views/Opportunities.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/sales-rep',
    name: 'Sales Rep',
    component: () =>
      import(/* webpackChunkName: "SalesRep" */ '../views/SalesRep.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/country-region-territory',
    name: 'Country Region Territory',
    component: () =>
      import(
        /* webpackChunkName: "CountryRegionTerritory" */ '../views/CountryRegionTerritory.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/product',
    name: 'Product',
    component: () =>
      import(/* webpackChunkName: "Product" */ '../views/Products.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/campaign',
    name: 'Campaign',
    component: () =>
      import(/* webpackChunkName: "Campaign" */ '../views/Campaign.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/industry',
    name: 'Industries',
    component: () =>
      import(/* webpackChunkName: "Industries" */ '../views/Industries.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/states',
    name: 'States',
    component: () =>
      import(/* webpackChunkName: "States" */ '../views/States.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/salesFunnel',
    name: 'Sales Funnel',
    component: () =>
      import(/* webpackChunkName: "SalesFunnel" */ '../views/SalesFunnel.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/gbqReports',
    name: 'PLM Reports',
    component: () =>
      import(/* webpackChunkName: "GBQReports" */ '../views/GBQReports.vue'),
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
