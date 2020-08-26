import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import MaterialCode from "../views/MaterialCode";
import RevenueAccount from "../views/RevenueAccount";
import ProductTitle from "../views/ProductTitle";
import RegionAssignedVP from "../views/RegionAssignedVP";
import ProductGroupHierachy from "../views/ProductGroupHierachy";
import Personnel from "../views/Personnel";
import Product from "../views/Product";
import CountryMap from "../views/Opportunity";
import LDStage from "../views/LDStage";
import LikeLihoodMap from "../views/LikeLihoodMap";
import Login from "../views/Login";
import Users from "../views/Users";
import CountryRegionTerritory from "../views/CountryRegionTerritory";
import SNCustomerName from "../views/SNCustomerName";
import Opportunity from "../views/Opportunity";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  // {
  //   path: '/',
  //   name: 'Login',
  //   component: Login
  // },
  {
    path: '*',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue')
  },
  {
    path: '/material_code',
    name: 'material_code',
    component: MaterialCode
  },
  {
    path: '/revenue_account',
    name: 'revenue_account',
    component: RevenueAccount
  },
  {
    path: '/product_title',
    name: 'product_title',
    component: ProductTitle
  },
  {
    path: '/region_assigned_vp',
    name: 'region_assigned_vp',
    component: RegionAssignedVP
  },
  {
    path: '/product_group_hierachy',
    name: 'product_group_hierachy',
    component: ProductGroupHierachy
  },
  {
    path: '/personnel',
    name: 'personnel',
    component: Personnel
  },
  {
    path: '/product',
    name: 'product',
    component: Product
  },
  {
    path: '/opportunity',
    name: 'opportunity',
    component: Opportunity
  },
  {
    path: '/ld-stage',
    name: 'ld-stage',
    component: LDStage
  },
  {
    path: '/likelihood-map',
    name: 'Likelihood Map',
    component: LikeLihoodMap
  },
  {
    path: '/users',
    name: 'Users',
    component: Users
  },
  {
    path: '/country-region-territory',
    name: 'Country_Region_Territory',
    component: CountryRegionTerritory
  },
  {
    path: '/sn-customer-name',
    name: 'SN_Customer_Name',
    component: SNCustomerName
  },
];

const router = new VueRouter({
  routes
});

export default router
